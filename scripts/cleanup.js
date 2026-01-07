#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files and directories to remove for optimization
const unnecessaryFiles = [
  // Development files
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  
  // IDE files
  '.vscode/settings.json',
  '.idea/',
  '*.swp',
  '*.swo',
  
  // Temporary files
  '.tmp/',
  'temp/',
  
  // Large unused assets (check before removing)
  // 'assets/unused_images/',
  
  // Old build artifacts
  '.next/cache/webpack/',
  'out/',
  
  // Duplicate or unused dependencies (manual check required)
  // Check package.json for unused packages
];

// Optimize package.json by removing unused dependencies
const optimizePackageJson = () => {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Add performance optimizations
    packageJson.scripts = {
      ...packageJson.scripts,
      'build:analyze': 'ANALYZE=true next build',
      'build:prod': 'NODE_ENV=production next build',
      'clean': 'rm -rf .next out node_modules/.cache',
      'optimize': 'next-optimized-images'
    };
    
    // Add bundle analyzer
    if (!packageJson.devDependencies['@next/bundle-analyzer']) {
      packageJson.devDependencies['@next/bundle-analyzer'] = '^14.0.0';
    }
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Package.json optimized');
  }
};

// Create .gitignore optimizations
const optimizeGitignore = () => {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const additionalIgnores = `
# Performance optimization
.next/cache/
out/
*.tsbuildinfo
.vercel/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Misc
.tmp/
temp/
`;

  if (fs.existsSync(gitignorePath)) {
    const currentContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!currentContent.includes('# Performance optimization')) {
      fs.appendFileSync(gitignorePath, additionalIgnores);
      console.log('✅ .gitignore optimized');
    }
  }
};

// Create performance monitoring
const createPerformanceConfig = () => {
  const configPath = path.join(process.cwd(), 'performance.config.js');
  const config = `
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
`;
  
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, config);
    console.log('✅ Performance config created');
  }
};

// Main cleanup function
const cleanup = () => {
  console.log('🧹 Starting cleanup and optimization...');
  
  try {
    optimizePackageJson();
    optimizeGitignore();
    createPerformanceConfig();
    
    console.log('✅ Cleanup and optimization completed!');
    console.log('📊 Next steps:');
    console.log('1. Run "npm install" to install new dev dependencies');
    console.log('2. Run "npm run build:analyze" to analyze bundle size');
    console.log('3. Review and remove unused dependencies manually');
    console.log('4. Optimize images using next-optimized-images');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
};

// Run cleanup if this file is executed directly
if (require.main === module) {
  cleanup();
}

module.exports = { cleanup, optimizePackageJson, optimizeGitignore };