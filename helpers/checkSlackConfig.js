#!/usr/bin/env node

/**
 * This script checks if the Slack token is properly configured
 * It's designed to be run in GitHub Actions before the main workflow
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const slackToken = process.env.SLACK_TOKEN;
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

function checkSlackConfig() {
  console.log('Checking Slack configuration...');
  
  if (!slackToken) {
    if (isGitHubActions) {
      console.error('ERROR: SLACK_TOKEN environment variable is not set in GitHub Actions');
      console.error('Please ensure the SLACK_TOKEN secret is properly configured in your repository settings.');
      console.error('Go to your repository -> Settings -> Secrets and variables -> Actions -> Repository secrets');
      console.error('Add a secret named SLACK_TOKEN with your Slack bot token value');
    } else {
      console.error('WARNING: SLACK_TOKEN environment variable is not set for local execution');
      console.error('Slack notifications will not work without a valid token.');
      console.error('You can set it in your .env file or directly in your terminal:');
      console.error('  - For Windows PowerShell: $env:SLACK_TOKEN="your-slack-token"');
      console.error('  - For Windows CMD: set SLACK_TOKEN=your-slack-token');
      console.error('  - For Linux/macOS: export SLACK_TOKEN=your-slack-token');
    }
    
    // Exit with error code in GitHub Actions, but continue in local environment
    if (isGitHubActions) {
      process.exit(1);
    }
    return false;
  }
  
  console.log('✅ Slack token is configured');
  
  // Check channel ID
  const channelId = process.env.SLACK_CHANNEL_ID;
  if (!channelId) {
    console.warn('WARNING: SLACK_CHANNEL_ID is not set, using default channel ID');
  } else {
    console.log(`✅ Using Slack channel ID: ${channelId}`);
  }
  
  return true;
}

// Run the check if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkSlackConfig();
}

export default checkSlackConfig;