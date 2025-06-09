const fs = require('fs');
const { WebClient } = require('@slack/web-api');
const path = require('path');

function stripAnsiCodes(text) {
  // More comprehensive ANSI code stripping
  return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

// Helper function to send Slack messages with retry logic and block size limits
async function sendSlackMessageWithRetry(slack, channelId, threadTs, message) {
  const MAX_RETRIES = 3;
  const MAX_BLOCK_TEXT_LENGTH = 2900; // Slack has a 3000 character limit for block text
  
  // Check if message needs to be split due to block text length limit
  if (message.length > MAX_BLOCK_TEXT_LENGTH) {
    console.log(`Message too long (${message.length} chars), splitting into chunks...`);
    
    // Split the message into chunks that fit within the block text limit
    const messageChunks = [];
    for (let i = 0; i < message.length; i += MAX_BLOCK_TEXT_LENGTH) {
      messageChunks.push(message.substring(i, i + MAX_BLOCK_TEXT_LENGTH));
    }
    
    // Send each chunk as a separate message
    for (let i = 0; i < messageChunks.length; i++) {
      const chunkPrefix = messageChunks.length > 1 ? `[Part ${i+1}/${messageChunks.length}] ` : '';
      const chunkMessage = chunkPrefix + messageChunks[i];
      
      // Create blocks for this chunk
      const blocks = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: chunkMessage
          }
        }
      ];
      
      // Send with retry logic
      let retries = 0;
      let success = false;
      
      while (!success && retries < MAX_RETRIES) {
        try {
          const response = await slack.chat.postMessage({
            channel: channelId,
            thread_ts: threadTs,
            text: chunkMessage, // Fallback text
            blocks: blocks
          });
          
          if (response.ok) {
            console.log(`Message chunk ${i+1}/${messageChunks.length} successfully posted to Slack thread.`);
            success = true;
          } else {
            console.error('Slack API returned error:', response.error);
            retries++;
            if (retries < MAX_RETRIES) {
              const backoff = Math.pow(2, retries) * 1000;
              console.log(`Retrying in ${backoff/1000} seconds...`);
              await new Promise(resolve => setTimeout(resolve, backoff));
            }
          }
        } catch (error) {
          console.error('Error sending Slack message:', error);
          retries++;
          if (retries < MAX_RETRIES) {
            const backoff = Math.pow(2, retries) * 1000;
            console.log(`Retrying in ${backoff/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
          }
        }
      }
      
      if (!success) {
        console.error(`Failed to send message chunk ${i+1}/${messageChunks.length} to Slack after ${MAX_RETRIES} retries.`);
      }
      
      // Add a small delay between messages to avoid rate limiting
      if (i < messageChunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return;
  }
  
  // For messages that fit within the limit, send directly
  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: message
      }
    }
  ];
  
  // Send with retry logic
  let retries = 0;
  let success = false;
  
  while (!success && retries < MAX_RETRIES) {
    try {
      const response = await slack.chat.postMessage({
        channel: channelId,
        thread_ts: threadTs,
        text: message, // Fallback text
        blocks: blocks
      });
      
      if (response.ok) {
        console.log('Message successfully posted to Slack thread.');
        success = true;
      } else {
        console.error('Slack API returned error:', response.error);
        retries++;
        if (retries < MAX_RETRIES) {
          const backoff = Math.pow(2, retries) * 1000;
          console.log(`Retrying in ${backoff/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    } catch (error) {
      console.error('Error sending Slack message:', error);
      retries++;
      if (retries < MAX_RETRIES) {
        const backoff = Math.pow(2, retries) * 1000;
        console.log(`Retrying in ${backoff/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  }
  
  if (!success) {
    console.error(`Failed to send message to Slack after ${MAX_RETRIES} retries.`);
  }
}

async function summarizeResults(reportPath) {
  try {
    const data = fs.readFileSync(reportPath, 'utf8');
    const report = JSON.parse(data);

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    let totalRetries = 0;
    let failedDetails = [];

    const processSpecs = (specs) => {
      if (!specs || !Array.isArray(specs)) {
        console.warn('No specs found or specs is not an array');
        return;
      }
      specs.forEach(spec => {
        if (!spec.tests || !Array.isArray(spec.tests)) {
          console.warn(`No tests found for spec: ${spec.title}`);
          return;
        }
        spec.tests.forEach(test => {
          totalTests++;
          const retryCount = test.results.length - 1;
          totalRetries += retryCount;

          // Consider only the final result of each test
          const finalResult = test.results[test.results.length - 1];
          if (finalResult.status === 'passed') {
            passedTests++;
          } else if (finalResult.status === 'failed' || finalResult.status === 'timedOut' || finalResult.status === 'unexpected') {
            failedTests++;
            const errorDetails = finalResult.errors && finalResult.errors.length > 0 
              ? finalResult.errors.map(error => stripAnsiCodes(error.message || '')).join('\n')
              : 'No error details available';
            
            failedDetails.push({
              title: spec.title,
              file: spec.file,
              line: spec.line || 0,
              column: spec.column || 0,
              status: finalResult.status,
              error: errorDetails,
              stack: finalResult.error ? stripAnsiCodes(finalResult.error.stack || '') : 'No stack trace available',
              stdout: finalResult.stdout ? stripAnsiCodes(finalResult.stdout.map(out => out.text || '').join('\n')) : '',
              retries: retryCount
            });
          } else if (finalResult.status === 'skipped') {
            skippedTests++;
          }
        });
      });
    };

    if (!report.suites || !Array.isArray(report.suites)) {
      console.error('No suites found or suites is not an array');
      return;
    }

    report.suites.forEach(suite => {
      processSpecs(suite.specs);
      if (suite.suites && Array.isArray(suite.suites)) {
        suite.suites.forEach(subSuite => {
          processSpecs(subSuite.specs);
        });
      }
    });

    let summary = `
## Test Results Summary

| Status   | Count |
|----------|-------|
| ✅ Passed | ${passedTests} |
| ❌ Failed | ${failedTests} |
| ⚠️ Skipped | ${skippedTests} |
| 🔄 Retries | ${totalRetries} |
| 🧪 Total  | ${totalTests} |

`;

    // Limit the number of detailed failures to avoid making the summary too large
    const MAX_DETAILED_FAILURES = 10;
    if (failedDetails.length > 0) {
      summary += `
## Detailed Failed Tests Summary

`;
      failedDetails.slice(0, MAX_DETAILED_FAILURES).forEach(detail => {
        summary += `
### ud83dudd0d ${detail.title}

- **File**: \`${detail.file}:${detail.line}:${detail.column}\`
- **Status**: u274c ${detail.status}
- **Retries**: ${detail.retries}
- **Error Message**: 
\`\`\`
${detail.error}
\`\`\`
`;
      });

      if (failedDetails.length > MAX_DETAILED_FAILURES) {
        summary += `
### ... and ${failedDetails.length - MAX_DETAILED_FAILURES} more failed tests

See the full report in GitHub Actions for complete details.
`;
      }
    }

    // Write to GitHub step summary
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
    }

    // Create a backup report file with the processed results
    const backupReport = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        skipped: skippedTests,
        retries: totalRetries
      },
      failedTests: failedDetails.map(detail => ({
        title: detail.title,
        file: detail.file,
        error: detail.error
      })),
      timestamp: new Date().toISOString()
    };
    
    // Ensure the directory exists
    const backupDir = path.dirname(reportPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Write the backup report
    fs.writeFileSync(
      path.join(backupDir, 'summary_report.json'), 
      JSON.stringify(backupReport, null, 2)
    );

    // If we have a Slack thread, post a summary there too
    const slackToken = process.env.SLACK_TOKEN;
    const threadTs = process.env.SLACK_THREAD_TS;
    const channelId = process.env.SLACK_CHANNEL_ID;

    if (slackToken && threadTs && channelId) {
      try {
        const slack = new WebClient(slackToken);
        const slackSummary = `*Test Results Summary*\n\n` +
          `• Total: ${totalTests}\n` +
          `• ✅ Passed: ${passedTests}\n` +
          `• ❌ Failed: ${failedTests}\n` +
          `• ⚠️ Skipped: ${skippedTests}\n` +
          `• 🔄 Retries: ${totalRetries}`;

        // Send the summary message using our helper function
        await sendSlackMessageWithRetry(slack, channelId, threadTs, slackSummary);
        console.log('Test summary posted to Slack thread');
        
        // If there are failed tests, post them in a separate message
        if (failedDetails.length > 0) {
          const MAX_FAILURES_TO_REPORT = 15;
          const failedTestsToReport = failedDetails.slice(0, MAX_FAILURES_TO_REPORT);
          
          let failedMessage = `*Failed Tests (${failedDetails.length})*\n\n`;
          failedTestsToReport.forEach(detail => {
            failedMessage += `\u274c *${detail.title}*\n` +
              `File: ${detail.file}\n` +
              `Error: ${detail.error.substring(0, 200)}${detail.error.length > 200 ? '...' : ''}\n\n`;
          });
          
          if (failedDetails.length > MAX_FAILURES_TO_REPORT) {
            failedMessage += `... and ${failedDetails.length - MAX_FAILURES_TO_REPORT} more failed tests.`;
          }
          
          // Send the failed tests message using our helper function
          await sendSlackMessageWithRetry(slack, channelId, threadTs, failedMessage);
          console.log('Failed tests details posted to Slack thread');
        }
      } catch (error) {
        console.error('Error posting summary to Slack:', error);
      }
    }
  } catch (error) {
    console.error('Error summarizing test results:', error);
  }
}

summarizeResults(process.argv[2]);