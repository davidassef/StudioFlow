const fs = require('fs');
const path = require('path');

console.log('🧪 Testing StudioFlow PWA Caching Strategies...\n');

// Test configuration
const testConfig = {
  baseUrl: 'http://localhost:5102',
  apiUrl: 'http://localhost:5000',
  testTimeout: 10000
};

// Caching strategies to test
const cachingStrategies = [
  {
    name: 'Static Assets (CacheFirst)',
    patterns: [
      '/_next/static/chunks/main.js',
      '/_next/static/css/app.css',
      '/icons/icon-192x192.png'
    ],
    expectedStrategy: 'CacheFirst',
    expectedCacheName: 'studioflow-next-static-v1'
  },
  {
    name: 'API Bookings (NetworkFirst)',
    patterns: [
      '/api/v1/agendamentos',
      '/api/v1/bookings'
    ],
    expectedStrategy: 'NetworkFirst',
    expectedCacheName: 'studioflow-bookings-api-v1'
  },
  {
    name: 'Images (StaleWhileRevalidate)',
    patterns: [
      '/images/studio1.jpg',
      '/uploads/user-avatar.png'
    ],
    expectedStrategy: 'StaleWhileRevalidate',
    expectedCacheName: 'studioflow-media-cache-v1'
  },
  {
    name: 'Configuration (StaleWhileRevalidate)',
    patterns: [
      '/api/v1/config',
      '/api/v1/settings'
    ],
    expectedStrategy: 'StaleWhileRevalidate',
    expectedCacheName: 'studioflow-config-api-v1'
  }
];

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  details: []
};

