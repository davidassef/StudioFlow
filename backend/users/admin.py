from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User


class UserAdmin(BaseUserAdmin):
    """Define admin model for custom User model with no username field."""
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('nome', 'telefone')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'user_type', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nome', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'nome', 'telefone', 'user_type', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'user_type', 'groups')
    search_fields = ('email', 'nome', 'telefone')
    ordering = ('email',)


admin.site.register(User, UserAdmin)
