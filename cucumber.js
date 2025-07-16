const options = {
  parallel: 1,
  paths: ['features/**/*.feature'],
  require: [
    'features/step_definitions/**/*.js',
    'features/support/**/*.js'
  ],
  import: [
    'formatters/**/*.js'
  ],
  requireModule: ['@playwright/test'],
  format: [
    'progress',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    '@cucumber/pretty-formatter',
    './formatters/custom-formatter.js'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  // Fail if there are pending or undefined steps
  strict: true
};

export default options;