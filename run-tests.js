import { spawn } from 'child_process';

const tag = process.argv[2];
if (!tag) {
    console.error('Please provide a tag. Example: node run-tests.js "@Login"');
    process.exit(1);
}

const command = `cucumber-js --config cucumber.js --tags "${tag}" --format html:reports/cucumber-report.html --format json:reports/cucumber-report.json --format summary`;

const child = spawn('npx', command.split(' '), {
    stdio: 'inherit',
    shell: true
});

child.on('exit', (code) => {
    if (code === 0) {
        // Run the reporter after successful test execution
        const reporter = spawn('node', ['config/reporter.js'], {
            stdio: 'inherit',
            shell: true
        });
        
        reporter.on('exit', (reporterCode) => {
            process.exit(reporterCode);
        });
    } else {
        process.exit(code);
    }
});