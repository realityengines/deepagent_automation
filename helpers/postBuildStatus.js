import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
//import testData from '../configs/testData.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const slackToken = process.env.SLACK_TOKEN;
const mainChannelId = process.env.SLACK_CHANNEL_ID || "C0189FJRC9E"; // Replace with your main channel ID Prod_release = C0189FJRC9E , Automation_regression_build= C07FJG27D2L
const failureChannelId = process.env.FAILURE_SLACK_CHANNEL_ID || "C07FJG27D2L"; // Replace with your failure channel ID

if (!slackToken) {
  // Check if we're running in GitHub Actions
  if (process.env.GITHUB_ACTIONS === 'true') {
    console.error('SLACK_TOKEN environment variable is not set in GitHub Actions');
    console.error('Please ensure the SLACK_BOT_TOKEN secret is properly configured in your repository settings.');
  } else {
    console.error('SLACK_TOKEN environment variable is not set for local execution');
    console.error('When running locally, you need to set the SLACK_TOKEN environment variable.');
    console.error('You can add it to your .env file or set it directly in your terminal:');
    console.error('  - For Windows PowerShell: $env:SLACK_TOKEN="your-slack-token"');
    console.error('  - For Windows CMD: set SLACK_TOKEN=your-slack-token');
    console.error('  - For Linux/macOS: export SLACK_TOKEN=your-slack-token');
    console.error('In GitHub Actions, this is set via secrets.SLACK_TOKEN');
  }
  process.exit(1);
}

const slackClient = new WebClient(slackToken);

