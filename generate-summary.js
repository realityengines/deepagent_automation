import fs from "fs";

const report = JSON.parse(fs.readFileSync("./reports/cucumber-report.json", "utf-8"));

let scenariosPassed = 0, scenariosFailed = 0;
let stepsPassed = 0, stepsFailed = 0, stepsSkipped = 0;

report.forEach(feature => {
  feature.elements?.forEach(scenario => {
    let failed = false;
    scenario.steps?.forEach(step => {
      const status = step.result?.status;
      if (status === "passed") stepsPassed++;
      else if (status === "failed") {
        stepsFailed++;
        failed = true;
      } else if (status === "skipped") stepsSkipped++;
    });
    failed ? scenariosFailed++ : scenariosPassed++;
  });
});

const summary = `
### 🧪 Cucumber Test Summary

**Scenarios:**  
🟩 ${scenariosPassed} passed  
🟥 ${scenariosFailed} failed  

**Steps:**  
🟩 ${stepsPassed} passed  
🟥 ${stepsFailed} failed  
🟧 ${stepsSkipped} skipped
**⏱ Duration:** ${duration}
`;

fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
