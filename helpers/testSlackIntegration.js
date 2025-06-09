#!/usr/bin/env node

/**
 * This script tests the Slack integration by sending a test message
 * Run this script to verify your Slack token and channel ID are working
 */

import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const slackToken = process.env.SLACK_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID || "C07FJG27D2L";

// Check if Slack token is set
if (!slackToken) {
  // Check if we're running in GitHub Actions
  if (process.env.GITHUB_ACTIONS === 'true') {
    console.error('SLACK_TOKEN environment variable is not set in GitHub Actions');
    console.error('Please ensure the SLACK_BOT_TOKEN secret is properly configured in your repository settings.');
  } else {
    console.error('SLACK_TOKEN environment variable is not set for local execution');
    console.error('Please set it in your .env file or directly in your terminal:');
    console.error('  - For Windows PowerShell: $env:SLACK_TOKEN="your-slack-token"');
    console.error('  - For Windows CMD: set SLACK_TOKEN=your-slack-token');
    console.error('  - For Linux/macOS: export SLACK_TOKEN=your-slack-token');
  }
  process.exit(1);
}

const slackClient = new WebClient(slackToken);

async function testSlackIntegration() {
  try {
    console.log(`Testing Slack integration with channel ID: ${channelId}`);
    
    // First, try to get channel info to verify the channel exists and is accessible
    try {
      const channelInfo = await slackClient.conversations.info({ channel: channelId });
      console.log(`Channel name: ${channelInfo.channel.name}`);
    } catch (error) {
      console.error(`Error accessing channel: ${error.message}`);
      console.error('This could mean the channel ID is incorrect or the bot does not have access to it.');
      process.exit(1);
    }
    
    // Send a test message
    const message = `:test_tube: This is a test message from the automation framework. If you see this, the Slack integration is working correctly!`;
    
    const response = await slackClient.chat.postMessage({
      channel: channelId,
      text: message,
    });
    
    if (response.ok) {
      console.log('Test message sent successfully!');
      console.log(`Message: ${message}`);
      console.log(`Timestamp: ${response.ts}`);
      
      // Send a follow-up message in the thread
      const threadResponse = await slackClient.chat.postMessage({
        channel: channelId,
        text: `:white_check_mark: Thread reply test successful!`,
        thread_ts: response.ts,
      });
      
      if (threadResponse.ok) {
        console.log('Thread reply sent successfully!');
      } else {
        console.error('Error sending thread reply:', threadResponse.error);
      }
      
      // Delete the test messages after 5 seconds
      console.log('Waiting 5 seconds before deleting test messages...');
      setTimeout(async () => {
        try {
          await slackClient.chat.delete({ channel: channelId, ts: response.ts });
          if (threadResponse.ok) {
            await slackClient.chat.delete({ channel: channelId, ts: threadResponse.ts });
          }
          console.log('Test messages deleted.');
        } catch (error) {
          console.error('Error deleting test messages:', error.message);
        }
      }, 5000);
      
    } else {
      console.error('Error sending test message:', response.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error testing Slack integration:', error);
    process.exit(1);
  }
}

testSlackIntegration();