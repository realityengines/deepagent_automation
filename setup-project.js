#!/usr/bin/env node

/**
 * This script helps set up the project by generating a package-lock.json file
 * Run this script before running the CI workflow
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up project...');

// Check if package-lock.json exists
if (!fs.existsSync(path.join(__dirname, 'package-lock.json'))) {
  console.log('Generating package-lock.json file...');
  try {
    // Run npm install to generate package-lock.json
    execSync('npm install', { stdio: 'inherit' });
    console.log('package-lock.json generated successfully!');
  } catch (error) {
    console.error('Error generating package-lock.json:', error.message);
    process.exit(1);
  }
} else {
  console.log('package-lock.json already exists.');
}

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Installing dependencies...');
  try {
    execSync('npm ci', { stdio: 'inherit' });
    console.log('Dependencies installed successfully!');
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('node_modules already exists.');
}

// Check Slack configuration
console.log('\nChecking Slack configuration...');
try {
  execSync('node helpers/checkSlackConfig.js', { stdio: 'inherit' });
} catch (error) {
  console.warn('Slack configuration check failed, but continuing setup.');
}

console.log('\nProject setup complete!');
console.log('\nTo test the Slack integration, run:');
console.log('  npm run test-slack');