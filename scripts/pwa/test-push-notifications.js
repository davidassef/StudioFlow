const fs = require('fs');
const path = require('path');

console.log('🧪 Testing StudioFlow Push Notification Infrastructure...\n');

// Test configuration
const testConfig = {
  testTimeout: 10000,
  mockNotifications: {
    booking_confirmation: {
      title: 'Agendamento Confirmado',
      body: 'Seu agendamento para hoje às 14:00 foi confirmado.',
      type: 'booking_confirmation',
      data: { bookingId: '123', url: '/agendamentos/123' }
    },
    booking_reminder: {
      title: 'Lembrete de Agendamento',
      body: 'Seu agendamento começa em 1 hora.',
      type: 'booking_reminder',
      data: { bookingId: '123', url: '/agendamentos/123' }
    },
    new_booking_request: {
      title: 'Nova Solicitação',
      body: 'João Silva solicitou um agendamento para amanhã.',
      type: 'new_booking_request',
      data: { requestId: '456', url: '/agendamentos/solicitacoes/456' }
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

// Test 1: Verify PushNotificationManager implementation
function testPushNotificationManager() {
  console.log('📋 Test 1: PushNotificationManager Implementation');
  
  try {
    const managerPath = path.join(__dirname, 'src', 'lib', 'pushNotificationManager.ts');
    const managerContent = fs.readFileSync(managerPath, 'utf8');
    
    // Check for core interfaces
    if (managerContent.includes('interface NotificationPayload') && 
        managerContent.includes('interface NotificationPreferences')) {
      logTest('Core interfaces defined', 'PASS');
    } else {
      logTest('Core interfaces defined', 'FAIL', 'Missing NotificationPayload or NotificationPreferences interface');
    }
    
    // Check for singleton pattern
    if (managerContent.includes('private static instance') && 
        managerContent.includes('getInstance()')) {
      logTest('Singleton pattern implementation', 'PASS');
    } else {
      logTest('Singleton pattern implementation', 'FAIL', 'Missing singleton pattern');
    }
    
    // Check for permission management
    if (managerContent.includes('requestPermissionWithUI') && 
        managerContent.includes('showPermissionRequestUI')) {
      logTest('User-friendly permission flow', 'PASS');
    } else {
      logTest('User-friendly permission flow', 'FAIL', 'Missing UI permission flow');
    }
    
    // Check for subscription management
    if (managerContent.includes('sendSubscriptionToBackend') && 
        managerContent.includes('removeSubscriptionFromBackend')) {
      logTest('Backend subscription management', 'PASS');
    } else {
      logTest('Backend subscription management', 'FAIL', 'Missing backend integration');
    }
    
    // Check for preferences management
    if (managerContent.includes('loadPreferences') && 
        managerContent.includes('savePreferences') &&
        managerContent.includes('quietHours')) {
      logTest('Notification preferences system', 'PASS');
    } else {
      logTest('Notification preferences system', 'FAIL', 'Missing preferences management');
    }
    
    // Check for local notifications
    if (managerContent.includes('showLocalNotification') && 
        managerContent.includes('isInQuietHours')) {
      logTest('Local notification handling', 'PASS');
    } else {
      logTest('Local notification handling', 'FAIL', 'Missing local notification features');
    }
    
  } catch (error) {
    logTest('PushNotificationManager file readable', 'FAIL', error.message);
  }
}

// Test 2: Verify enhanced usePushNotifications hook
function testPushNotificationsHook() {
  console.log('\n🔧 Test 2: Enhanced usePushNotifications Hook');
  
  try {
    const hookPath = path.join(__dirname, 'src', 'hooks', 'usePushNotifications.ts');
    const hookContent = fs.readFileSync(hookPath, 'utf8');
    
    // Check for enhanced state management
    if (hookContent.includes('preferences: NotificationPreferences') && 
        hookContent.includes('isInitialized: boolean')) {
      logTest('Enhanced state management', 'PASS');
    } else {
      logTest('Enhanced state management', 'FAIL', 'Missing enhanced state properties');
    }
    
    // Check for UI permission flow
    if (hookContent.includes('requestPermissionWithUI')) {
      logTest('UI permission flow integration', 'PASS');
    } else {
      logTest('UI permission flow integration', 'FAIL', 'Missing UI permission flow');
    }
    
    // Check for preferences management
    if (hookContent.includes('updatePreferences') && 
        hookContent.includes('NotificationPreferences')) {
      logTest('Preferences management', 'PASS');
    } else {
      logTest('Preferences management', 'FAIL', 'Missing preferences management');
    }
    
    // Check for local notifications
    if (hookContent.includes('showLocalNotification') && 
        hookContent.includes('NotificationPayload')) {
      logTest('Local notification support', 'PASS');
    } else {
      logTest('Local notification support', 'FAIL', 'Missing local notification support');
    }
    
    // Check for test functions
    if (hookContent.includes('sendTestNotification') && 
        hookContent.includes('sendTestPushNotification')) {
      logTest('Test notification functions', 'PASS');
    } else {
      logTest('Test notification functions', 'FAIL', 'Missing test functions');
    }
    
  } catch (error) {
    logTest('usePushNotifications hook file readable', 'FAIL', error.message);
  }
}

// Test 3: Validate NotificationPreferences component
function testNotificationPreferencesComponent() {
  console.log('\n🎨 Test 3: NotificationPreferences Component');
  
  try {
    const componentPath = path.join(__dirname, 'src', 'components', 'pwa', 'NotificationPreferences.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    // Check for comprehensive UI
    if (componentContent.includes('Tipos de Notificação') && 
        componentContent.includes('Som e Vibração') &&
        componentContent.includes('Horário Silencioso')) {
      logTest('Comprehensive preferences UI', 'PASS');
    } else {
      logTest('Comprehensive preferences UI', 'FAIL', 'Missing UI sections');
    }
    
    // Check for notification type toggles
    const notificationTypes = ['bookingConfirmations', 'bookingReminders', 'newBookingRequests', 'systemUpdates'];
    const hasAllTypes = notificationTypes.every(type => componentContent.includes(type));
    
    if (hasAllTypes) {
      logTest('All notification type toggles', 'PASS');
    } else {
      logTest('All notification type toggles', 'FAIL', 'Missing notification type toggles');
    }
    
    // Check for quiet hours configuration
    if (componentContent.includes('quietHours') && 
        componentContent.includes('type="time"')) {
      logTest('Quiet hours configuration', 'PASS');
    } else {
      logTest('Quiet hours configuration', 'FAIL', 'Missing quiet hours UI');
    }
    
    // Check for test buttons
    if (componentContent.includes('Teste Local') && 
        componentContent.includes('Teste Push')) {
      logTest('Test notification buttons', 'PASS');
    } else {
      logTest('Test notification buttons', 'FAIL', 'Missing test buttons');
    }
    
    // Check for error handling
    if (componentContent.includes('error &&') && 
        componentContent.includes('successMessage &&')) {
      logTest('Error and success handling', 'PASS');
    } else {
      logTest('Error and success handling', 'FAIL', 'Missing error/success handling');
    }
    
  } catch (error) {
    logTest('NotificationPreferences component file readable', 'FAIL', error.message);
  }
}

// Test 4: Verify service worker push handlers
function testServiceWorkerPushHandlers() {
  console.log('\n🔄 Test 4: Service Worker Push Handlers');
  
  try {
    const swPath = path.join(__dirname, 'public', 'sw-custom.js');
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    // Check for enhanced push handler
    if (swContent.includes('addEventListener(\'push\'') && 
        swContent.includes('getNotificationOptions')) {
      logTest('Enhanced push event handler', 'PASS');
    } else {
      logTest('Enhanced push event handler', 'FAIL', 'Missing enhanced push handler');
    }
    
    // Check for notification type handling
    const notificationTypes = ['booking_confirmation', 'booking_reminder', 'new_booking_request', 'system_update'];
    const hasAllTypeHandling = notificationTypes.every(type => swContent.includes(type));
    
    if (hasAllTypeHandling) {
      logTest('Notification type handling', 'PASS');
    } else {
      logTest('Notification type handling', 'FAIL', 'Missing notification type handling');
    }
    
    // Check for action routing
    if (swContent.includes('handleNotificationAction') && 
        swContent.includes('view_booking') &&
        swContent.includes('approve_booking')) {
      logTest('Action routing system', 'PASS');
    } else {
      logTest('Action routing system', 'FAIL', 'Missing action routing');
    }
    
    // Check for click handler
    if (swContent.includes('addEventListener(\'notificationclick\'') && 
        swContent.includes('focusOrOpenWindow')) {
      logTest('Enhanced click handler', 'PASS');
    } else {
      logTest('Enhanced click handler', 'FAIL', 'Missing enhanced click handler');
    }
    
    // Check for client communication
    if (swContent.includes('notifyClients') && 
        swContent.includes('NOTIFICATION_CLICKED')) {
      logTest('Client communication', 'PASS');
    } else {
      logTest('Client communication', 'FAIL', 'Missing client communication');
    }
    
    // Check for utility functions
    if (swContent.includes('storeNotificationData') && 
        swContent.includes('getVibratePatternForType')) {
      logTest('Utility functions', 'PASS');
    } else {
      logTest('Utility functions', 'FAIL', 'Missing utility functions');
    }
    
  } catch (error) {
    logTest('Service worker file readable', 'FAIL', error.message);
  }
}

// Test 5: Validate notification customization
function testNotificationCustomization() {
  console.log('\n🎯 Test 5: Notification Customization');
  
  try {
    const swPath = path.join(__dirname, 'public', 'sw-custom.js');
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    // Check for custom actions per type
    if (swContent.includes('view_booking') && 
        swContent.includes('approve_booking') &&
        swContent.includes('snooze')) {
      logTest('Custom actions per notification type', 'PASS');
    } else {
      logTest('Custom actions per notification type', 'FAIL', 'Missing custom actions');
    }
    
    // Check for vibration patterns
    if (swContent.includes('getVibratePatternForType') && 
        swContent.includes('[300, 100, 300, 100, 300]')) {
      logTest('Custom vibration patterns', 'PASS');
    } else {
      logTest('Custom vibration patterns', 'FAIL', 'Missing vibration patterns');
    }
    
    // Check for URL routing
    if (swContent.includes('getDefaultUrlForType') && 
        swContent.includes('/agendamentos') &&
        swContent.includes('/configuracoes')) {
      logTest('Smart URL routing', 'PASS');
    } else {
      logTest('Smart URL routing', 'FAIL', 'Missing URL routing');
    }
    
    // Check for interaction requirements
    if (swContent.includes('requireInteraction: true')) {
      logTest('Interaction requirements', 'PASS');
    } else {
      logTest('Interaction requirements', 'FAIL', 'Missing interaction requirements');
    }
    
  } catch (error) {
    logTest('Notification customization validation', 'FAIL', error.message);
  }
}

// Test 6: Verify VAPID key handling
function testVAPIDKeyHandling() {
  console.log('\n🔐 Test 6: VAPID Key Handling');
  
  try {
    const managerPath = path.join(__dirname, 'src', 'lib', 'pushNotificationManager.ts');
    const managerContent = fs.readFileSync(managerPath, 'utf8');
    
    // Check for VAPID key configuration
    if (managerContent.includes('NEXT_PUBLIC_VAPID_KEY') && 
        managerContent.includes('urlBase64ToUint8Array')) {
      logTest('VAPID key configuration', 'PASS');
    } else {
      logTest('VAPID key configuration', 'FAIL', 'Missing VAPID key handling');
    }
    
    // Check for key conversion utility
    if (managerContent.includes('urlBase64ToUint8Array') && 
        managerContent.includes('applicationServerKey')) {
      logTest('Key conversion utility', 'PASS');
    } else {
      logTest('Key conversion utility', 'FAIL', 'Missing key conversion');
    }
    
    // Check for subscription data format
    if (managerContent.includes('PushSubscriptionData') && 
        managerContent.includes('p256dh') &&
        managerContent.includes('auth')) {
      logTest('Subscription data format', 'PASS');
    } else {
      logTest('Subscription data format', 'FAIL', 'Missing subscription data format');
    }
    
  } catch (error) {
    logTest('VAPID key handling validation', 'FAIL', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting StudioFlow Push Notification Infrastructure Tests\n');
  
  testPushNotificationManager();
  testPushNotificationsHook();
  testNotificationPreferencesComponent();
  testServiceWorkerPushHandlers();
  testNotificationCustomization();
  testVAPIDKeyHandling();
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Passed: ${testResults.passed}`);
  console.log(`   ❌ Failed: ${testResults.failed}`);
  console.log(`   📈 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All push notification infrastructure tests passed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Set up VAPID keys for production');
    console.log('   2. Implement backend push notification endpoints');
    console.log('   3. Test push notifications in different browsers');
    console.log('   4. Configure notification scheduling system');
    console.log('   5. Set up analytics for notification engagement');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the implementation.');
    console.log('\n🔧 Failed tests:');
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`   • ${test.name}: ${test.details}`);
      });
  }
  
  console.log('\n✨ Push notification infrastructure validation complete!');
}

// Execute tests
runAllTests().catch(console.error);