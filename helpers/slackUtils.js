const axios = require('axios');

async function sendMessage(channel, text) {
  const slackToken = process.env.SLACK_BOT_TOKEN;
  if (!slackToken) {
    throw new Error('SLACK_BOT_TOKEN is not set in environment variables.');
  }

  try {
    await axios.post('https://slack.com/api/chat.postMessage', {
      channel,
      text,
    }, {
      headers: {
        'Authorization': `Bearer ${slackToken}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to send Slack message:', error.message);
  }
}

module.exports = { sendMessage };