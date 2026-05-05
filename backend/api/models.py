from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'owner')
        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser):
    ROLE_CHOICES = [
        ('participant', 'Participant'),
        ('admin', 'Admin'),
        ('owner', 'Owner'),
    ]
    
    REGISTRATION_STEP_CHOICES = [
        ('1', 'Step 1'),
        ('2', 'Step 2'),
        ('3', 'Step 3'),
        ('4', 'Step 4'),
        ('5', 'Step 5'),
        ('completed', 'Completed'),
    ]

    # Basic Info
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    
    # Step 2: Location & Demographics
    state = models.CharField(max_length=255, blank=True, null=True)
    district = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    gender = models.CharField(max_length=50, blank=True, null=True)
    
    # Step 3: Project Details
    category = models.CharField(max_length=255, blank=True, null=True)
    organization = models.CharField(max_length=255, blank=True, null=True)
    organization_address = models.TextField(blank=True, null=True)
    project_investigator_name = models.CharField(max_length=255, blank=True, null=True)
    project_investigator_designation = models.CharField(max_length=255, blank=True, null=True)
    
    # Step 4: Partner Details
    partner_organization = models.CharField(max_length=255, blank=True, null=True)
    partner_address = models.TextField(blank=True, null=True)
    partner_investigator_name = models.CharField(max_length=255, blank=True, null=True)
    partner_investigator_email = models.EmailField(blank=True, null=True)
    partner_investigator_mobile = models.CharField(max_length=20, blank=True, null=True)
    
    # Step 5: Proposal Content
    proposal_title = models.CharField(max_length=500, blank=True, null=True)
    problem_statement = models.TextField(blank=True, null=True)
    additional_info = models.TextField(blank=True, null=True)
    
    # Team Info
    team_name = models.CharField(max_length=255, blank=True, null=True)
    team_members = models.TextField(blank=True, null=True)
    
    # Registration Status
    registration_step = models.CharField(max_length=20, choices=REGISTRATION_STEP_CHOICES, default='1')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='participant')
    dashboard_access = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Required Django fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.username} - {self.full_name}"
