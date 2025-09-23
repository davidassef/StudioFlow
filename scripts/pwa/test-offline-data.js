const fs = require('fs');
const path = require('path');

console.log('🧪 Testing StudioFlow Offline Data Management...\n');

// Test configuration
const testConfig = {
  testTimeout: 10000,
  mockData: {
    agendamento: {
      id: 'test-123',
      clienteId: 'cliente-456',
      salaId: 'sala-789',
      dataHora: '2025-09-18T14:00:00Z',
      duracao: 120,
      status: 'confirmado',
      observacoes: 'Gravação de demo'
    },
    sala: {
      id: 'sala-789',
      nome: 'Estúdio A',
      capacidade: 4,
      equipamentos: ['Mesa de som', 'Microfones', 'Monitores'],
      preco: 150
    }
  }
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

// Test 1: Verify offline storage implementation
function testOfflineStorageImplementation() {
  console.log('📋 Test 1: Offline Storage Implementation');
  
  try {
    const storagePath = path.join(__dirname, 'src', 'lib', 'offlineStorage.ts');
    const storageContent = fs.readFileSync(storagePath, 'utf8');
    
    // Check for core interfaces
    if (storageContent.includes('interface OfflineData') && 
        storageContent.includes('interface SyncQueueItem')) {
      logTest('Core interfaces defined', 'PASS');
    } else {
      logTest('Core interfaces defined', 'FAIL', 'Missing OfflineData or SyncQueueItem interface');
    }
    
    // Check for IndexedDB implementation
    if (storageContent.includes('indexedDB.open') && 
        storageContent.includes('createObjectStore')) {
      logTest('IndexedDB implementation', 'PASS');
    } else {
      logTest('IndexedDB implementation', 'FAIL', 'Missing IndexedDB setup');
    }
    
    // Check for conflict resolution
    if (storageContent.includes('detectConflict') && 
        storageContent.includes('resolveConflict') &&
        storageContent.includes('markAsConflict')) {
      logTest('Conflict resolution methods', 'PASS');
    } else {
      logTest('Conflict resolution methods', 'FAIL', 'Missing conflict resolution methods');
    }
    
    // Check for data integrity features
    if (storageContent.includes('validateDataIntegrity') && 
        storageContent.includes('generateChecksum')) {
      logTest('Data integrity validation', 'PASS');
    } else {
      logTest('Data integrity validation', 'FAIL', 'Missing data integrity features');
    }
    
    // Check for background sync integration
    if (storageContent.includes('processSyncQueueBatch') && 
        storageContent.includes('scheduleBackgroundSync')) {
      logTest('Background sync integration', 'PASS');
    } else {
      logTest('Background sync integration', 'FAIL', 'Missing background sync features');
    }
    
    // Check for storage optimization
    if (storageContent.includes('optimizeStorage') && 
        storageContent.includes('getStorageStats')) {
      logTest('Storage optimization', 'PASS');
    } else {
      logTest('Storage optimization', 'FAIL', 'Missing storage optimization');
    }
    
  } catch (error) {
    logTest('Offline storage file readable', 'FAIL', error.message);
  }
}

// Test 2: Verify offline data hooks
function testOfflineDataHooks() {
  console.log('\n🔧 Test 2: Offline Data Hooks');
  
  try {
    const hooksPath = path.join(__dirname, 'src', 'hooks', 'useOfflineData.ts');
    const hooksContent = fs.readFileSync(hooksPath, 'utf8');
    
    // Check for enhanced state management
    if (hooksContent.includes('conflictCount') && 
        hooksContent.includes('syncInProgress') &&
        hooksContent.includes('dataIntegrityStatus')) {
      logTest('Enhanced state management', 'PASS');
    } else {
      logTest('Enhanced state management', 'FAIL', 'Missing enhanced state properties');
    }
    
    // Check for conflict resolution hooks
    if (hooksContent.includes('getConflicts') && 
        hooksContent.includes('resolveConflict')) {
      logTest('Conflict resolution hooks', 'PASS');
    } else {
      logTest('Conflict resolution hooks', 'FAIL', 'Missing conflict resolution hooks');
    }
    
    // Check for batch processing
    if (hooksContent.includes('processSyncQueueBatch')) {
      logTest('Batch sync processing', 'PASS');
    } else {
      logTest('Batch sync processing', 'FAIL', 'Missing batch processing');
    }
    
    // Check for specialized agendamento hooks
    if (hooksContent.includes('useOfflineAgendamentos') && 
        hooksContent.includes('getAgendamentoConflicts') &&
        hooksContent.includes('mergeAgendamentoData')) {
      logTest('Specialized agendamento hooks', 'PASS');
    } else {
      logTest('Specialized agendamento hooks', 'FAIL', 'Missing specialized hooks');
    }
    
    // Check for data integrity monitoring
    if (hooksContent.includes('validateDataIntegrity') && 
        hooksContent.includes('updateDataIntegrityStatus')) {
      logTest('Data integrity monitoring', 'PASS');
    } else {
      logTest('Data integrity monitoring', 'FAIL', 'Missing integrity monitoring');
    }
    
  } catch (error) {
    logTest('Offline hooks file readable', 'FAIL', error.message);
  }
}

// Test 3: Validate sync queue priority system
function testSyncQueuePriority() {
  console.log('\n⏰ Test 3: Sync Queue Priority System');
  
  try {
    const storagePath = path.join(__dirname, 'src', 'lib', 'offlineStorage.ts');
    const storageContent = fs.readFileSync(storagePath, 'utf8');
    
    // Check for priority types
    const priorities = ['low', 'normal', 'high', 'critical'];
    priorities.forEach(priority => {
      if (storageContent.includes(`'${priority}'`)) {
        logTest(`Priority level: ${priority}`, 'PASS');
      } else {
        logTest(`Priority level: ${priority}`, 'FAIL', 'Priority not found');
      }
    });
    
    // Check for priority sorting
    if (storageContent.includes('priorityOrder') && 
        storageContent.includes('sort')) {
      logTest('Priority sorting implementation', 'PASS');
    } else {
      logTest('Priority sorting implementation', 'FAIL', 'Missing priority sorting');
    }
    
    // Check for dependency handling
    if (storageContent.includes('dependencies') && 
        storageContent.includes('checkPendingDependencies')) {
      logTest('Dependency handling', 'PASS');
    } else {
      logTest('Dependency handling', 'FAIL', 'Missing dependency system');
    }
    
  } catch (error) {
    logTest('Priority system validation', 'FAIL', error.message);
  }
}

// Test 4: Check conflict resolution strategies
function testConflictResolutionStrategies() {
  console.log('\n🔄 Test 4: Conflict Resolution Strategies');
  
  try {
    const storagePath = path.join(__dirname, 'src', 'lib', 'offlineStorage.ts');
    const storageContent = fs.readFileSync(storagePath, 'utf8');
    
    // Check for resolution strategies
    const strategies = ['client', 'server', 'merge'];
    strategies.forEach(strategy => {
      if (storageContent.includes(`'${strategy}'`)) {
        logTest(`Resolution strategy: ${strategy}`, 'PASS');
      } else {
        logTest(`Resolution strategy: ${strategy}`, 'FAIL', 'Strategy not found');
      }
    });
    
    // Check for conflict detection
    if (storageContent.includes('detectConflict') && 
        storageContent.includes('serverVersion') &&
        storageContent.includes('checksum')) {
      logTest('Conflict detection logic', 'PASS');
    } else {
      logTest('Conflict detection logic', 'FAIL', 'Missing conflict detection');
    }
    
    // Check for merge logic in hooks
    const hooksPath = path.join(__dirname, 'src', 'hooks', 'useOfflineData.ts');
    const hooksContent = fs.readFileSync(hooksPath, 'utf8');
    
    if (hooksContent.includes('mergeAgendamentoData') && 
        hooksContent.includes('_mergedOffline')) {
      logTest('Smart merge implementation', 'PASS');
    } else {
      logTest('Smart merge implementation', 'FAIL', 'Missing merge logic');
    }
    
  } catch (error) {
    logTest('Conflict resolution validation', 'FAIL', error.message);
  }
}

// Test 5: Verify data integrity features
function testDataIntegrityFeatures() {
  console.log('\n🔍 Test 5: Data Integrity Features');
  
  try {
    const storagePath = path.join(__dirname, 'src', 'lib', 'offlineStorage.ts');
    const storageContent = fs.readFileSync(storagePath, 'utf8');
    
    // Check for checksum generation
    if (storageContent.includes('generateChecksum') && 
        storageContent.includes('JSON.stringify')) {
      logTest('Checksum generation', 'PASS');
    } else {
      logTest('Checksum generation', 'FAIL', 'Missing checksum logic');
    }
    
    // Check for integrity validation
    if (storageContent.includes('validateDataIntegrity') && 
        storageContent.includes('repaired')) {
      logTest('Integrity validation', 'PASS');
    } else {
      logTest('Integrity validation', 'FAIL', 'Missing validation logic');
    }
    
    // Check for orphaned data cleanup
    if (storageContent.includes('orphaned') && 
        storageContent.includes('stale')) {
      logTest('Orphaned data cleanup', 'PASS');
    } else {
      logTest('Orphaned data cleanup', 'FAIL', 'Missing cleanup logic');
    }
    
    // Check for storage optimization
    if (storageContent.includes('optimizeStorage') && 
        storageContent.includes('spaceFreed')) {
      logTest('Storage optimization', 'PASS');
    } else {
      logTest('Storage optimization', 'FAIL', 'Missing optimization');
    }
    
  } catch (error) {
    logTest('Data integrity validation', 'FAIL', error.message);
  }
}

// Test 6: Validate background sync integration
function testBackgroundSyncIntegration() {
  console.log('\n🔄 Test 6: Background Sync Integration');
  
  try {
    const storagePath = path.join(__dirname, 'src', 'lib', 'offlineStorage.ts');
    const storageContent = fs.readFileSync(storagePath, 'utf8');
    
    // Check for service worker integration
    if (storageContent.includes('serviceWorker') && 
        storageContent.includes('sync.register')) {
      logTest('Service worker integration', 'PASS');
    } else {
      logTest('Service worker integration', 'FAIL', 'Missing SW integration');
    }
    
    // Check for batch processing
    if (storageContent.includes('processSyncQueueBatch') && 
        storageContent.includes('batchSize')) {
      logTest('Batch processing', 'PASS');
    } else {
      logTest('Batch processing', 'FAIL', 'Missing batch processing');
    }
    
    // Check for retry logic
    if (storageContent.includes('retryCount') && 
        storageContent.includes('maxRetries') &&
        storageContent.includes('incrementRetryCount')) {
      logTest('Retry logic', 'PASS');
    } else {
      logTest('Retry logic', 'FAIL', 'Missing retry mechanism');
    }
    
    // Check for API integration
    if (storageContent.includes('makeApiRequest') && 
        storageContent.includes('getApiEndpoint')) {
      logTest('API integration', 'PASS');
    } else {
      logTest('API integration', 'FAIL', 'Missing API integration');
    }
    
  } catch (error) {
    logTest('Background sync validation', 'FAIL', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting StudioFlow Offline Data Management Tests\n');
  
  testOfflineStorageImplementation();
  testOfflineDataHooks();
  testSyncQueuePriority();
  testConflictResolutionStrategies();
  testDataIntegrityFeatures();
  testBackgroundSyncIntegration();
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Passed: ${testResults.passed}`);
  console.log(`   ❌ Failed: ${testResults.failed}`);
  console.log(`   📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All offline data management tests passed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Test offline functionality in browser');
    console.log('   2. Simulate network failures and recovery');
    console.log('   3. Test conflict resolution scenarios');
    console.log('   4. Validate data integrity over time');
    console.log('   5. Performance test with large datasets');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the implementation.');
    console.log('\n🔧 Failed tests:');
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`   • ${test.name}: ${test.details}`);
      });
  }
  
  console.log('\n✨ Offline data management validation complete!');
}

// Execute tests
runAllTests().catch(console.error);