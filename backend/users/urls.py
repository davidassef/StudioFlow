from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, RegisterView, LogoutView, 
    ForgotPasswordView, ResetPasswordView
)

router = DefaultRouter()
router.register('', UserViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('logout/', LogoutView.as_view(), name='user-logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='user-forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='user-reset-password'),
    path('', include(router.urls)),
]