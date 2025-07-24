from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, LogoutView

router = DefaultRouter()
router.register('', UserViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('logout/', LogoutView.as_view(), name='user-logout'),
    path('', include(router.urls)),
]