// Function to extract examples from feature files
async function extractExamplesFromFeatureFiles() {
  const featuresDir = path.join(process.cwd(), 'features');
  const examples = {};
  
  try {
    // Get all feature files
    const featureFiles = fs.readdirSync(featuresDir)
      .filter(file => file.endsWith('.feature'));
    
    for (const file of featureFiles) {
      const filePath = path.join(featuresDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract scenario outlines and their examples
      const scenarioOutlines = content.match(/Scenario Outline:([\s\S]*?)(?=\n\s*(?:Scenario|Feature|@|$))/g) || [];
      
      for (const outline of scenarioOutlines) {
        // Get scenario name
        const nameMatch = outline.match(/Scenario Outline:\s*(.+)/);
        if (!nameMatch) continue;
        
        const scenarioName = nameMatch[1].trim();
        
        // Extract examples table
        const examplesMatch = outline.match(/Examples:[\s\S]*?\|([^\|]+)\|([^\|]+)\|/g);
        if (!examplesMatch) continue;
        
        // Process the examples table
        const lines = examplesMatch[0].split('\n').filter(line => line.trim().startsWith('|'));
        
        if (lines.length >= 2) { // Need at least header and one data row
          const headerCells = lines[0].split('|').map(cell => cell.trim()).filter(cell => cell);
          const dataCells = lines[1].split('|').map(cell => cell.trim()).filter(cell => cell);
          
          // Find the prompt column index
          const promptIndex = headerCells.findIndex(header => 
            header.includes('promat_user_search') || 
            header.includes('prompt'));
          
          if (promptIndex !== -1 && promptIndex < dataCells.length) {
            examples[scenarioName] = dataCells[promptIndex];
          }
        }
      }
    }
    
    return examples;
  } catch (error) {
    console.error('Error extracting examples from feature files:', error);
    return {};
  }
}

// Function to parse Cucumber JSON report and extract scenario statuses
async function getScenarioStatuses() {
  const reportPath = path.join(process.cwd(), 'reports', 'cucumber-report.json');
  
  try {
    // Get examples from feature files as fallback
    const featureExamples = await extractExamplesFromFeatureFiles();
    
    if (!fs.existsSync(reportPath)) {
      console.warn(`Cucumber report not found at ${reportPath}`);
      return null;
    }
    
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const scenarioStatuses = [];
    
    // Process each feature
    for (const feature of reportData || []) {
      // Process each element (scenario or background)
      if (!feature.elements) continue;
      
      for (const element of feature.elements) {
        // Skip backgrounds
        if (!element || element.type === 'background') continue;
        
        // Get scenario name
        const scenarioName = element.name;
        
        // Get scenario status
        let scenarioStatus = 'passed';
        let promptText = '';
        
        // Find the prompt text from the steps
        for (const step of element.steps || []) {
          // Look for steps that contain the prompt text
          if (step.name && (step.name.includes('I search the prompt') || 
              step.name.includes('I search a prompt') || 
              step.name.includes('I search for a prompt'))) {
            // Extract the prompt text from the step arguments
            if (step.arguments && step.arguments.length > 0) {
              promptText = step.arguments[0].content;
            } else if (step.match && step.match.arguments && step.match.arguments.length > 0) {
              // Try to extract from match arguments
              promptText = step.match.arguments[0].val;
            }
          }
          
          // Check if any step failed
          if (step.result && step.result.status === 'failed') {
            scenarioStatus = 'failed';
            break;
          }
        }
        
        // If we couldn't find the prompt text in the steps, try to get it from the examples
        if (!promptText && element.examples && element.examples.length > 0) {
          const examples = element.examples[0];
          if (examples && examples.rows && examples.rows.length > 1) { // First row is header
            const headerRow = examples.rows[0].cells;
            const dataRow = examples.rows[1].cells;
            
            if (headerRow && dataRow) {
              // Find the index of the prompt column
              const promptIndex = headerRow.findIndex(cell => 
                cell && cell.value && (cell.value.includes('promat_user_search') || 
                cell.value.includes('prompt')));
              
              if (promptIndex !== -1 && dataRow[promptIndex] && dataRow[promptIndex].value) {
                promptText = dataRow[promptIndex].value;
              }
            }
          }
        }
        
        // If we still don't have the prompt text, try the fallback from feature files
        if (!promptText && featureExamples[scenarioName]) {
          promptText = featureExamples[scenarioName];
        }
        
        // Add to our results
        scenarioStatuses.push({
          name: scenarioName,
          status: scenarioStatus,
          prompt: promptText || 'N/A'
        });
      }
    }
    
    return scenarioStatuses;
  } catch (error) {
    console.error('Error parsing Cucumber report:', error);
    return null;
  }
}

async function postBuildStatus(status, threadTs) {
  try {
    const buildUrl = `${process.env.GITHUB_SERVER_URL || ''}/${process.env.GITHUB_REPOSITORY || ''}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`;
    
    // Get scenario statuses from Cucumber report
    const scenarioStatuses = await getScenarioStatuses();
    
    // Build the message with scenario statuses
    let scenarioStatusText = '';
    if (scenarioStatuses && scenarioStatuses.length > 0) {
      scenarioStatusText = '\n\n*Scenario Results:*\n';
      for (const scenario of scenarioStatuses) {
        const statusIcon = scenario.status === 'passed' ? ':white_check_mark:' : ':x:';
        // Truncate prompt if it's too long (Slack has message size limits)
        const promptText = scenario.prompt.length > 50 ? 
          `${scenario.prompt.substring(0, 47)}...` : scenario.prompt;
        scenarioStatusText += `${statusIcon} *${scenario.name}*: ${promptText}\n`;
      }
    }
    
    // Build the summary counts
    let summaryText = '';
    if (scenarioStatuses && scenarioStatuses.length > 0) {
      const totalScenarios = scenarioStatuses.length;
      const passedScenarios = scenarioStatuses.filter(s => s.status === 'passed').length;
      const failedScenarios = totalScenarios - passedScenarios;
      
      summaryText = `\n\n*Summary:*\n`;
      summaryText += `:chart_with_upwards_trend: Total Scenarios: ${totalScenarios}\n`;
      summaryText += `:white_check_mark: Passed: ${passedScenarios}\n`;
      if (failedScenarios > 0) {
        summaryText += `:x: Failed: ${failedScenarios}\n`;
      }
    }
    
    // Create the main message
    const message = status === 'success'
      ? `:white_check_mark: Smoke tests completed successfully!\nBuild URL: ${buildUrl}${summaryText}${scenarioStatusText}`
      : `:x: Smoke tests failed!\nBuild URL: ${buildUrl}${summaryText}${scenarioStatusText}`;



    // Check if threadTs is valid
    if (!threadTs || threadTs === '0' || threadTs === 'null' || threadTs === 'undefined') {
      console.log('Invalid thread_ts value:', threadTs);
      console.log('Posting message to channel without thread');
      
      // Post to the channel without thread
      await slackClient.chat.postMessage({
        channel: mainChannelId,
        text: message,
      });
      console.log('Build status posted to Slack channel (not in thread)');
    } else {
      // Post to the original thread
      await slackClient.chat.postMessage({
        channel: mainChannelId,
        text: message,
        thread_ts: threadTs,
      });
      console.log('Build status posted to Slack thread');
    }

    // If build failed, post to failure channel as well
    if (status !== 'success' && failureChannelId != "NONE") {
      await slackClient.chat.postMessage({
        channel: failureChannelId,
        text: `:warning: Build Failure in ${process.env.GITHUB_WORKFLOW}:
Triggered by: ${process.env.GITHUB_ACTOR}
${message}`,
      });
      console.log('Build failure posted to failure channel');
    }
  } catch (error) {
    console.error('Error posting build status to Slack:', error);
  }
}

const status = process.argv[2];
const threadTs = process.argv[3];

postBuildStatus(status, threadTs);