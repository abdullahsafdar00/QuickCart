
module.exports = {
  // Bundle size limits
  bundleSize: {
    maxSize: '500kb',
    maxChunks: 10
  },
  
  // Performance budgets
  budgets: [
    {
      type: 'initial',
      maximumWarning: '500kb',
      maximumError: '1mb'
    },
    {
      type: 'anyComponentStyle',
      maximumWarning: '2kb',
      maximumError: '4kb'
    }
  ],
  
  // Lighthouse thresholds
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 95
  }
};
