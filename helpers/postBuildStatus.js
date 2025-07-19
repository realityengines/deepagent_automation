
import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const slackToken = process.env.SLACK_TOKEN;
const mainChannelId = process.env.SLACK_CHANNEL_ID || "C0189FJRC9E";
const failureChannelId = process.env.FAILURE_SLACK_CHANNEL_ID || "C07FJG27D2L";

// Determine which workflow is running based on GITHUB_WORKFLOW environment variable
const workflowName = process.env.GITHUB_WORKFLOW || '';
let targetChannelId = mainChannelId;

if (workflowName.toLowerCase().includes('regression')) {
  console.log('Detected regression workflow, using regression channel');
  targetChannelId = "C08PQT0GPDE";
} else if (workflowName.toLowerCase().includes('smoke')) {
  console.log('Detected smoke workflow, using smoke channel');
  targetChannelId = "C0189FJRC9E";
} else {
  console.log(`Using default channel from environment: ${targetChannelId}`);
}

if (!slackToken) {
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

// Helper function to validate thread_ts
function isValidThreadTs(threadTs) {
  if (!threadTs) {
    console.log('thread_ts is null, undefined, or empty');
    return false;
  }
  
  const threadTsStr = String(threadTs).trim();
  
  // Check for invalid values
  const invalidValues = ['', '0', 'null', 'undefined', 'false'];
  if (invalidValues.includes(threadTsStr.toLowerCase())) {
    console.log(`thread_ts is invalid value: "${threadTsStr}"`);
    return false;
  }
  
  // Check if it matches Slack timestamp format (should be a decimal number)
  const timestampRegex = /^\d+\.\d+$/;
  if (!timestampRegex.test(threadTsStr)) {
    console.log(`thread_ts doesn't match expected format: "${threadTsStr}"`);
    return false;
  }
  
  console.log(`thread_ts is valid: "${threadTsStr}"`);
  return true;
}

// Helper function to extract examples from feature files
function extractExamplesFromFeatureFiles() {
  const examplePrompts = [];
  const featuresDir = path.join(__dirname, '..', 'features');
  
  try {
    if (!fs.existsSync(featuresDir)) {
      console.log('Features directory not found, skipping example extraction');
      return examplePrompts;
    }

    const featureFiles = fs.readdirSync(featuresDir).filter(file => file.endsWith('.feature'));
    
    for (const file of featureFiles) {
      const filePath = path.join(featuresDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract examples from scenario outlines
      const exampleMatches = content.match(/Examples:\s*\n([\s\S]*?)(?=\n\s*(?:Scenario|Feature|$))/g);
      
      if (exampleMatches) {
        for (const exampleBlock of exampleMatches) {
          const lines = exampleBlock.split('\n').filter(line => line.trim());
          
          // Skip the "Examples:" line and header line
          const dataLines = lines.slice(2);
          
          for (const line of dataLines) {
            if (line.trim() && line.includes('|')) {
              const columns = line.split('|').map(col => col.trim()).filter(col => col);
              
              // Assuming the first column contains the prompt
              if (columns.length > 0 && columns[0]) {
                examplePrompts.push({
                  prompt: columns[0],
                  source: file,
                  promptSource: 'feature-file'
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error extracting examples from feature files:', error);
  }
  
  return examplePrompts;
}

// Helper function to get scenario statuses from Cucumber report
async function getScenarioStatuses() {
  try {
    const reportPath = path.join(__dirname, '..', 'reports', 'cucumber-report.json');
    
    if (!fs.existsSync(reportPath)) {
      console.log('Cucumber report not found, trying to extract from feature files');
      return extractExamplesFromFeatureFiles();
    }

    const reportContent = fs.readFileSync(reportPath, 'utf8');
    const report = JSON.parse(reportContent);
    
    const scenarios = [];
    
    for (const feature of report) {
      for (const element of feature.elements || []) {
        if (element.type === 'scenario') {
          // Determine scenario status
          const steps = element.steps || [];
          const hasFailedStep = steps.some(step => step.result && step.result.status === 'failed');
          const status = hasFailedStep ? 'failed' : 'passed';
          
          // Extract prompt from scenario name or steps
          let prompt = element.name || 'Unknown scenario';
          let conversationURL = null;
          let promptSource = 'cucumber-report';
          
          // Try to extract prompt from steps
          for (const step of steps) {
            if (step.name && (step.name.includes('prompt') || step.name.includes('ask') || step.name.includes('query'))) {
              // Extract quoted text from step
              const quotedMatch = step.name.match(/"([^"]+)"/);
              if (quotedMatch) {
                prompt = quotedMatch[1];
                break;
              }
            }
          }
          
          // Try to extract conversation URL from step outputs or embeddings
          for (const step of steps) {
            if (step.embeddings) {
              for (const embedding of step.embeddings) {
                if (embedding.data && typeof embedding.data === 'string') {
                  const urlMatch = embedding.data.match(/https?:\/\/[^\s]+/);
                  if (urlMatch) {
                    conversationURL = urlMatch[0];
                    break;
                  }
                }
              }
            }
            if (conversationURL) break;
          }
          
          scenarios.push({
            name: element.name,
            status: status,
            prompt: prompt,
            conversationURL: conversationURL,
            promptSource: promptSource
          });
        }
      }
    }
    
    return scenarios;
  } catch (error) {
    console.error('Error reading scenario statuses:', error);
    // Fallback to feature file extraction
    return extractExamplesFromFeatureFiles();
  }
}

async function postBuildStatus(status, threadTs) {
  try {
    console.log(`=== postBuildStatus called ===`);
    console.log(`Status: ${status}`);
    console.log(`Thread TS received: "${threadTs}" (type: ${typeof threadTs})`);
    console.log(`Target Channel: ${targetChannelId}`);
    
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

      if (failedScenarios > 0) {
        summaryText += `:x: Failed: ${failedScenarios}\n`;
      }
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
        
        // Add conversation URL if available
        let scenarioText = `${statusIcon} ${scenario.name}: ${promptText}`;
        if (scenario.conversationURL) {
          scenarioText += ` - <${scenario.conversationURL}|View Conversation>`;
        }
        
        scenarioStatusText += `${scenarioText}\n`;
      }
    }
    
    // Build the main message text
    const messageText = `Build ${status === 'success' ? 'Succeeded' : 'Failed'} ${buildUrl ? `(<${buildUrl}|View Build>)` : ''}${summaryText}${scenarioStatusText}`;
    
    // Validate and attempt thread posting
    let threadPostSuccess = false;
    const validThreadTs = isValidThreadTs(threadTs);
    
    if (validThreadTs) {
      try {
        const threadMessage = {
          text: messageText,
          channel: targetChannelId,
          thread_ts: String(threadTs).trim(),
          mrkdwn: true
        };
        
        console.log(`Attempting to post ${status} message to thread`);
        console.log(`Thread message payload:`, {
          channel: threadMessage.channel,
          thread_ts: threadMessage.thread_ts,
          text_length: threadMessage.text.length
        });
        
        const threadResult = await slackClient.chat.postMessage(threadMessage);
        
        if (threadResult.ok) {
          console.log(`✅ Thread message posted successfully: ${threadResult.ts}`);
          threadPostSuccess = true;
        } else {
          console.error(`❌ Thread message failed:`, threadResult.error);
          threadPostSuccess = false;
        }
      } catch (threadError) {
        console.error('❌ Error posting to thread:', {
          message: threadError.message,
          code: threadError.code,
          data: threadError.data
        });
        
        // Log specific Slack API errors
        if (threadError.data && threadError.data.error) {
          console.error(`Slack API Error: ${threadError.data.error}`);
          if (threadError.data.error === 'thread_not_found') {
            console.error('The thread_ts provided does not exist or is not accessible');
          } else if (threadError.data.error === 'channel_not_found') {
            console.error('The channel ID provided does not exist or bot is not a member');
          }
        }
        
        console.log('Will fall back to posting as standalone message');
        threadPostSuccess = false;
      }
    } else {
      console.log(`❌ Invalid thread_ts provided: "${threadTs}", posting as standalone message`);
    }
    
    // If thread posting failed or no valid thread_ts provided, post as standalone message
    if (!threadPostSuccess) {
      try {
        const standaloneMessage = {
          text: messageText,
          channel: targetChannelId,
          mrkdwn: true
        };
        
        console.log(`Posting ${status} message as standalone to channel ${targetChannelId}`);
        const result = await slackClient.chat.postMessage(standaloneMessage);
        
        if (result.ok) {
          console.log(`✅ Standalone message posted successfully: ${result.ts}`);
        } else {
          console.error(`❌ Standalone message failed:`, result.error);
          throw new Error(`Failed to post standalone message: ${result.error}`);
        }
      } catch (standaloneError) {
        console.error('❌ Error posting standalone message:', standaloneError);
        throw standaloneError;
      }
    }
    
    // If build failed, also post to failure channel (but only if it's different from main channel)
    // This should NOT be posted to thread - it's a separate notification
    if (status === 'failure' && failureChannelId && failureChannelId !== targetChannelId) {
      try {
        const failureMessage = {
          text: `🚨 *Build Failed* ${buildUrl ? `(<${buildUrl}|View Build>)` : ''}${summaryText}${scenarioStatusText}`,
          channel: failureChannelId,
          mrkdwn: true
          // Note: No thread_ts here - this is a separate notification
        };
        
        console.log(`Posting failure message to failure channel ${failureChannelId}`);
        const failureResult = await slackClient.chat.postMessage(failureMessage);
        
        if (failureResult.ok) {
          console.log(`✅ Failure message posted to failure channel: ${failureResult.ts}`);
        } else {
          console.error(`❌ Failure message to failure channel failed:`, failureResult.error);
        }
      } catch (failureError) {
        console.error('❌ Error posting to failure channel:', failureError);
        // Don't fail the entire function if failure channel posting fails
      }
    }
    
    console.log(`=== postBuildStatus completed successfully ===`);
    return true;
  } catch (error) {
    console.error('❌ Error in postBuildStatus:', error);
    return false;
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.length >= 1) {
  const status = args[0];
  const threadTs = args[1] || null;
  
  console.log(`Command line execution:`);
  console.log(`  Status: ${status}`);
  console.log(`  Thread TS: ${threadTs}`);
  
  postBuildStatus(status, threadTs)
    .then(success => {
      if (success) {
        console.log('✅ Build status posted successfully');
        process.exit(0);
      } else {
        console.error('❌ Failed to post build status');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export { postBuildStatus };