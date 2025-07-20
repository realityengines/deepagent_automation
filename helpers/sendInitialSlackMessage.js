import { WebClient } from '@slack/web-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const slackToken = process.env.SLACK_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID || "C07FJG27D2L";
const initialSlackInfo = process.env.INITIAL_SLACK_INFO || "";
//C07FJG27D2L Automation Regression Build Channel
//C0189FJRC9E Prod Release Channel

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

// Load the GitHub to Slack email mapping
let githubSlackMapping = {};
try {
  const mappingPath = path.join(__dirname, 'github-slack-mapping.json');
  githubSlackMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
} catch (error) {
  console.warn('Warning: Could not load github-slack-mapping.json:', error.message);
  console.warn('Will proceed without user mappings');
}

async function findSlackUserByEmail(email) {
  try {
    console.log(`Looking up Slack user for email: ${email}`);
    const result = await slackClient.users.lookupByEmail({ email });
    if (result.ok) {
      console.log(`Found Slack user: ${result.user.name} (${result.user.id})`);
      return result.user;
    }
  } catch (error) {
    console.error(`Error looking up Slack user for email ${email}:`, error.message);
  }
  return null;
}

async function sendInitialMessage(githubUsername, environment, buildName) {
  let userMention;
  const slackEmail = githubSlackMapping[githubUsername];

  if (slackEmail) {
    const slackUser = await findSlackUserByEmail(slackEmail);
    if (slackUser) {
      userMention = `<@${slackUser.id}>`;
      console.log(`Using Slack user mention: ${userMention}`);
    } else {
      userMention = `@${githubUsername}`;
      console.log(`No Slack user found for email ${slackEmail}, using GitHub username: ${githubUsername}`);
    }
  } else {
    userMention = `@${githubUsername}`;
    console.log(`No mapping found for GitHub username: ${githubUsername}`);
  }

  // Determine which channel to use based on the build name
  let targetChannelId = channelId;
  if (buildName.toLowerCase().includes('regression')) {
    targetChannelId = "C08PQT0GPDE"; // Regression Build Channel
    console.log(`Using Regression channel: ${targetChannelId}`);
  } else if (buildName.toLowerCase().includes('smoke')) {
    targetChannelId = "C0189FJRC9E"; // Prod Release Channel
    console.log(`Using Smoke channel: ${targetChannelId}`);
  } else {
    console.log(`Using default channel from environment: ${targetChannelId}`);
  }

  // Updated message to include "Build Name triggered" with bold formatting
  const message = `:pager: Build *${buildName}* triggered for environment *${environment}* by ${userMention}. ${initialSlackInfo}\nMonitor this thread for test results before launching to prod.`;

  try {
    const response = await slackClient.chat.postMessage({
      channel: targetChannelId,
      text: message,
    });

    if (response.ok) {
      console.log(`Initial message posted to Slack channel ${targetChannelId}`);
      console.log(`Message sent: ${message}`);
      // Output the thread_ts in a format that GitHub Actions can capture
      console.log(`thread_ts=${response.ts}`);
      // Also print it directly for debugging
      console.log(`Thread timestamp: ${response.ts}`);
      return response.ts;
    } else {
      console.error('Error posting initial message:', response.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error posting initial message to Slack:', error);
    process.exit(1);
  }
}

// Get the GitHub username, environment, and build name from command line arguments
const githubUsername = process.argv[2];
const environment = process.argv[3];
const buildName = process.argv[4];

if (!githubUsername || !environment || !buildName) {
  console.error('Usage: node script.js <githubUsername> <environment> <buildName>');
  process.exit(1);
}

sendInitialMessage(githubUsername, environment, buildName);