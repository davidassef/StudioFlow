# StudioFlow Backend Push Notifications Specification

## 🎯 **Task 3.2 - Backend Push Notification Support**

This document provides comprehensive specifications for implementing backend push notification support for the StudioFlow PWA.

## 📋 **Requirements**
- [x] Create Django push_notifications app with models
- [x] Implement VAPID key generation and configuration
- [x] Create push subscription management endpoints
- [x] Set up push notification sending service with retry logic

## 🏗️ **Django App Structure**

### **1. Django App: `push_notifications`**

```python
# apps/push_notifications/
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── tasks.py
├── utils.py
├── migrations/
│   └── __init__.py
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_views.py
    ├── test_services.py
    └── test_tasks.py
```

## 🗄️ **Database Models**

### **1. PushSubscription Model**
```python
# apps/push_notifications/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import json

User = get_user_model()

class PushSubscription(models.Model):
    """
    Stores push notification subscriptions for users
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='push_subscriptions'
    )
    endpoint = models.URLField(unique=True, max_length=500)
    p256dh_key = models.CharField(max_length=255)
    auth_key = models.CharField(max_length=255)
    expiration_time = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # Preferences
    preferences = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'push_subscriptions'
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['endpoint']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"PushSubscription for {self.user.username} - {self.endpoint[:50]}..."
    
    @property
    def subscription_info(self):
        """Return subscription info in the format expected by pywebpush"""
        return {
            "endpoint": self.endpoint,
            "keys": {
                "p256dh": self.p256dh_key,
                "auth": self.auth_key
            }
        }
    
    def is_expired(self):
        """Check if subscription is expired"""
        if self.expiration_time:
            return timezone.now() > self.expiration_time
        return False


class NotificationTemplate(models.Model):
    """
    Templates for different types of notifications
    """
    NOTIFICATION_TYPES = [
        ('booking_confirmation', 'Booking Confirmation'),
        ('booking_reminder', 'Booking Reminder'),
        ('new_booking_request', 'New Booking Request'),
        ('system_update', 'System Update'),
        ('marketing', 'Marketing Message'),
    ]
    
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES, unique=True)
    title_template = models.CharField(max_length=200)
    body_template = models.TextField()
    icon = models.CharField(max_length=200, default='/icons/icon-192x192.png')
    badge = models.CharField(max_length=200, default='/icons/icon-72x72.png')
    
    # Notification behavior
    require_interaction = models.BooleanField(default=False)
    silent = models.BooleanField(default=False)
    vibrate_pattern = models.JSONField(default=list)  # [200, 100, 200]
    
    # Actions
    actions = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'notification_templates'
    
    def __str__(self):
        return f"Template: {self.get_type_display()}"
    
    def render(self, context):
        """Render template with context variables"""
        from django.template import Template, Context
        
        title = Template(self.title_template).render(Context(context))
        body = Template(self.body_template).render(Context(context))
        
        return {
            'title': title,
            'body': body,
            'icon': self.icon,
            'badge': self.badge,
            'requireInteraction': self.require_interaction,
            'silent': self.silent,
            'vibrate': self.vibrate_pattern,
            'actions': self.actions,
            'type': self.type
        }


class PushNotification(models.Model):
    """
    Log of sent push notifications
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('expired', 'Expired'),
    ]
    
    subscription = models.ForeignKey(
        PushSubscription, 
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    template = models.ForeignKey(
        NotificationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # Notification content
    title = models.CharField(max_length=200)
    body = models.TextField()
    data = models.JSONField(default=dict)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    retry_count = models.PositiveIntegerField(default=0)
    max_retries = models.PositiveIntegerField(default=3)
    
    # Scheduling
    scheduled_for = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'push_notifications'
        indexes = [
            models.Index(fields=['status', 'scheduled_for']),
            models.Index(fields=['subscription', 'created_at']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Notification: {self.title} - {self.status}"
    
    def can_retry(self):
        """Check if notification can be retried"""
        return self.status == 'failed' and self.retry_count < self.max_retries


class NotificationAnalytics(models.Model):
    """
    Analytics for push notifications
    """
    ACTION_TYPES = [
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('clicked', 'Clicked'),
        ('dismissed', 'Dismissed'),
        ('action_clicked', 'Action Clicked'),
    ]
    
    notification = models.ForeignKey(
        PushNotification,
        on_delete=models.CASCADE,
        related_name='analytics'
    )
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    action_data = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # User context
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        db_table = 'notification_analytics'
        indexes = [
            models.Index(fields=['notification', 'action_type']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"Analytics: {self.notification.title} - {self.action_type}"
```

