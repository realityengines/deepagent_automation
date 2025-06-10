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
    
    console.log(`Found ${featureFiles.length} feature files`);
    
    for (const file of featureFiles) {
      const filePath = path.join(featuresDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`Processing feature file: ${file}`);
      
      // Extract scenario outlines and their examples
      const scenarioOutlines = content.match(/Scenario Outline:([\s\S]*?)(?=\n\s*(?:Scenario|Feature|@|$))/g) || [];
      console.log(`Found ${scenarioOutlines.length} scenario outlines in ${file}`);
      
      for (const outline of scenarioOutlines) {
        // Get scenario name
        const nameMatch = outline.match(/Scenario Outline:\s*(.+)/);
        if (!nameMatch) continue;
        
        const scenarioName = nameMatch[1].trim();
        console.log(`Processing scenario outline: ${scenarioName}`);
        
        // Extract examples table
        const examplesMatch = outline.match(/Examples:[\s\S]*?\|([^\|]+)\|([^\|]+)\|/g);
        if (!examplesMatch) {
          console.log(`No examples table found for scenario: ${scenarioName}`);
          continue;
        }
        
        // Process the examples table
        const lines = examplesMatch[0].split('\n').filter(line => line.trim().startsWith('|'));
        
        if (lines.length >= 2) { // Need at least header and one data row
          const headerCells = lines[0].split('|').map(cell => cell.trim()).filter(cell => cell);
          const dataCells = lines[1].split('|').map(cell => cell.trim()).filter(cell => cell);
          
          console.log(`Examples table headers: ${headerCells.join(', ')}`);
          
          // Find the prompt column index - look for various column names that might contain prompts
          const promptIndex = headerCells.findIndex(header => 
            header.toLowerCase().includes('prompt') || 
            header.toLowerCase().includes('search') || 
            header.toLowerCase().includes('query') || 
            header.toLowerCase().includes('text') || 
            header.toLowerCase().includes('input'));
          
          if (promptIndex !== -1 && promptIndex < dataCells.length) {
            examples[scenarioName] = dataCells[promptIndex];
            console.log(`Extracted example for ${scenarioName}: ${dataCells[promptIndex].substring(0, 30)}...`);
          } else {
            console.log(`Could not find prompt column in examples table for ${scenarioName}`);
          }
        }
      }
      
      // Also extract regular scenarios with docstrings or quoted text
      const scenarios = content.match(/Scenario:([\s\S]*?)(?=\n\s*(?:Scenario|Scenario Outline|Feature|@|$))/g) || [];
      console.log(`Found ${scenarios.length} regular scenarios in ${file}`);
      
      for (const scenario of scenarios) {
        // Get scenario name
        const nameMatch = scenario.match(/Scenario:\s*(.+)/);
        if (!nameMatch) continue;
        
        const scenarioName = nameMatch[1].trim();
        console.log(`Processing regular scenario: ${scenarioName}`);
        
        // Look for docstrings (text between """ markers)
        const docstringMatch = scenario.match(/"""([\s\S]*?)"""/); 
        if (docstringMatch && docstringMatch.length > 1) {
          examples[scenarioName] = docstringMatch[1].trim();
          console.log(`Extracted docstring for ${scenarioName}: ${examples[scenarioName].substring(0, 30)}...`);
          continue;
        }
        
        // Look for quoted text in steps
        const quotedTextMatch = scenario.match(/"([^"]+)"/); 
        if (quotedTextMatch && quotedTextMatch.length > 1) {
          examples[scenarioName] = quotedTextMatch[1];
          console.log(`Extracted quoted text for ${scenarioName}: ${examples[scenarioName]}`);
        }
      }
    }
    
    console.log(`Extracted examples for ${Object.keys(examples).length} scenarios`);
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
    console.log('Feature examples extracted:', Object.keys(featureExamples).length);
    
    if (!fs.existsSync(reportPath)) {
      console.warn(`Cucumber report not found at ${reportPath}`);
      return null;
    }
    
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    console.log(`Parsed report data with ${reportData ? reportData.length : 0} features`);
    
    const scenarioStatuses = [];
    
    // Process each feature
    for (const feature of reportData || []) {
      if (!feature.elements) {
        console.log(`Feature without elements: ${feature.name || 'unnamed'}`);
        continue;
      }
      
      console.log(`Processing feature: ${feature.name}, with ${feature.elements.length} elements`);
      
      // Process each element (scenario or background)
      for (const element of feature.elements) {
        // Skip backgrounds
        if (!element || element.type === 'background') continue;
        
        // Get scenario name
        const scenarioName = element.name || 'Unnamed Scenario';
        let scenarioStatus = 'passed'; // Default to passed, will be set to failed if any step fails
        let promptText = null;
        let promptSource = 'none';
        
        console.log(`Processing scenario: ${scenarioName}`);
        
        if (element.steps) {
          console.log(`Scenario has ${element.steps.length} steps`);
          
          for (const step of element.steps) {
            // Look for steps that contain the prompt text or any step with docstring/arguments
            if (step && step.name) {
              // Check for specific step patterns
              const searchPatterns = [
                'I search the prompt',
                'I search a prompt',
                'I search for a prompt',
                'I search for',
                'I enter',
                'I type',
                'with prompt'
              ];
              
              const matchesPattern = searchPatterns.some(pattern => step.name.includes(pattern));
              
              if (matchesPattern) {
                console.log(`Found step with search pattern: ${step.name}`);
                
                // Extract the prompt text from the step arguments
                if (step.arguments && step.arguments.length > 0 && step.arguments[0].content) {
                  promptText = step.arguments[0].content;
                  promptSource = 'step_arguments';
                  console.log(`Extracted prompt from step arguments: ${promptText.substring(0, 30)}...`);
                } else if (step.match && step.match.arguments && step.match.arguments.length > 0) {
                  // Try to extract from match arguments
                  promptText = step.match.arguments[0].val;
                  promptSource = 'step_match_arguments';
                  console.log(`Extracted prompt from step match arguments: ${promptText.substring(0, 30)}...`);
                } else if (step.name.includes('"')) {
                  // Try to extract text between quotes
                  const matches = step.name.match(/"([^"]+)"/); 
                  if (matches && matches.length > 1) {
                    promptText = matches[1];
                    promptSource = 'step_name_quotes';
                    console.log(`Extracted prompt from quotes in step name: ${promptText.substring(0, 30)}...`);
                  }
                }
              } else if (!promptText && step.arguments && step.arguments.length > 0 && step.arguments[0].content) {
                // If we haven't found a prompt yet, check any step with docstring
                promptText = step.arguments[0].content;
                promptSource = 'any_step_with_docstring';
                console.log(`Extracted prompt from any step with docstring: ${promptText.substring(0, 30)}...`);
              }
            }
            
            // Check if any step failed
            if (step.result && step.result.status === 'failed') {
              scenarioStatus = 'failed';
              console.log(`Scenario has failed step: ${step.name || 'unnamed step'}`);
            }
          }
        } else {
          console.log(`Scenario has no steps: ${scenarioName}`);
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
                cell && cell.value && (
                  cell.value.toLowerCase().includes('prompt') || 
                  cell.value.toLowerCase().includes('search') || 
                  cell.value.toLowerCase().includes('query')
                ));
              
              if (promptIndex !== -1 && dataRow[promptIndex] && dataRow[promptIndex].value) {
                promptText = dataRow[promptIndex].value;
                promptSource = 'examples_table';
                console.log(`Extracted prompt from examples table: ${promptText.substring(0, 30)}...`);
              } else {
                console.log(`Could not find prompt column in examples table. Headers: ${headerRow.map(h => h.value).join(', ')}`);
              }
            }
          }
        }
        
        // If we still don't have the prompt text, try the fallback from feature files
        if (!promptText && featureExamples[scenarioName]) {
          promptText = featureExamples[scenarioName];
          promptSource = 'feature_file_fallback';
          console.log(`Extracted prompt from feature file fallback: ${promptText.substring(0, 30)}...`);
        }
        
        // Try to extract from the scenario name itself if it contains a prompt-like pattern
        if (!promptText && scenarioName) {
          if (scenarioName.includes('"')) {
            // Extract text between quotes
            const matches = scenarioName.match(/"([^"]+)"/); 
            if (matches && matches.length > 1) {
              promptText = matches[1];
              promptSource = 'scenario_name_quotes';
              console.log(`Extracted prompt from quotes in scenario name: ${promptText.substring(0, 30)}...`);
            }
          } else if (scenarioName.toLowerCase().includes('search') || 
                    scenarioName.toLowerCase().includes('prompt') || 
                    scenarioName.toLowerCase().includes('query')) {
            // If the scenario name contains keywords, use the whole name as a last resort
            promptText = scenarioName;
            promptSource = 'scenario_name_keywords';
            console.log(`Using scenario name as prompt (last resort): ${promptText}`);
          }
        }
        
        // Add to our results
        scenarioStatuses.push({
          name: scenarioName,
          status: scenarioStatus,
          prompt: promptText || 'N/A',
          promptSource: promptSource
        });
        
        if (!promptText) {
          console.log(`WARNING: Could not extract prompt for scenario: ${scenarioName}`);
        }
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
    console.log(`Got ${scenarioStatuses ? scenarioStatuses.length : 0} scenario statuses`);
    
    if (scenarioStatuses) {
      // Log prompt sources for debugging
      const promptSources = {};
      for (const scenario of scenarioStatuses) {
        promptSources[scenario.promptSource] = (promptSources[scenario.promptSource] || 0) + 1;
      }
      console.log('Prompt sources distribution:', promptSources);
    }
    
    // Build the summary statistics
    let summaryText = '';
    if (scenarioStatuses && scenarioStatuses.length > 0) {
      const totalScenarios = scenarioStatuses.length;
      const passedScenarios = scenarioStatuses.filter(s => s.status === 'passed').length;
      const failedScenarios = totalScenarios - passedScenarios;
      
      summaryText = '\n\n*Summary:*\n';
      summaryText += `:chart_with_upwards_trend: Total Scenarios: ${totalScenarios}\n`;
      summaryText += `:white_check_mark: Passed: ${passedScenarios}\n`;
      summaryText += `:x: Failed: ${failedScenarios}\n`;
    }
    
    // Build the message with scenario statuses
    let scenarioStatusText = '';
    if (scenarioStatuses && scenarioStatuses.length > 0) {
      scenarioStatusText = '\n\n*Scenario Results:*\n';
      for (const scenario of scenarioStatuses) {
        const statusIcon = scenario.status === 'passed' ? ':white_check_mark:' : ':x:';
        // Truncate prompt if it's too long (Slack has message size limits)
        const promptText = scenario.prompt.length > 50 ? 
          `${scenario.prompt.substring(0, 47)}...` : scenario.prompt;
        scenarioStatusText += `${statusIcon} ${scenario.name}: ${promptText}\n`;
      }
    }
    
    // Build the message
    const message = {
      text: `Build ${status === 'success' ? 'Succeeded' : 'Failed'} ${buildUrl ? `(<${buildUrl}|View Build>)` : ''}${summaryText}${scenarioStatusText}`,
      channel: mainChannelId,
      mrkdwn: true
    };
    
    // If thread_ts is provided, post in thread
    if (threadTs) {
      message.thread_ts = threadTs;
    }
    
    // Post to Slack
    console.log(`Posting ${status} message to Slack channel ${mainChannelId}`);
    const result = await slackClient.chat.postMessage(message);
    console.log('Message posted to Slack', result.ts);
    
    // If build failed, also post to failure channel
    if (status === 'failure' && failureChannelId && failureChannelId !== mainChannelId) {
      const failureMessage = {
        text: `Build Failed ${buildUrl ? `(<${buildUrl}|View Build>)` : ''}${summaryText}${scenarioStatusText}`,
        channel: failureChannelId,
        mrkdwn: true
      };
      
      console.log(`Posting failure message to Slack channel ${failureChannelId}`);
      const failureResult = await slackClient.chat.postMessage(failureMessage);
      console.log('Failure message posted to Slack', failureResult.ts);
    }
    
    return true;
  } catch (error) {
    console.error('Error posting to Slack:', error);
    return false;
  }
}

// Get status and thread_ts from command-line arguments
const status = process.argv[2] || 'success';
const threadTs = process.argv[3] || null;

// Post build status to Slack
postBuildStatus(status, threadTs).then(() => {
  console.log('Done posting build status to Slack');
  process.exit(0);
}).catch(error => {
  console.error('Error in postBuildStatus:', error);
  process.exit(1);
});