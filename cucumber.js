const options = {
  parallel: 1,
  paths: ['features/**/*.feature'],
  import: [
    'features/step_definitions/**/*.js',
    'features/support/**/*.js'
  ],
  requireModule: ['@playwright/test'],
  format: [
    'progress',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    '@cucumber/pretty-formatter'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  }
};

export default options;