## 🔧 **VAPID Key Configuration**

### **1. VAPID Key Generation**
```python
# apps/push_notifications/utils.py
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.backends import default_backend
import base64
import os

def generate_vapid_keys():
    """
    Generate VAPID key pair for push notifications
    """
    # Generate private key
    private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())
    
    # Get public key
    public_key = private_key.public_key()
    
    # Serialize private key
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    
    # Serialize public key in uncompressed format
    public_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint
    )
    
    # Convert to base64url format (without padding)
    private_key_b64 = base64.urlsafe_b64encode(private_pem).decode('utf-8').rstrip('=')
    public_key_b64 = base64.urlsafe_b64encode(public_bytes).decode('utf-8').rstrip('=')
    
    return {
        'private_key': private_key_b64,
        'public_key': public_key_b64,
        'private_key_pem': private_pem.decode('utf-8'),
        'public_key_bytes': public_bytes
    }

def get_vapid_keys():
    """
    Get VAPID keys from environment or generate new ones
    """
    private_key = os.getenv('VAPID_PRIVATE_KEY')
    public_key = os.getenv('VAPID_PUBLIC_KEY')
    
    if not private_key or not public_key:
        keys = generate_vapid_keys()
        print("Generated new VAPID keys. Add these to your environment:")
        print(f"VAPID_PRIVATE_KEY={keys['private_key']}")
        print(f"VAPID_PUBLIC_KEY={keys['public_key']}")
        return keys
    
    return {
        'private_key': private_key,
        'public_key': public_key
    }

# Management command to generate VAPID keys
# apps/push_notifications/management/commands/generate_vapid_keys.py
from django.core.management.base import BaseCommand
from apps.push_notifications.utils import generate_vapid_keys

class Command(BaseCommand):
    help = 'Generate VAPID keys for push notifications'
    
    def handle(self, *args, **options):
        keys = generate_vapid_keys()
        
        self.stdout.write(
            self.style.SUCCESS('VAPID keys generated successfully!')
        )
        self.stdout.write('\nAdd these to your environment variables:')
        self.stdout.write(f'VAPID_PRIVATE_KEY={keys["private_key"]}')
        self.stdout.write(f'VAPID_PUBLIC_KEY={keys["public_key"]}')
        
        self.stdout.write('\nAdd this to your frontend environment:')
        self.stdout.write(f'NEXT_PUBLIC_VAPID_KEY={keys["public_key"]}')
```

## 🌐 **API Endpoints**

### **1. Subscription Management**
```python
# apps/push_notifications/serializers.py
from rest_framework import serializers
from .models import PushSubscription, NotificationTemplate

class PushSubscriptionSerializer(serializers.ModelSerializer):
    subscription = serializers.JSONField(write_only=True)
    preferences = serializers.JSONField(required=False)
    
    class Meta:
        model = PushSubscription
        fields = ['id', 'subscription', 'preferences', 'created_at', 'is_active']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        subscription_data = validated_data.pop('subscription')
        
        # Extract subscription details
        endpoint = subscription_data['endpoint']
        keys = subscription_data['keys']
        expiration_time = subscription_data.get('expirationTime')
        
        # Convert expiration time
        if expiration_time:
            from datetime import datetime
            expiration_time = datetime.fromtimestamp(expiration_time / 1000)
        
        # Create or update subscription
        subscription, created = PushSubscription.objects.update_or_create(
            endpoint=endpoint,
            defaults={
                'user': self.context['request'].user,
                'p256dh_key': keys['p256dh'],
                'auth_key': keys['auth'],
                'expiration_time': expiration_time,
                'preferences': validated_data.get('preferences', {}),
                'is_active': True,
                'user_agent': self.context['request'].META.get('HTTP_USER_AGENT', ''),
                'ip_address': self.get_client_ip(self.context['request']),
            }
        )
        
        return subscription
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class NotificationPreferencesSerializer(serializers.Serializer):
    enabled = serializers.BooleanField(default=True)
    booking_confirmations = serializers.BooleanField(default=True)
    booking_reminders = serializers.BooleanField(default=True)
    new_booking_requests = serializers.BooleanField(default=True)
    system_updates = serializers.BooleanField(default=True)
    marketing_messages = serializers.BooleanField(default=False)
    quiet_hours = serializers.JSONField(default=dict)
    sound_enabled = serializers.BooleanField(default=True)
    vibration_enabled = serializers.BooleanField(default=True)
```

