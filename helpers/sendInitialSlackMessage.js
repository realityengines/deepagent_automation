const { WebClient } = require('@slack/web-api');
const fs = require('fs');
const path = require('path');

const slackToken = process.env.SLACK_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID || "C07FJG27D2L";
const initialSlackInfo = process.env.INITIAL_SLACK_INFO || "";
//C07FJG27D2L Automation Regression Build HChannel
//C0189FJRC9E Prod Release Channel

if (!slackToken) {
  console.error('SLACK_TOKEN environment variable is not set');
  process.exit(1);
}
const slackClient = new WebClient(slackToken);

// Load the GitHub to Slack email mapping
const mappingPath = path.join(__dirname, 'github-slack-mapping.json');
const githubSlackMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

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

  // Updated message to include "Build Name triggered"
  const message = `:pager: Build **${buildName}** triggered for environment **${environment}** by ${userMention}. ${initialSlackInfo}\nMonitor this thread for smoke test results before launching to prod.`;

  try {
    const response = await slackClient.chat.postMessage({
      channel: channelId,
      text: message,
    });

    if (response.ok) {
      console.log('Initial message posted to Slack');
      console.log(`Message sent: ${message}`);
      console.log(`::set-output name=thread_ts::${response.ts}`);
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