import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
//import testData from '../configs/testData.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const slackToken = process.env.SLACK_TOKEN;
const mainChannelId = process.env.SLACK_CHANNEL_ID || "C0189FJRC9E"; // Replace with your main channel ID Prod_release = C0189FJRC9E , Automation_regression_build= C07FJG27D2L
const failureChannelId = process.env.FAILURE_SLACK_CHANNEL_ID || "C07FJG27D2L"; // Replace with your failure channel ID

if (!slackToken) {
  console.error('SLACK_TOKEN environment variable is not set');
  console.error('When running locally, you need to set the SLACK_TOKEN environment variable.');
  console.error('You can add it to your .env file or set it directly in your terminal:');
  console.error('  - For Windows PowerShell: $env:SLACK_TOKEN="your-slack-token"');
  console.error('  - For Windows CMD: set SLACK_TOKEN=your-slack-token');
  console.error('  - For Linux/macOS: export SLACK_TOKEN=your-slack-token');
  console.error('In GitHub Actions, this is set via secrets.SLACK_BOT_TOKEN');
  process.exit(1);
}

const slackClient = new WebClient(slackToken);

async function postBuildStatus(status, threadTs) {
  const buildUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const message = status === 'success'
    ? `:white_check_mark: Smoke tests completed successfully!\nBuild URL: ${buildUrl}`
    : `:x: Smoke tests failed!\nBuild URL: ${buildUrl}`;

  try {
    // Post to the original thread
    await slackClient.chat.postMessage({
      channel: mainChannelId,
      text: message,
      thread_ts: threadTs,
    });
    console.log('Build status posted to Slack thread');

    // If build failed, post to the failure channel as well
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