### **2. API Views**
```python
# apps/push_notifications/views.py
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import PushSubscription, PushNotification
from .serializers import PushSubscriptionSerializer, NotificationPreferencesSerializer
from .services import PushNotificationService

class PushSubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Create or update push subscription"""
        serializer = PushSubscriptionSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            subscription = serializer.save()
            return Response({
                'success': True,
                'message': 'Subscription created successfully',
                'subscription_id': subscription.id
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        """Remove push subscription"""
        endpoint = request.data.get('endpoint')
        
        if not endpoint:
            return Response({
                'success': False,
                'message': 'Endpoint is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            subscription = PushSubscription.objects.get(
                endpoint=endpoint,
                user=request.user
            )
            subscription.is_active = False
            subscription.save()
            
            return Response({
                'success': True,
                'message': 'Subscription removed successfully'
            })
        except PushSubscription.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Subscription not found'
            }, status=status.HTTP_404_NOT_FOUND)

class NotificationPreferencesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request):
        """Update notification preferences"""
        endpoint = request.data.get('endpoint')
        preferences = request.data.get('preferences', {})
        
        if not endpoint:
            return Response({
                'success': False,
                'message': 'Endpoint is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = NotificationPreferencesSerializer(data=preferences)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            subscription = PushSubscription.objects.get(
                endpoint=endpoint,
                user=request.user,
                is_active=True
            )
            subscription.preferences = serializer.validated_data
            subscription.save()
            
            return Response({
                'success': True,
                'message': 'Preferences updated successfully'
            })
        except PushSubscription.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Active subscription not found'
            }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_test_notification(request):
    """Send test push notification"""
    endpoint = request.data.get('endpoint')
    
    if not endpoint:
        return Response({
            'success': False,
            'message': 'Endpoint is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        subscription = PushSubscription.objects.get(
            endpoint=endpoint,
            user=request.user,
            is_active=True
        )
        
        # Send test notification
        service = PushNotificationService()
        result = service.send_notification(
            subscription=subscription,
            title='StudioFlow Test',
            body='Esta é uma notificação de teste do StudioFlow!',
            data={
                'type': 'test',
                'url': '/dashboard',
                'timestamp': timezone.now().isoformat()
            }
        )
        
        if result['success']:
            return Response({
                'success': True,
                'message': 'Test notification sent successfully'
            })
        else:
            return Response({
                'success': False,
                'message': f'Failed to send notification: {result["error"]}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except PushSubscription.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Active subscription not found'
        }, status=status.HTTP_404_NOT_FOUND)
```

## 🚀 **Push Notification Service**

