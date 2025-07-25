from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom User model with email as the unique identifier."""
    
    class UserType(models.TextChoices):
        ADMIN = 'ADMIN', _('Admin')
        CLIENTE = 'CLIENTE', _('Cliente')
    
    username = None
    email = models.EmailField(_('email address'), unique=True)
    nome = models.CharField(_('nome'), max_length=150)
    telefone = models.CharField(_('telefone'), max_length=20, blank=True)
    user_type = models.CharField(
        _('tipo de usuário'),
        max_length=10,
        choices=UserType.choices,
        default=UserType.CLIENTE,
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome']
    
    objects = UserManager()
    
    def __str__(self):
        return self.email
