module.exports = {
  default: {
    parallel: 1,
    format: [
      'progress-bar',
      ['html', 'reports/cucumber-report.html'],
      ['json', 'reports/cucumber-report.json']
    ],
    paths: ['features/**/*.feature'],
    require: ['features/step_definitions/*.js', 'features/support/*.js'],
    requireModule: ['@playwright/test'],
    publishQuiet: true
  }
};