### **1. Core Service Class**
```python
# apps/push_notifications/services.py
from pywebpush import webpush, WebPushException
from django.conf import settings
from django.utils import timezone
from django.db import transaction
import json
import logging
from .models import PushSubscription, PushNotification, NotificationTemplate
from .utils import get_vapid_keys

logger = logging.getLogger(__name__)

class PushNotificationService:
    def __init__(self):
        self.vapid_keys = get_vapid_keys()
        self.vapid_claims = {
            "sub": f"mailto:{settings.VAPID_CONTACT_EMAIL}"
        }
    
    def send_notification(self, subscription, title, body, data=None, template_type=None):
        """
        Send push notification to a single subscription
        """
        if not subscription.is_active or subscription.is_expired():
            return {
                'success': False,
                'error': 'Subscription is inactive or expired'
            }
        
        # Check user preferences
        if not self._should_send_notification(subscription, template_type):
            return {
                'success': False,
                'error': 'Notification blocked by user preferences'
            }
        
        # Create notification record
        notification = PushNotification.objects.create(
            subscription=subscription,
            title=title,
            body=body,
            data=data or {},
            status='pending'
        )
        
        try:
            # Prepare payload
            payload = {
                'title': title,
                'body': body,
                'icon': '/icons/icon-192x192.png',
                'badge': '/icons/icon-72x72.png',
                'data': data or {},
                'type': template_type or 'general'
            }
            
            # Add template-specific customizations
            if template_type:
                payload.update(self._get_template_customizations(template_type))
            
            # Send notification
            response = webpush(
                subscription_info=subscription.subscription_info,
                data=json.dumps(payload),
                vapid_private_key=self.vapid_keys['private_key'],
                vapid_claims=self.vapid_claims
            )
            
            # Update notification status
            notification.status = 'sent'
            notification.sent_at = timezone.now()
            notification.save()
            
            logger.info(f"Push notification sent successfully to {subscription.user.username}")
            
            return {
                'success': True,
                'notification_id': notification.id,
                'response': response
            }
            
        except WebPushException as e:
            logger.error(f"WebPush error: {e}")
            
            # Handle different error types
            if e.response and e.response.status_code == 410:
                # Subscription is no longer valid
                subscription.is_active = False
                subscription.save()
                notification.status = 'expired'
                notification.error_message = 'Subscription expired'
            else:
                notification.status = 'failed'
                notification.error_message = str(e)
            
            notification.save()
            
            return {
                'success': False,
                'error': str(e),
                'notification_id': notification.id
            }
        
        except Exception as e:
            logger.error(f"Unexpected error sending push notification: {e}")
            
            notification.status = 'failed'
            notification.error_message = str(e)
            notification.save()
            
            return {
                'success': False,
                'error': str(e),
                'notification_id': notification.id
            }
    
    def send_bulk_notifications(self, subscriptions, title, body, data=None, template_type=None):
        """
        Send push notifications to multiple subscriptions
        """
        results = {
            'total': len(subscriptions),
            'sent': 0,
            'failed': 0,
            'blocked': 0,
            'details': []
        }
        
        for subscription in subscriptions:
            result = self.send_notification(
                subscription=subscription,
                title=title,
                body=body,
                data=data,
                template_type=template_type
            )
            
            if result['success']:
                results['sent'] += 1
            elif 'blocked by user preferences' in result.get('error', ''):
                results['blocked'] += 1
            else:
                results['failed'] += 1
            
            results['details'].append({
                'subscription_id': subscription.id,
                'user_id': subscription.user.id,
                'success': result['success'],
                'error': result.get('error')
            })
        
        return results
    
    def send_to_user(self, user, title, body, data=None, template_type=None):
        """
        Send push notification to all active subscriptions of a user
        """
        subscriptions = PushSubscription.objects.filter(
            user=user,
            is_active=True
        )
        
        if not subscriptions.exists():
            return {
                'success': False,
                'error': 'No active subscriptions found for user'
            }
        
        return self.send_bulk_notifications(
            subscriptions=subscriptions,
            title=title,
            body=body,
            data=data,
            template_type=template_type
        )
    
    def send_templated_notification(self, subscription, template_type, context):
        """
        Send notification using a template
        """
        try:
            template = NotificationTemplate.objects.get(
                type=template_type,
                is_active=True
            )
            
            rendered = template.render(context)
            
            return self.send_notification(
                subscription=subscription,
                title=rendered['title'],
                body=rendered['body'],
                data={
                    **context,
                    'type': template_type,
                    'requireInteraction': rendered['requireInteraction'],
                    'actions': rendered['actions']
                },
                template_type=template_type
            )
            
        except NotificationTemplate.DoesNotExist:
            logger.error(f"Template not found: {template_type}")
            return {
                'success': False,
                'error': f'Template not found: {template_type}'
            }
    
    def _should_send_notification(self, subscription, template_type):
        """
        Check if notification should be sent based on user preferences
        """
        preferences = subscription.preferences
        
        if not preferences.get('enabled', True):
            return False
        
        # Check specific notification type preferences
        type_mapping = {
            'booking_confirmation': 'booking_confirmations',
            'booking_reminder': 'booking_reminders',
            'new_booking_request': 'new_booking_requests',
            'system_update': 'system_updates',
            'marketing': 'marketing_messages'
        }
        
        pref_key = type_mapping.get(template_type)
        if pref_key and not preferences.get(pref_key, True):
            return False
        
        # Check quiet hours
        if self._is_in_quiet_hours(preferences):
            return False
        
        return True
    
    def _is_in_quiet_hours(self, preferences):
        """
        Check if current time is within user's quiet hours
        """
        quiet_hours = preferences.get('quiet_hours', {})
        
        if not quiet_hours.get('enabled', False):
            return False
        
        from datetime import datetime, time
        
        now = timezone.now()
        current_time = now.time()
        
        start_time = time.fromisoformat(quiet_hours.get('start', '22:00'))
        end_time = time.fromisoformat(quiet_hours.get('end', '08:00'))
        
        # Handle overnight quiet hours (e.g., 22:00 to 08:00)
        if start_time > end_time:
            return current_time >= start_time or current_time <= end_time
        else:
            return start_time <= current_time <= end_time
    
    def _get_template_customizations(self, template_type):
        """
        Get template-specific customizations
        """
        customizations = {
            'booking_confirmation': {
                'requireInteraction': True,
                'actions': [
                    {'action': 'view_booking', 'title': 'Ver Agendamento'},
                    {'action': 'view_details', 'title': 'Ver Detalhes'},
                    {'action': 'dismiss', 'title': 'Dispensar'}
                ]
            },
            'booking_reminder': {
                'requireInteraction': True,
                'vibrate': [300, 100, 300, 100, 300],
                'actions': [
                    {'action': 'view_booking', 'title': 'Ver Agendamento'},
                    {'action': 'snooze', 'title': 'Lembrar em 15min'},
                    {'action': 'dismiss', 'title': 'Dispensar'}
                ]
            },
            'new_booking_request': {
                'requireInteraction': True,
                'actions': [
                    {'action': 'approve_booking', 'title': 'Aprovar'},
                    {'action': 'view_request', 'title': 'Ver Solicitação'},
                    {'action': 'dismiss', 'title': 'Depois'}
                ]
            },
            'system_update': {
                'actions': [
                    {'action': 'view_updates', 'title': 'Ver Atualizações'},
                    {'action': 'dismiss', 'title': 'Dispensar'}
                ]
            }
        }
        
        return customizations.get(template_type, {})
    
    def retry_failed_notifications(self, max_retries=3):
        """
        Retry failed notifications
        """
        failed_notifications = PushNotification.objects.filter(
            status='failed',
            retry_count__lt=max_retries
        )
        
        results = {
            'total': failed_notifications.count(),
            'retried': 0,
            'success': 0,
            'failed': 0
        }
        
        for notification in failed_notifications:
            notification.retry_count += 1
            notification.save()
            
            result = self.send_notification(
                subscription=notification.subscription,
                title=notification.title,
                body=notification.body,
                data=notification.data
            )
            
            results['retried'] += 1
            
            if result['success']:
                results['success'] += 1
            else:
                results['failed'] += 1
        
        return results
```

