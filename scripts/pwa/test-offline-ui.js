const fs = require('fs');
const path = require('path');

console.log('🧪 Testing StudioFlow Offline UI Components...\n');

// Test configuration
const testConfig = {
  components: [
    'OfflineIndicator.tsx',
    'OfflineFallback.tsx', 
    'RetryMechanism.tsx',
    'OfflineDataDisplay.tsx'
  ],
  pages: [
    'offline/page.tsx'
  ]
};

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

// Test 1: Verify offline indicator component
function testOfflineIndicator() {
  console.log('📋 Test 1: Offline Indicator Component');
  
  try {
    const componentPath = path.join(__dirname, 'src', 'components', 'pwa', 'OfflineIndicator.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    // Check for core functionality
    if (componentContent.includes('useOfflineData') && 
        componentContent.includes('isOnline') &&
        componentContent.includes('syncQueueCount')) {
      logTest('Offline data integration', 'PASS');
    } else {
      logTest('Offline data integration', 'FAIL', 'Missing offline data hooks');
    }
    
    // Check for status indicators
    const statusIndicators = ['WifiOff', 'Sync', 'AlertTriangle', 'CheckCircle'];
    statusIndicators.forEach(indicator => {
      if (componentContent.includes(indicator)) {
        logTest(`Status indicator: ${indicator}`, 'PASS');
      } else {
        logTest(`Status indicator: ${indicator}`, 'FAIL', 'Icon not found');
      }
    });
    
    // Check for expandable details
    if (componentContent.includes('showExpanded') && 
        componentContent.includes('conflictCount')) {
      logTest('Expandable details view', 'PASS');
    } else {
      logTest('Expandable details view', 'FAIL', 'Missing expandable functionality');
    }
    
    // Check for compact badge version
    if (componentContent.includes('OfflineStatusBadge')) {
      logTest('Compact status badge', 'PASS');
    } else {
      logTest('Compact status badge', 'FAIL', 'Badge component not found');
    }
    
  } catch (error) {
    logTest('Offline indicator file readable', 'FAIL', error.message);
  }
}

// Test 2: Verify offline fallback component
function testOfflineFallback() {
  console.log('\n🔧 Test 2: Offline Fallback Component');
  
  try {
    const componentPath = path.join(__dirname, 'src', 'components', 'pwa', 'OfflineFallback.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    // Check for cached data display
    if (componentContent.includes('showCachedData') && 
        componentContent.includes('getAgendamentos')) {
      logTest('Cached data display', 'PASS');
    } else {
      logTest('Cached data display', 'FAIL', 'Missing cached data functionality');
    }
    
    // Check for retry mechanism
    if (componentContent.includes('handleRetry') && 
        componentContent.includes('retryAttempts')) {
      logTest('Retry mechanism', 'PASS');
    } else {
      logTest('Retry mechanism', 'FAIL', 'Missing retry functionality');
    }
    
    // Check for navigation options
    if (componentContent.includes('window.history.back') && 
        componentContent.includes('window.location.href')) {
      logTest('Navigation options', 'PASS');
    } else {
      logTest('Navigation options', 'FAIL', 'Missing navigation functionality');
    }
    
    // Check for specialized fallbacks
    if (componentContent.includes('AgendamentosOfflineFallback') && 
        componentContent.includes('DashboardOfflineFallback')) {
      logTest('Specialized fallback components', 'PASS');
    } else {
      logTest('Specialized fallback components', 'FAIL', 'Missing specialized components');
    }
    
    // Check for offline metadata display
    if (componentContent.includes('_offline') && 
        componentContent.includes('isOfflineCreated')) {
      logTest('Offline metadata display', 'PASS');
    } else {
      logTest('Offline metadata display', 'FAIL', 'Missing offline metadata');
    }
    
  } catch (error) {
    logTest('Offline fallback file readable', 'FAIL', error.message);
  }
}

// Test 3: Verify retry mechanism component
function testRetryMechanism() {
  console.log('\n⏰ Test 3: Retry Mechanism Component');
  
  try {
    const componentPath = path.join(__dirname, 'src', 'components', 'pwa', 'RetryMechanism.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    // Check for exponential backoff
    if (componentContent.includes('Math.pow(2, retryCount)') && 
        componentContent.includes('retryDelay')) {
      logTest('Exponential backoff', 'PASS');
    } else {
      logTest('Exponential backoff', 'FAIL', 'Missing backoff logic');
    }
    
    // Check for auto-retry on network recovery
    if (componentContent.includes('useEffect') && 
        componentContent.includes('isOnline') &&
        componentContent.includes('handleRetry')) {
      logTest('Auto-retry on network recovery', 'PASS');
    } else {
      logTest('Auto-retry on network recovery', 'FAIL', 'Missing auto-retry logic');
    }
    
    // Check for countdown timer
    if (componentContent.includes('nextRetryIn') && 
        componentContent.includes('setTimeout')) {
      logTest('Countdown timer', 'PASS');
    } else {
      logTest('Countdown timer', 'FAIL', 'Missing countdown functionality');
    }
    
    // Check for toast notification
    if (componentContent.includes('RetryToast') && 
        componentContent.includes('onDismiss')) {
      logTest('Toast notification', 'PASS');
    } else {
      logTest('Toast notification', 'FAIL', 'Missing toast component');
    }
    
    // Check for retry hook
    if (componentContent.includes('useRetryMechanism') && 
        componentContent.includes('executeWithRetry')) {
      logTest('Retry hook', 'PASS');
    } else {
      logTest('Retry hook', 'FAIL', 'Missing retry hook');
    }
    
  } catch (error) {
    logTest('Retry mechanism file readable', 'FAIL', error.message);
  }
}

// Test 4: Verify offline data display component
function testOfflineDataDisplay() {
  console.log('\n🔄 Test 4: Offline Data Display Component');
  
  try {
    const componentPath = path.join(__dirname, 'src', 'components', 'pwa', 'OfflineDataDisplay.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    // Check for conflict resolution
    if (componentContent.includes('getAgendamentoConflicts') && 
        componentContent.includes('resolveAgendamentoConflict') &&
        componentContent.includes('handleResolveConflict')) {
      logTest('Conflict resolution UI', 'PASS');
    } else {
      logTest('Conflict resolution UI', 'FAIL', 'Missing conflict resolution');
    }
    
    // Check for filtering capabilities
    if (componentContent.includes('searchTerm') && 
        componentContent.includes('statusFilter') &&
        componentContent.includes('syncStatusFilter')) {
      logTest('Data filtering', 'PASS');
    } else {
      logTest('Data filtering', 'FAIL', 'Missing filter functionality');
    }
    
    // Check for sync status indicators
    if (componentContent.includes('getSyncStatusColor') && 
        componentContent.includes('getSyncStatusIcon')) {
      logTest('Sync status indicators', 'PASS');
    } else {
      logTest('Sync status indicators', 'FAIL', 'Missing status indicators');
    }
    
    // Check for offline-only toggle
    if (componentContent.includes('showOfflineOnly') && 
        componentContent.includes('Eye')) {
      logTest('Offline-only filter', 'PASS');
    } else {
      logTest('Offline-only filter', 'FAIL', 'Missing offline filter');
    }
    
    // Check for metadata display
    if (componentContent.includes('_offline') && 
        componentContent.includes('version') &&
        componentContent.includes('lastSync')) {
      logTest('Offline metadata display', 'PASS');
    } else {
      logTest('Offline metadata display', 'FAIL', 'Missing metadata display');
    }
    
  } catch (error) {
    logTest('Offline data display file readable', 'FAIL', error.message);
  }
}

// Test 5: Verify offline page
function testOfflinePage() {
  console.log('\n📱 Test 5: Offline Page');
  
  try {
    const pagePath = path.join(__dirname, 'src', 'app', 'offline', 'page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    
    // Check for comprehensive stats display
    if (pageContent.includes('getStorageStats') && 
        pageContent.includes('getDataSyncStatus') &&
        pageContent.includes('storageStats')) {
      logTest('Storage statistics', 'PASS');
    } else {
      logTest('Storage statistics', 'FAIL', 'Missing storage stats');
    }
    
    // Check for data integrity features
    if (pageContent.includes('validateDataIntegrity') && 
        pageContent.includes('handleValidateIntegrity')) {
      logTest('Data integrity validation', 'PASS');
    } else {
      logTest('Data integrity validation', 'FAIL', 'Missing integrity validation');
    }
    
    // Check for storage optimization
    if (pageContent.includes('optimizeStorage') && 
        pageContent.includes('handleOptimizeStorage')) {
      logTest('Storage optimization', 'PASS');
    } else {
      logTest('Storage optimization', 'FAIL', 'Missing optimization');
    }
    
    // Check for status overview cards
    if (pageContent.includes('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4') && 
        pageContent.includes('Connection Status')) {
      logTest('Status overview cards', 'PASS');
    } else {
      logTest('Status overview cards', 'FAIL', 'Missing status cards');
    }
    
    // Check for help section
    if (pageContent.includes('Como funciona o modo offline') && 
        pageContent.includes('Sincronização automática')) {
      logTest('Help documentation', 'PASS');
    } else {
      logTest('Help documentation', 'FAIL', 'Missing help section');
    }
    
  } catch (error) {
    logTest('Offline page file readable', 'FAIL', error.message);
  }
}

// Test 6: Verify component integration
function testComponentIntegration() {
  console.log('\n🔗 Test 6: Component Integration');
  
  try {
    // Check if components import each other correctly
    const offlinePagePath = path.join(__dirname, 'src', 'app', 'offline', 'page.tsx');
    const offlinePageContent = fs.readFileSync(offlinePagePath, 'utf8');
    
    const expectedImports = [
      'OfflineIndicator',
      'OfflineDataDisplay', 
      'RetryMechanism',
      'useRetryMechanism'
    ];
    
    expectedImports.forEach(importName => {
      if (offlinePageContent.includes(importName)) {
        logTest(`Import: ${importName}`, 'PASS');
      } else {
        logTest(`Import: ${importName}`, 'FAIL', 'Import not found');
      }
    });
    
    // Check for proper hook usage
    if (offlinePageContent.includes('useOfflineData') && 
        offlinePageContent.includes('isOnline') &&
        offlinePageContent.includes('syncQueueCount')) {
      logTest('Offline data hooks usage', 'PASS');
    } else {
      logTest('Offline data hooks usage', 'FAIL', 'Missing hook usage');
    }
    
    // Check for responsive design
    if (offlinePageContent.includes('md:grid-cols') && 
        offlinePageContent.includes('lg:grid-cols')) {
      logTest('Responsive design', 'PASS');
    } else {
      logTest('Responsive design', 'FAIL', 'Missing responsive classes');
    }
    
  } catch (error) {
    logTest('Component integration check', 'FAIL', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting StudioFlow Offline UI Components Tests\n');
  
  testOfflineIndicator();
  testOfflineFallback();
  testRetryMechanism();
  testOfflineDataDisplay();
  testOfflinePage();
  testComponentIntegration();
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Passed: ${testResults.passed}`);
  console.log(`   ❌ Failed: ${testResults.failed}`);
  console.log(`   📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All offline UI component tests passed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Test components in browser environment');
    console.log('   2. Verify responsive design on different screen sizes');
    console.log('   3. Test offline/online state transitions');
    console.log('   4. Validate accessibility features');
    console.log('   5. Test conflict resolution workflows');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the implementation.');
    console.log('\n🔧 Failed tests:');
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`   • ${test.name}: ${test.details}`);
      });
  }
  
  console.log('\n✨ Offline UI components validation complete!');
}

// Execute tests
runAllTests().catch(console.error);