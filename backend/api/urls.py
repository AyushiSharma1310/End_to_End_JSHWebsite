from django.urls import path
from . import views

urlpatterns = [
    # Health check
    path('', views.health_check, name='health_check'),
    path('participants/', views.participants, name='participants'),
    
    # Registration endpoints
    path('register/', views.register, name='register'),
    path('update-step2/', views.update_step2, name='update_step2'),
    path('update-step2', views.update_step2, name='update_step2_no_slash'),
    path('update-step3/', views.update_step3, name='update_step3'),
    path('update-step4/', views.update_step4, name='update_step4'),
    path('update-step5/', views.update_step5, name='update_step5'),
    path('final-submit/', views.final_submit, name='final_submit'),
    
    # User endpoints
    path('user-progress/', views.user_progress, name='user_progress'),
    path('user-progress', views.user_progress, name='user_progress_no_slash'),
    path('user/profile/', views.user_profile, name='user_profile'),
    
    # Authentication endpoints
    path('login/', views.login, name='login'),
    path('send-otp/', views.send_otp, name='send_otp'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    
    # Admin endpoints
    path('create-admin/', views.create_admin, name='create_admin'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/list/', views.admin_list, name='admin_list'),
    path('admin/list', views.admin_list, name='admin_list_no_slash'),
    path('admin/participants/', views.admin_participants, name='admin_participants'),
    path('admin/participants', views.admin_participants, name='admin_participants_no_slash'),
    path('admin/grant-dashboard-access/', views.grant_dashboard_access, name='grant_dashboard_access'),
    path('admin/grant-dashboard-access', views.grant_dashboard_access, name='grant_dashboard_access_no_slash'),
    path('admin/revoke-dashboard-access/', views.revoke_dashboard_access, name='revoke_dashboard_access'),
    path('admin/revoke-dashboard-access', views.revoke_dashboard_access, name='revoke_dashboard_access_no_slash'),
    path('owner/users/', views.owner_users, name='owner_users'),
    path('owner/users', views.owner_users, name='owner_users_no_slash'),
    path('owner/grant-admin/', views.owner_grant_admin, name='owner_grant_admin'),
    path('owner/grant-admin', views.owner_grant_admin, name='owner_grant_admin_no_slash'),
    path('owner/revoke-admin/', views.owner_revoke_admin, name='owner_revoke_admin'),
    path('owner/revoke-admin', views.owner_revoke_admin, name='owner_revoke_admin_no_slash'),
]