## 🔄 **Celery Tasks for Background Processing**

### **1. Async Task Implementation**
```python
# apps/push_notifications/tasks.py
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging
from .models import PushSubscription, PushNotification
from .services import PushNotificationService

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_push_notification_task(self, subscription_id, title, body, data=None, template_type=None):
    """
    Async task to send push notification
    """
    try:
        subscription = PushSubscription.objects.get(
            id=subscription_id,
            is_active=True
        )
        
        service = PushNotificationService()
        result = service.send_notification(
            subscription=subscription,
            title=title,
            body=body,
            data=data,
            template_type=template_type
        )
        
        if not result['success']:
            logger.error(f"Failed to send notification: {result['error']}")
            raise Exception(result['error'])
        
        return result
        
    except PushSubscription.DoesNotExist:
        logger.error(f"Subscription {subscription_id} not found")
        return {'success': False, 'error': 'Subscription not found'}
    
    except Exception as exc:
        logger.error(f"Error in send_push_notification_task: {exc}")
        
        # Retry with exponential backoff
        countdown = 2 ** self.request.retries
        raise self.retry(exc=exc, countdown=countdown)

@shared_task
def send_bulk_push_notifications_task(subscription_ids, title, body, data=None, template_type=None):
    """
    Async task to send bulk push notifications
    """
    subscriptions = PushSubscription.objects.filter(
        id__in=subscription_ids,
        is_active=True
    )
    
    service = PushNotificationService()
    result = service.send_bulk_notifications(
        subscriptions=subscriptions,
        title=title,
        body=body,
        data=data,
        template_type=template_type
    )
    
    logger.info(f"Bulk notification results: {result}")
    return result

@shared_task
def send_scheduled_notifications():
    """
    Process scheduled notifications
    """
    now = timezone.now()
    
    scheduled_notifications = PushNotification.objects.filter(
        status='pending',
        scheduled_for__lte=now
    )
    
    service = PushNotificationService()
    processed = 0
    
    for notification in scheduled_notifications:
        result = service.send_notification(
            subscription=notification.subscription,
            title=notification.title,
            body=notification.body,
            data=notification.data
        )
        
        if result['success']:
            processed += 1
    
    logger.info(f"Processed {processed} scheduled notifications")
    return processed

@shared_task
def cleanup_expired_subscriptions():
    """
    Clean up expired subscriptions
    """
    now = timezone.now()
    
    # Mark expired subscriptions as inactive
    expired_count = PushSubscription.objects.filter(
        expiration_time__lt=now,
        is_active=True
    ).update(is_active=False)
    
    # Clean up old notification records (older than 30 days)
    old_notifications = PushNotification.objects.filter(
        created_at__lt=now - timedelta(days=30)
    )
    deleted_count = old_notifications.count()
    old_notifications.delete()
    
    logger.info(f"Cleaned up {expired_count} expired subscriptions and {deleted_count} old notifications")
    
    return {
        'expired_subscriptions': expired_count,
        'deleted_notifications': deleted_count
    }

@shared_task
def retry_failed_notifications():
    """
    Retry failed notifications
    """
    service = PushNotificationService()
    result = service.retry_failed_notifications()
    
    logger.info(f"Retry results: {result}")
    return result

@shared_task
def send_booking_reminder_notifications():
    """
    Send booking reminder notifications (1 hour before)
    """
    from apps.bookings.models import Booking  # Adjust import as needed
    
    # Get bookings starting in 1 hour
    reminder_time = timezone.now() + timedelta(hours=1)
    upcoming_bookings = Booking.objects.filter(
        start_time__range=[
            reminder_time - timedelta(minutes=5),
            reminder_time + timedelta(minutes=5)
        ],
        status='confirmed'
    )
    
    service = PushNotificationService()
    sent_count = 0
    
    for booking in upcoming_bookings:
        # Get user's active subscriptions
        subscriptions = PushSubscription.objects.filter(
            user=booking.user,
            is_active=True
        )
        
        for subscription in subscriptions:
            result = service.send_templated_notification(
                subscription=subscription,
                template_type='booking_reminder',
                context={
                    'booking_id': booking.id,
                    'studio_name': booking.studio.name,
                    'start_time': booking.start_time.strftime('%H:%M'),
                    'url': f'/agendamentos/{booking.id}'
                }
            )
            
            if result['success']:
                sent_count += 1
    
    logger.info(f"Sent {sent_count} booking reminder notifications")
    return sent_count
```

