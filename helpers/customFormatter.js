import { Formatter } from '@cucumber/cucumber';
import fs from 'fs';
import path from 'path';

class CustomFormatter extends Formatter {
  constructor(options) {
    super(options);
    this.results = [];
    this.currentScenario = null;
    this.failedScenarios = [];
    
    this.on('test-case-started', this.onTestCaseStarted.bind(this));
    this.on('test-case-finished', this.onTestCaseFinished.bind(this));
    this.on('test-step-attachment', this.onTestStepAttachment.bind(this));
    this.on('test-run-finished', this.onTestRunFinished.bind(this));
  }

  onTestCaseStarted(event) {
    this.currentScenario = {
      id: event.testCase.id,
      name: event.testCase.pickle.name,
      uri: event.testCase.pickle.uri,
      startTime: new Date(),
      attachments: [],
      conversationURL: null,
      status: 'unknown'
    };
  }

  onTestCaseFinished(event) {
    if (this.currentScenario) {
      this.currentScenario.endTime = new Date();
      this.currentScenario.duration = this.currentScenario.endTime - this.currentScenario.startTime;
      this.currentScenario.status = event.result.status;
      
      // If the scenario failed, add it to failed scenarios list
      if (event.result.status === 'FAILED') {
        this.currentScenario.errorMessage = event.result.message;
        this.failedScenarios.push(this.currentScenario);
        
        // Log the failure with conversation URL if available
        if (this.currentScenario.conversationURL) {
          console.log(`\n=== FAILED SCENARIO ===`);
          console.log(`Scenario: ${this.currentScenario.name}`);
          console.log(`Conversation URL: ${this.currentScenario.conversationURL}`);
          console.log(`Error: ${event.result.message}`);
          console.log(`========================\n`);
        }
      }
      
      this.results.push(this.currentScenario);
      this.currentScenario = null;
    }
  }

  onTestStepAttachment(event) {
    if (this.currentScenario) {
      const attachment = {
        data: event.data,
        mediaType: event.mediaType,
        timestamp: new Date()
      };
      
      // Check if this is a conversation URL attachment
      if (event.mediaType === 'text/plain' && event.data.includes('Conversation URL:')) {
        const urlMatch = event.data.match(/Conversation URL:\s*(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          this.currentScenario.conversationURL = urlMatch[1];
          console.log(`Captured conversation URL for scenario "${this.currentScenario.name}": ${urlMatch[1]}`);
        }
      }
      
      this.currentScenario.attachments.push(attachment);
    }
  }

  onTestRunFinished() {
    // Generate a summary report with failed scenarios and their URLs
    this.generateFailureSummary();
    
    // Write detailed results to JSON file
    const reportPath = path.join('reports', 'detailed-results.json');
    try {
      if (!fs.existsSync('reports')) {
        fs.mkdirSync('reports', { recursive: true });
      }
      
      fs.writeFileSync(reportPath, JSON.stringify({
        summary: {
          total: this.results.length,
          passed: this.results.filter(r => r.status === 'PASSED').length,
          failed: this.results.filter(r => r.status === 'FAILED').length,
          skipped: this.results.filter(r => r.status === 'SKIPPED').length
        },
        failedScenarios: this.failedScenarios,
        allResults: this.results
      }, null, 2));
      
      console.log(`Detailed results written to: ${reportPath}`);
    } catch (error) {
      console.error('Error writing detailed results:', error);
    }
  }

  generateFailureSummary() {
    if (this.failedScenarios.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('FAILURE SUMMARY');
      console.log('='.repeat(80));
      
      this.failedScenarios.forEach((scenario, index) => {
        console.log(`\n${index + 1}. ${scenario.name}`);
        console.log(`   File: ${scenario.uri}`);
        console.log(`   Status: ${scenario.status}`);
        console.log(`   Duration: ${scenario.duration}ms`);
        
        if (scenario.conversationURL) {
          console.log(`   🔗 Conversation URL: ${scenario.conversationURL}`);
        } else {
          console.log(`   ⚠️  No conversation URL captured`);
        }
        
        if (scenario.errorMessage) {
          console.log(`   Error: ${scenario.errorMessage.split('\n')[0]}`);
        }
        console.log('   ' + '-'.repeat(60));
      });
      
      console.log('\n' + '='.repeat(80));
      console.log(`Total Failed Scenarios: ${this.failedScenarios.length}`);
      console.log('='.repeat(80) + '\n');
      
      // Write failure summary to a separate file
      const failureSummaryPath = path.join('reports', 'failure-summary.html');
      this.generateHTMLFailureSummary(failureSummaryPath);
    }
  }

  generateHTMLFailureSummary(filePath) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Failure Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f44336; color: white; padding: 15px; border-radius: 5px; }
        .scenario { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .scenario.failed { border-left: 5px solid #f44336; }
        .url { background-color: #e3f2fd; padding: 10px; border-radius: 3px; margin: 10px 0; }
        .url a { color: #1976d2; text-decoration: none; font-weight: bold; }
        .url a:hover { text-decoration: underline; }
        .error { background-color: #ffebee; padding: 10px; border-radius: 3px; margin: 10px 0; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚨 Test Failure Summary</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Failed Scenarios: ${this.failedScenarios.length}</p>
    </div>
    
    ${this.failedScenarios.map((scenario, index) => `
        <div class="scenario failed">
            <h3>${index + 1}. ${scenario.name}</h3>
            <p><strong>File:</strong> ${scenario.uri}</p>
            <p><strong>Duration:</strong> ${scenario.duration}ms</p>
            <p class="timestamp"><strong>Failed at:</strong> ${scenario.endTime.toLocaleString()}</p>
            
            ${scenario.conversationURL ? `
                <div class="url">
                    <strong>🔗 Conversation URL:</strong><br>
                    <a href="${scenario.conversationURL}" target="_blank">${scenario.conversationURL}</a>
                </div>
            ` : '<p>⚠️ No conversation URL captured</p>'}
            
            ${scenario.errorMessage ? `
                <div class="error">
                    <strong>Error Details:</strong><br>
                    <pre>${scenario.errorMessage}</pre>
                </div>
            ` : ''}
        </div>
    `).join('')}
    
    <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <h3>Quick Actions</h3>
        <ul>
            <li>Click on the conversation URLs above to review the failed test sessions</li>
            <li>Check the detailed error messages for debugging information</li>
            <li>Review the test duration to identify performance issues</li>
        </ul>
    </div>
</body>
</html>`;

    try {
      fs.writeFileSync(filePath, html);
      console.log(`HTML failure summary generated: ${filePath}`);
    } catch (error) {
      console.error('Error generating HTML failure summary:', error);
    }
  }
}

export default CustomFormatter;