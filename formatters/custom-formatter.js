import { Formatter, Status } from '@cucumber/cucumber';

class CustomFormatter extends Formatter {
  constructor(options) {
    super(options);
    options.eventBroadcaster.on('envelope', (envelope) => {
      if (envelope.testCaseFinished) {
        this.processTestCaseFinished(envelope.testCaseFinished);
      }
    });
    
    // Track skipped or pending steps
    this.hasSkippedOrPendingSteps = false;
  }

  processTestCaseFinished(testCaseFinished) {
    // Check if any steps were skipped or pending
    if (testCaseFinished.testStepResults) {
      for (const result of testCaseFinished.testStepResults) {
        if (result.status === Status.SKIPPED || result.status === Status.PENDING) {
          this.hasSkippedOrPendingSteps = true;
          console.log('\x1b[33m%s\x1b[0m', `WARNING: Step was ${result.status}. Marking test as failed.`);
          
          // Force the test case to be marked as failed
          testCaseFinished.willBeRetried = false;
          testCaseFinished.status = Status.FAILED;
          
          // Exit the loop once we've found a skipped/pending step
          break;
        }
      }
    }
  }
}

export default CustomFormatter;