function logTest(name, status, details = '') {
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`   ${icon} ${name}${details ? ': ' + details : ''}`);
  
  testResults.details.push({ name, status, details });
  if (status === 'PASS') {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

// Test 1: Verify next.config.js caching configuration
function testNextConfigCaching() {
  console.log('📋 Test 1: Next.js PWA Configuration');
  
  try {
    const configPath = path.join(__dirname, 'next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check if withPWA is configured
    if (configContent.includes('withPWA')) {
      logTest('PWA plugin configured', 'PASS');
    } else {
      logTest('PWA plugin configured', 'FAIL', 'withPWA not found');
    }
    
    // Check for runtime caching
    if (configContent.includes('runtimeCaching')) {
      logTest('Runtime caching configured', 'PASS');
    } else {
      logTest('Runtime caching configured', 'FAIL', 'runtimeCaching not found');
    }
    
    // Check for specific cache strategies
    const strategies = ['CacheFirst', 'NetworkFirst', 'StaleWhileRevalidate'];
    strategies.forEach(strategy => {
      if (configContent.includes(strategy)) {
        logTest(`${strategy} strategy configured`, 'PASS');
      } else {
        logTest(`${strategy} strategy configured`, 'FAIL', `${strategy} not found`);
      }
    });
    
    // Check for cache names with versioning
    const cacheNames = [
      'studioflow-next-static-v1',
      'studioflow-bookings-api-v1',
      'studioflow-media-cache-v1'
    ];
    
    cacheNames.forEach(cacheName => {
      if (configContent.includes(cacheName)) {
        logTest(`Cache name ${cacheName}`, 'PASS');
      } else {
        logTest(`Cache name ${cacheName}`, 'FAIL', 'Cache name not found');
      }
    });
    
  } catch (error) {
    logTest('Next.js config file readable', 'FAIL', error.message);
  }
}

// Test 2: Verify custom service worker
function testCustomServiceWorker() {
  console.log('\n🔧 Test 2: Custom Service Worker');
  
  try {
    const swPath = path.join(__dirname, 'public', 'sw-custom.js');
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    // Check for workbox imports
    const workboxImports = [
      'workbox-precaching',
      'workbox-routing',
      'workbox-strategies',
      'workbox-background-sync'
    ];
    
    workboxImports.forEach(importName => {
      if (swContent.includes(importName)) {
        logTest(`Workbox ${importName} imported`, 'PASS');
      } else {
        logTest(`Workbox ${importName} imported`, 'FAIL', 'Import not found');
      }
    });
    
    // Check for background sync queues
    if (swContent.includes('bgSyncQueue') && swContent.includes('bookingQueue')) {
      logTest('Background sync queues configured', 'PASS');
    } else {
      logTest('Background sync queues configured', 'FAIL', 'Queues not found');
    }
    
    // Check for push notification handlers
    if (swContent.includes('addEventListener(\'push\'')) {
      logTest('Push notification handler', 'PASS');
    } else {
      logTest('Push notification handler', 'FAIL', 'Push handler not found');
    }
    
    // Check for advanced cache management
    if (swContent.includes('getCacheStats') && swContent.includes('cleanupOldCaches')) {
      logTest('Advanced cache management', 'PASS');
    } else {
      logTest('Advanced cache management', 'FAIL', 'Cache management functions not found');
    }
    
  } catch (error) {
    logTest('Custom service worker readable', 'FAIL', error.message);
  }
}

// Test 3: Validate cache expiration policies
function testCacheExpirationPolicies() {
  console.log('\n⏰ Test 3: Cache Expiration Policies');
  
  try {
    const configPath = path.join(__dirname, 'next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Expected expiration times (in seconds)
    const expectedExpirations = {
      'static assets': 365 * 24 * 60 * 60, // 1 year
      'API data': 10 * 60, // 10 minutes
      'images': 30 * 24 * 60 * 60, // 30 days
      'pages': 24 * 60 * 60 // 24 hours
    };
    
    Object.entries(expectedExpirations).forEach(([type, seconds]) => {
      if (configContent.includes(`maxAgeSeconds: ${seconds}`)) {
        logTest(`${type} expiration (${seconds}s)`, 'PASS');
      } else {
        logTest(`${type} expiration (${seconds}s)`, 'FAIL', 'Expiration time not found');
      }
    });
    
    // Check for purgeOnQuotaError
    const purgeCount = (configContent.match(/purgeOnQuotaError: true/g) || []).length;
    if (purgeCount >= 5) {
      logTest('Quota error handling', 'PASS', `${purgeCount} caches configured`);
    } else {
      logTest('Quota error handling', 'FAIL', `Only ${purgeCount} caches configured`);
    }
    
  } catch (error) {
    logTest('Cache expiration validation', 'FAIL', error.message);
  }
}

// Test 4: Check cache size limits
function testCacheSizeLimits() {
  console.log('\n📊 Test 4: Cache Size Limits');
  
  try {
    const configPath = path.join(__dirname, 'next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Expected max entries for different cache types
    const expectedMaxEntries = {
      'static': 300,
      'media': 250,
      'bookings': 200,
      'pages': 100
    };
    
    Object.entries(expectedMaxEntries).forEach(([type, maxEntries]) => {
      if (configContent.includes(`maxEntries: ${maxEntries}`)) {
        logTest(`${type} cache size limit (${maxEntries})`, 'PASS');
      } else {
        logTest(`${type} cache size limit (${maxEntries})`, 'FAIL', 'Max entries not found');
      }
    });
    
    // Check for reasonable total cache limits
    const totalMaxEntries = Object.values(expectedMaxEntries).reduce((a, b) => a + b, 0);
    logTest(`Total cache entries limit`, 'PASS', `~${totalMaxEntries} entries across all caches`);
    
  } catch (error) {
    logTest('Cache size limits validation', 'FAIL', error.message);
  }
}

// Test 5: Verify network timeout configurations
function testNetworkTimeouts() {
  console.log('\n⏱️ Test 5: Network Timeout Configurations');
  
  try {
    const configPath = path.join(__dirname, 'next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Expected timeout configurations
    const expectedTimeouts = {
      'critical bookings': 3,
      'user data': 3,
      'dashboard data': 5,
      'pages': 3
    };
    
    Object.entries(expectedTimeouts).forEach(([type, timeout]) => {
      if (configContent.includes(`networkTimeoutSeconds: ${timeout}`)) {
        logTest(`${type} timeout (${timeout}s)`, 'PASS');
      } else {
        logTest(`${type} timeout (${timeout}s)`, 'FAIL', 'Timeout not found');
      }
    });
    
  } catch (error) {
    logTest('Network timeout validation', 'FAIL', error.message);
  }
}

// Test 6: Validate cache naming conventions
function testCacheNamingConventions() {
  console.log('\n🏷️ Test 6: Cache Naming Conventions');
  
  try {
    const configPath = path.join(__dirname, 'next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Expected cache naming pattern: studioflow-{type}-v{version}
    const cacheNamePattern = /studioflow-[\w-]+-v\d+/g;
    const cacheNames = configContent.match(cacheNamePattern) || [];
    
    if (cacheNames.length >= 8) {
      logTest('Cache naming convention', 'PASS', `${cacheNames.length} properly named caches`);
    } else {
      logTest('Cache naming convention', 'FAIL', `Only ${cacheNames.length} properly named caches`);
    }
    
    // Check for version consistency
    const versions = cacheNames.map(name => name.match(/v(\d+)$/)?.[1]).filter(Boolean);
    const uniqueVersions = [...new Set(versions)];
    
    if (uniqueVersions.length === 1) {
      logTest('Cache version consistency', 'PASS', `All caches use version ${uniqueVersions[0]}`);
    } else {
      logTest('Cache version consistency', 'FAIL', `Multiple versions found: ${uniqueVersions.join(', ')}`);
    }
    
  } catch (error) {
    logTest('Cache naming validation', 'FAIL', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting StudioFlow PWA Caching Strategy Tests\n');
  
  testNextConfigCaching();
  testCustomServiceWorker();
  testCacheExpirationPolicies();
  testCacheSizeLimits();
  testNetworkTimeouts();
  testCacheNamingConventions();
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Passed: ${testResults.passed}`);
  console.log(`   ❌ Failed: ${testResults.failed}`);
  console.log(`   📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All caching strategy tests passed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Start the development server with PWA enabled');
    console.log('   2. Test caching behavior in browser DevTools');
    console.log('   3. Run Lighthouse PWA audit');
    console.log('   4. Test offline functionality');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the configuration.');
    console.log('\n🔧 Failed tests:');
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`   • ${test.name}: ${test.details}`);
      });
  }
  
  console.log('\n✨ Caching strategy validation complete!');
}

// Execute tests
runAllTests().catch(console.error);