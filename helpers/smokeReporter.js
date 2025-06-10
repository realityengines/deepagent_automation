const { sendMessage } = require('./slackUtils');

class SmokeReporter {
  constructor() {
    this.testResults = new Map();
    this.retries = new Map();
  }

  onTestEnd(test, result) {
    const testId = test.id;
    if (!this.testResults.has(testId)) {
      this.testResults.set(testId, []);
    }
    this.testResults.get(testId).push(result);

    if (result.retry) {
      this.retries.set(testId, (this.retries.get(testId) || 0) + 1);
    }
  }

  async onEnd() {
    let passed = 0;
    let failed = 0;
    let retried = 0;
    let failedTests = [];

    for (const [testId, results] of this.testResults.entries()) {
      const lastResult = results[results.length - 1];
      if (lastResult.status === 'passed') {
        passed++;
      } else {
        failed++;
        failedTests.push({
          title: lastResult.title,
          error: lastResult.error ? lastResult.error.message : 'Unknown error',
        });
      }
      if (this.retries.get(testId)) {
        retried++;
      }
    }

    const summary = `*Test Summary*\nPassed: ${passed}\nFailed: ${failed}\nRetried: ${retried}`;
    let details = '';
    if (failedTests.length > 0) {
      details = '\n*Failed Tests:*\n' + failedTests.map(
        t => `• ${t.title}\n  Error: ${t.error.substring(0, 300)}`
      ).join('\n');
    }

    await sendMessage(process.env.SLACK_CHANNEL, summary + details);
  }
}

module.exports = SmokeReporter;