## 📊 **Analytics and Monitoring**

### **1. Analytics Service**
```python
# apps/push_notifications/analytics.py
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import PushNotification, NotificationAnalytics

class NotificationAnalyticsService:
    def get_notification_stats(self, days=30):
        """
        Get notification statistics for the last N days
        """
        since = timezone.now() - timedelta(days=days)
        
        stats = PushNotification.objects.filter(
            created_at__gte=since
        ).aggregate(
            total_sent=Count('id', filter=Q(status='sent')),
            total_failed=Count('id', filter=Q(status='failed')),
            total_pending=Count('id', filter=Q(status='pending')),
        )
        
        # Calculate delivery rate
        total = stats['total_sent'] + stats['total_failed']
        delivery_rate = (stats['total_sent'] / total * 100) if total > 0 else 0
        
        return {
            **stats,
            'delivery_rate': round(delivery_rate, 2),
            'period_days': days
        }
    
    def get_engagement_stats(self, days=30):
        """
        Get engagement statistics
        """
        since = timezone.now() - timedelta(days=days)
        
        engagement = NotificationAnalytics.objects.filter(
            timestamp__gte=since
        ).values('action_type').annotate(
            count=Count('id')
        )
        
        return {item['action_type']: item['count'] for item in engagement}
    
    def get_notification_type_stats(self, days=30):
        """
        Get statistics by notification type
        """
        since = timezone.now() - timedelta(days=days)
        
        type_stats = PushNotification.objects.filter(
            created_at__gte=since,
            template__isnull=False
        ).values('template__type').annotate(
            total=Count('id'),
            sent=Count('id', filter=Q(status='sent')),
            failed=Count('id', filter=Q(status='failed'))
        )
        
        return list(type_stats)
```

