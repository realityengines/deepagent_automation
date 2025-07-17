#!/usr/bin/env node

import { spawn } from 'child_process';
import { cleanupDirectories } from './utils/cleanup.js';

console.log('🧹 Cleaning up directories before test run...');
cleanupDirectories();

console.log('🚀 Starting Cucumber tests...');

const cucumberProcess = spawn('npx', [
    'cucumber-js',
    '--tags', '@smoke',
    '--parallel', '2', // Reduced from 4 to avoid resource conflicts
    '--format', 'html:reports/cucumber-report.html',
    '--format', 'json:reports/cucumber-report.json',
    '--format', 'progress'
], {
    stdio: 'inherit',
    shell: true
});

cucumberProcess.on('close', (code) => {
    console.log(`\n📊 Cucumber tests finished with exit code: ${code}`);
    
    if (code !== 0) {
        console.log('❌ Tests failed. Check the reports for details.');
        console.log('📁 Reports available at:');
        console.log('   - HTML: reports/cucumber-report.html');
        console.log('   - JSON: reports/cucumber-report.json');
        console.log('   - Screenshots: reports/failure-*.png');
    } else {
        console.log('✅ All tests passed!');
    }
    
    process.exit(code);
});

cucumberProcess.on('error', (error) => {
    console.error('❌ Failed to start cucumber process:', error);
    process.exit(1);
});