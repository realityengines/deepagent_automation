import fs from "fs";

try {
  const report = JSON.parse(fs.readFileSync("./reports/cucumber-report.json", "utf-8"));

  let scenariosPassed = 0, scenariosFailed = 0;
  let stepsPassed = 0, stepsFailed = 0, stepsSkipped = 0;
  let totalDuration = 0;

  report.forEach(feature => {
    feature.elements?.forEach(scenario => {
      let failed = false;
      scenario.steps?.forEach(step => {
        const status = step.result?.status;
        const duration = step.result?.duration || 0;
        totalDuration += duration;
        
        if (status === "passed") stepsPassed++;
        else if (status === "failed") {
          stepsFailed++;
          failed = true;
        } else if (status === "skipped") stepsSkipped++;
      });
      failed ? scenariosFailed++ : scenariosPassed++;
    });
  });

  // Convert nanoseconds to seconds and format
  const durationInSeconds = (totalDuration / 1000000000).toFixed(2);

  const summary = `
### 🧪 Cucumber Test Summary

**Scenarios:**  
🟩 ${scenariosPassed} passed  
🟥 ${scenariosFailed} failed  

**Steps:**  
🟩 ${stepsPassed} passed  
🟥 ${stepsFailed} failed  
🟧 ${stepsSkipped} skipped

**⏱ Duration:** ${durationInSeconds}s
`;

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
    console.log("Test summary added to GitHub step summary");
  } else {
    console.log("Test Summary:");
    console.log(summary);
  }
} catch (error) {
  console.error("Error generating test summary:", error.message);
  process.exit(1);
}