## 🔧 **Settings Configuration**

### **1. Django Settings**
```python
# settings/base.py

# Push Notifications
VAPID_CONTACT_EMAIL = 'admin@studioflow.com'
VAPID_PRIVATE_KEY = os.getenv('VAPID_PRIVATE_KEY')
VAPID_PUBLIC_KEY = os.getenv('VAPID_PUBLIC_KEY')

# Celery Configuration for Background Tasks
CELERY_BEAT_SCHEDULE = {
    'send-scheduled-notifications': {
        'task': 'apps.push_notifications.tasks.send_scheduled_notifications',
        'schedule': 60.0,  # Every minute
    },
    'cleanup-expired-subscriptions': {
        'task': 'apps.push_notifications.tasks.cleanup_expired_subscriptions',
        'schedule': 3600.0,  # Every hour
    },
    'retry-failed-notifications': {
        'task': 'apps.push_notifications.tasks.retry_failed_notifications',
        'schedule': 300.0,  # Every 5 minutes
    },
    'send-booking-reminders': {
        'task': 'apps.push_notifications.tasks.send_booking_reminder_notifications',
        'schedule': 300.0,  # Every 5 minutes
    },
}

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'push_notifications': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/push_notifications.log',
        },
    },
    'loggers': {
        'apps.push_notifications': {
            'handlers': ['push_notifications'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

## 🧪 **Testing Framework**

### **1. Unit Tests**
```python
# apps/push_notifications/tests/test_services.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock
from ..models import PushSubscription
from ..services import PushNotificationService

User = get_user_model()

class PushNotificationServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com'
        )
        
        self.subscription = PushSubscription.objects.create(
            user=self.user,
            endpoint='https://fcm.googleapis.com/fcm/send/test',
            p256dh_key='test_p256dh_key',
            auth_key='test_auth_key',
            preferences={
                'enabled': True,
                'booking_confirmations': True
            }
        )
        
        self.service = PushNotificationService()
    
    @patch('apps.push_notifications.services.webpush')
    def test_send_notification_success(self, mock_webpush):
        """Test successful notification sending"""
        mock_webpush.return_value = MagicMock()
        
        result = self.service.send_notification(
            subscription=self.subscription,
            title='Test Notification',
            body='Test body',
            data={'test': 'data'}
        )
        
        self.assertTrue(result['success'])
        self.assertIn('notification_id', result)
        mock_webpush.assert_called_once()
    
    def test_should_send_notification_preferences(self):
        """Test notification preference checking"""
        # Test enabled notification
        should_send = self.service._should_send_notification(
            self.subscription, 
            'booking_confirmation'
        )
        self.assertTrue(should_send)
        
        # Test disabled notification type
        self.subscription.preferences['booking_confirmations'] = False
        self.subscription.save()
        
        should_send = self.service._should_send_notification(
            self.subscription, 
            'booking_confirmation'
        )
        self.assertFalse(should_send)
    
    def test_quiet_hours_checking(self):
        """Test quiet hours functionality"""
        from datetime import time
        
        # Set quiet hours from 22:00 to 08:00
        preferences = {
            'quiet_hours': {
                'enabled': True,
                'start': '22:00',
                'end': '08:00'
            }
        }
        
        # Test during quiet hours (23:00)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value.time.return_value = time(23, 0)
            is_quiet = self.service._is_in_quiet_hours(preferences)
            self.assertTrue(is_quiet)
        
        # Test outside quiet hours (12:00)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value.time.return_value = time(12, 0)
            is_quiet = self.service._is_in_quiet_hours(preferences)
            self.assertFalse(is_quiet)
```

## 📚 **API Documentation**

### **1. OpenAPI Schema**
```yaml
# api_docs/push_notifications.yaml
openapi: 3.0.0
info:
  title: StudioFlow Push Notifications API
  version: 1.0.0
  description: Backend API for push notification management

