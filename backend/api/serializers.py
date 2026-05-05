from rest_framework import serializers
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'full_name', 'email', 'mobile']
        extra_kwargs = {
            'email': {'required': True},
            'mobile': {'required': True},
        }


class UserStep2Serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['state', 'district', 'city', 'pincode', 'gender']


class UserStep3Serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['category', 'organization', 'organization_address', 
                  'project_investigator_name', 'project_investigator_designation']


class UserStep4Serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['partner_organization', 'partner_address', 
                  'partner_investigator_name', 'partner_investigator_email', 
                  'partner_investigator_mobile']


class UserStep5Serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['proposal_title', 'problem_statement', 'additional_info']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 'full_name', 'email', 'mobile', 'state', 'district', 'city', 
            'pincode', 'gender', 'team_name', 'team_members', 'registration_step', 
            'role', 'dashboard_access',
            'created_at', 'category', 'organization', 'organization_address', 
            'project_investigator_name', 'project_investigator_designation', 
            'partner_organization', 'partner_address', 'partner_investigator_name', 
            'partner_investigator_email', 'partner_investigator_mobile', 'proposal_title', 
            'problem_statement', 'additional_info'
        ]
        read_only_fields = ['username', 'created_at']


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'full_name', 'email', 'mobile', 'state', 'district', 'city', 'pincode', 
            'gender', 'category', 'organization', 'organization_address', 
            'project_investigator_name', 'project_investigator_designation', 
            'partner_organization', 'partner_address', 'partner_investigator_name', 
            'partner_investigator_email', 'partner_investigator_mobile', 'proposal_title', 
            'problem_statement', 'additional_info', 'registration_step', 'role'
        ]


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'full_name', 'email', 'mobile', 'dashboard_access', 'created_at']
        read_only_fields = ['username', 'created_at']


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role', 'dashboard_access', 'registration_step']
