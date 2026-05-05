from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'full_name', 'email', 'role', 'registration_step', 'created_at']
    list_filter = ['role', 'registration_step', 'created_at']
    search_fields = ['username', 'full_name', 'email']
    readonly_fields = ['username', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('username', 'email', 'full_name', 'mobile', 'password')
        }),
        ('Location & Demographics', {
            'fields': ('state', 'district', 'city', 'pincode', 'gender')
        }),
        ('Project Details', {
            'fields': ('category', 'organization', 'organization_address', 
                      'project_investigator_name', 'project_investigator_designation')
        }),
        ('Partner Details', {
            'fields': ('partner_organization', 'partner_address', 
                      'partner_investigator_name', 'partner_investigator_email', 
                      'partner_investigator_mobile')
        }),
        ('Proposal', {
            'fields': ('proposal_title', 'problem_statement', 'additional_info')
        }),
        ('Team Info', {
            'fields': ('team_name', 'team_members')
        }),
        ('Status & Permissions', {
            'fields': ('registration_step', 'role', 'dashboard_access', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