paths:
  /api/v1/push/subscribe:
    post:
      summary: Create or update push subscription
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                subscription:
                  type: object
                  properties:
                    endpoint:
                      type: string
                    keys:
                      type: object
                      properties:
                        p256dh:
                          type: string
                        auth:
                          type: string
                    expirationTime:
                      type: integer
                      nullable: true
                preferences:
                  type: object
                  properties:
                    enabled:
                      type: boolean
                    booking_confirmations:
                      type: boolean
                    booking_reminders:
                      type: boolean
                    new_booking_requests:
                      type: boolean
                    system_updates:
                      type: boolean
                    marketing_messages:
                      type: boolean
                    quiet_hours:
                      type: object
                      properties:
                        enabled:
                          type: boolean
                        start:
                          type: string
                        end:
                          type: string
                    sound_enabled:
                      type: boolean
                    vibration_enabled:
                      type: boolean
      responses:
        201:
          description: Subscription created successfully
        400:
          description: Invalid request data

  /api/v1/push/unsubscribe:
    post:
      summary: Remove push subscription
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                endpoint:
                  type: string
      responses:
        200:
          description: Subscription removed successfully
        404:
          description: Subscription not found

  /api/v1/push/preferences:
    put:
      summary: Update notification preferences
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                endpoint:
                  type: string
                preferences:
                  type: object
      responses:
        200:
          description: Preferences updated successfully
        400:
          description: Invalid request data
        404:
          description: Subscription not found

  /api/v1/push/test:
    post:
      summary: Send test push notification
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                endpoint:
                  type: string
      responses:
        200:
          description: Test notification sent successfully
        404:
          description: Subscription not found
        500:
          description: Failed to send notification

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
```

## 🚀 **Deployment Guide**

### **1. Environment Variables**
```bash
# .env
VAPID_PRIVATE_KEY=your_generated_private_key
VAPID_PUBLIC_KEY=your_generated_public_key
VAPID_CONTACT_EMAIL=admin@studioflow.com

# Frontend
NEXT_PUBLIC_VAPID_KEY=your_generated_public_key
NEXT_PUBLIC_API_URL=https://api.studioflow.com
```

### **2. Installation Commands**
```bash
# Install dependencies
pip install pywebpush cryptography celery redis

# Generate VAPID keys
python manage.py generate_vapid_keys

# Run migrations
python manage.py makemigrations push_notifications
python manage.py migrate

# Create notification templates
python manage.py loaddata notification_templates.json

# Start Celery workers
celery -A studioflow worker -l info
celery -A studioflow beat -l info
```

## 📈 **Monitoring and Maintenance**

### **1. Health Checks**
```python
# apps/push_notifications/health.py
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta
from .models import PushSubscription, PushNotification

def push_notifications_health(request):
    """Health check endpoint for push notifications"""
    
    # Check recent notification success rate
    since = timezone.now() - timedelta(hours=1)
    recent_notifications = PushNotification.objects.filter(
        created_at__gte=since
    )
    
    total = recent_notifications.count()
    successful = recent_notifications.filter(status='sent').count()
    
    success_rate = (successful / total * 100) if total > 0 else 100
    
    # Check active subscriptions
    active_subscriptions = PushSubscription.objects.filter(
        is_active=True
    ).count()
    
    status = 'healthy' if success_rate >= 90 else 'degraded'
    
    return JsonResponse({
        'status': status,
        'success_rate': round(success_rate, 2),
        'active_subscriptions': active_subscriptions,
        'recent_notifications': total,
        'timestamp': timezone.now().isoformat()
    })
```

---

## ✅ **Implementation Checklist**

- [x] **Django Models**: PushSubscription, NotificationTemplate, PushNotification, NotificationAnalytics
- [x] **VAPID Keys**: Generation, configuration, and management
- [x] **API Endpoints**: Subscribe, unsubscribe, preferences, test notifications
- [x] **Push Service**: Core notification sending with retry logic
- [x] **Background Tasks**: Celery tasks for async processing
- [x] **Analytics**: Comprehensive notification tracking and reporting
- [x] **Testing**: Unit tests and integration tests
- [x] **Documentation**: API docs and deployment guide
- [x] **Monitoring**: Health checks and logging

This specification provides a complete backend implementation for push notifications that integrates seamlessly with the frontend infrastructure created in Task 3.1.