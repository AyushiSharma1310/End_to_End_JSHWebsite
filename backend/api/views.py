from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.core.cache import cache
from .models import User
from .serializers import (
    UserRegistrationSerializer, UserStep2Serializer, UserStep3Serializer,
    UserStep4Serializer, UserStep5Serializer, UserProfileSerializer,
    UserProgressSerializer, AdminSerializer, UserDetailSerializer
)
import os


def generate_username():
    """Generate a unique username based on user count"""
    count = User.objects.count() + 1
    return f"jsh26{str(count).zfill(5)}"


def verify_and_upgrade_password(user, raw_password):
    """Validate password and auto-upgrade legacy plain-text passwords."""
    if user.check_password(raw_password):
        return True
    if user.password == raw_password:
        user.set_password(raw_password)
        user.save(update_fields=['password'])
        return True
    return False


@api_view(['POST'])
def register(request):
    """Register a new user"""
    try:
        full_name = request.data.get('full_name')
        email = request.data.get('email')
        mobile = request.data.get('mobile')
        
        if not email or not mobile:
            return Response(
                {'success': False, 'message': 'Email and mobile are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'success': False, 'message': 'Email already registered. Please use a different email.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        username = generate_username()
        user = User.objects.create_user(
            username=username,
            email=email,
            full_name=full_name,
            mobile=mobile,
            registration_step='1',
            role='participant'
        )
        
        return Response({
            'success': True,
            'message': 'Registered Successfully',
            'username': username
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def update_step2(request):
    """Update Step 2: Location and Demographics"""
    try:
        username = request.data.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        raw_password = request.data.get('password')
        serializer = UserStep2Serializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save(registration_step='2')
            if raw_password:
                if len(raw_password) < 6:
                    return Response(
                        {'success': False, 'message': 'Password must be at least 6 characters'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user.set_password(raw_password)
                user.save(update_fields=['password'])
            return Response({'success': True, 'message': 'Step 2 saved'})
        
        return Response(
            {'success': False, 'message': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def update_step3(request):
    """Update Step 3: Project Details"""
    try:
        username = request.data.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        serializer = UserStep3Serializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save(registration_step='3')
            return Response({'success': True, 'message': 'Step 3 saved'})
        
        return Response(
            {'success': False, 'message': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def update_step4(request):
    """Update Step 4: Partner Details"""
    try:
        username = request.data.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        serializer = UserStep4Serializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save(registration_step='4')
            return Response({'success': True, 'message': 'Step 4 saved'})
        
        return Response(
            {'success': False, 'message': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def update_step5(request):
    """Update Step 5: Proposal Content"""
    try:
        username = request.data.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        serializer = UserStep5Serializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save(registration_step='5')
            return Response({'success': True, 'message': 'Step 5 saved'})
        
        return Response(
            {'success': False, 'message': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def final_submit(request):
    """Final submission of registration"""
    try:
        username = request.data.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        user.registration_step = 'completed'
        user.save()
        
        return Response({
            'success': True,
            'message': 'Registration complete'
        })
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def user_progress(request):
    """Get user progress"""
    try:
        username = request.query_params.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        serializer = UserProgressSerializer(user)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def user_profile(request):
    """Get user profile"""
    try:
        username = request.query_params.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        serializer = UserProfileSerializer(user)
        
        return Response({
            'success': True,
            'user': serializer.data
        })
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def send_otp(request):
    """Send OTP to user"""
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'success': False, 'message': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        
        # Check password
        if not verify_and_upgrade_password(user, password):
            return Response({
                'success': False,
                'message': 'Invalid username or password ❌'
            })
        
        import random
        otp = random.randint(100000, 999999)
        
        # Store OTP server-side by username so verify works without browser session coupling.
        cache.set(f"otp:{username}", str(otp), timeout=300)
        
        # In production, send email/SMS here
        response = {
            'success': True,
            'message': 'OTP sent'
        }
        
        # For development, return OTP
        if os.getenv('DEBUG', 'True') == 'True':
            response['otp'] = otp
        
        return Response(response)
    
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found ❌'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def verify_otp(request):
    """Verify OTP"""
    try:
        username = request.data.get('username')
        otp = request.data.get('otp')
        
        if not username or not otp:
            return Response(
                {'success': False, 'message': 'Username and OTP are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        stored_otp = cache.get(f"otp:{username}")
        
        if not stored_otp or str(stored_otp) != str(otp):
            return Response({
                'success': False,
                'message': 'Invalid OTP ❌'
            })
        
        user = get_object_or_404(User, username=username)
        serializer = UserDetailSerializer(user)

        # OTP should be single-use.
        cache.delete(f"otp:{username}")
        
        return Response({
            'success': True,
            'message': 'Login successful',
            **serializer.data
        })
    
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found ❌'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def login(request):
    """User login"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'success': False, 'message': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, email=email)
        
        if not verify_and_upgrade_password(user, password):
            return Response({
                'success': False,
                'message': 'Wrong password ❌'
            })
        
        return Response({
            'success': True,
            'message': 'Login successful ✅',
            'username': user.username
        })
    
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not registered ❌'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def create_admin(request):
    """Create a new admin user"""
    try:
        full_name = request.data.get('full_name')
        email = request.data.get('email')
        mobile = request.data.get('mobile')
        password = request.data.get('password')
        dashboard_access = request.data.get('dashboard_access', False)
        
        if not email or not password:
            return Response(
                {'success': False, 'message': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=email, role='admin').exists():
            return Response(
                {'success': False, 'message': 'Admin already exists with this email'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        username = generate_username()
        user = User.objects.create_user(
            username=username,
            email=email,
            full_name=full_name,
            mobile=mobile,
            password=password,
            role='admin',
            registration_step='completed',
            dashboard_access=dashboard_access
        )
        
        return Response({
            'success': True,
            'message': 'Admin created successfully',
            'username': username,
            'dashboard_access': dashboard_access
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def check_admin(user):
    """Check if user is admin"""
    return user.role in ['admin', 'owner']


def check_dashboard_access(user):
    """Check if user has dashboard access"""
    if user.role == 'owner':
        return True
    return user.role == 'admin' and user.dashboard_access


@api_view(['GET'])
def admin_dashboard(request):
    """Get admin dashboard data"""
    try:
        username = request.query_params.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        
        if not check_dashboard_access(user):
            return Response(
                {'success': False, 'message': 'Dashboard access not granted'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        total_participants = User.objects.filter(role='participant').count()
        registration_stats = User.objects.filter(role='participant').values('registration_step').annotate(count=Count('id'))
        recent_registrations = User.objects.filter(role='participant').order_by('-created_at')[:10]
        
        return Response({
            'success': True,
            'data': {
                'totalParticipants': total_participants,
                'registrationStats': list(registration_stats),
                'recentRegistrations': UserProfileSerializer(recent_registrations, many=True).data
            }
        })
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def admin_list(request):
    """Get admins and participants for access management"""
    try:
        username = request.query_params.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, username=username)
        
        if not check_admin(user):
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        users = User.objects.exclude(role='owner').order_by('-created_at')
        serializer = UserProfileSerializer(users, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def grant_dashboard_access(request):
    """Grant dashboard access to admin"""
    try:
        admin_username = request.data.get('admin_username')
        current_username = request.data.get('username') or request.data.get('granted_by')
        
        if not admin_username or not current_username:
            return Response(
                {'success': False, 'message': 'Admin username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        current_user = get_object_or_404(User, username=current_username)
        
        if not check_admin(current_user):
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        admin = get_object_or_404(User, username=admin_username, role='admin')
        admin.dashboard_access = True
        admin.save()
        
        return Response({
            'success': True,
            'message': f'Dashboard access granted to {admin_username}'
        })
    
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'Admin not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def revoke_dashboard_access(request):
    """Revoke dashboard access from admin"""
    try:
        admin_username = request.data.get('admin_username')
        current_username = request.data.get('username') or request.data.get('revoked_by')

        if not admin_username or not current_username:
            return Response(
                {'success': False, 'message': 'Admin username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        current_user = get_object_or_404(User, username=current_username)

        if not check_admin(current_user):
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )

        admin = get_object_or_404(User, username=admin_username, role='admin')
        admin.dashboard_access = False
        admin.save()

        return Response({
            'success': True,
            'message': f'Dashboard access revoked from {admin_username}'
        })
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def admin_participants(request):
    """Get participant/admin list for dashboard"""
    try:
        username = request.query_params.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, username=username)
        if not check_dashboard_access(user):
            return Response(
                {'success': False, 'message': 'Dashboard access not granted'},
                status=status.HTTP_403_FORBIDDEN
            )

        participants = User.objects.exclude(role='owner').order_by('-created_at')
        serializer = UserProfileSerializer(participants, many=True)
        return Response({'success': True, 'data': serializer.data})
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def owner_users(request):
    """Get all users for owner role"""
    try:
        username = request.query_params.get('username')
        if not username:
            return Response(
                {'success': False, 'message': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, username=username)
        if user.role != 'owner':
            return Response(
                {'success': False, 'message': 'Owner access required'},
                status=status.HTTP_403_FORBIDDEN
            )

        users = User.objects.all().order_by('-created_at')
        serializer = UserProfileSerializer(users, many=True)
        return Response({'success': True, 'users': serializer.data})
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def owner_grant_admin(request):
    """Grant admin role to a user"""
    try:
        username = request.data.get('username')
        target_username = request.data.get('targetUsername')

        if not username or not target_username:
            return Response(
                {'success': False, 'message': 'Username and targetUsername are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        current_user = get_object_or_404(User, username=username)
        if current_user.role != 'owner':
            return Response(
                {'success': False, 'message': 'Owner access required'},
                status=status.HTTP_403_FORBIDDEN
            )

        target_user = get_object_or_404(User, username=target_username)
        if target_user.role == 'owner':
            return Response(
                {'success': False, 'message': 'Owner role cannot be changed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        target_user.role = 'admin'
        target_user.dashboard_access = True
        target_user.save()

        return Response({
            'success': True,
            'message': f'Admin access granted to {target_username}'
        })
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def owner_revoke_admin(request):
    """Revoke admin role from a user"""
    try:
        username = request.data.get('username')
        target_username = request.data.get('targetUsername')

        if not username or not target_username:
            return Response(
                {'success': False, 'message': 'Username and targetUsername are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        current_user = get_object_or_404(User, username=username)
        if current_user.role != 'owner':
            return Response(
                {'success': False, 'message': 'Owner access required'},
                status=status.HTTP_403_FORBIDDEN
            )

        target_user = get_object_or_404(User, username=target_username)
        if target_user.role == 'owner':
            return Response(
                {'success': False, 'message': 'Owner role cannot be changed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        target_user.role = 'participant'
        target_user.dashboard_access = False
        target_user.save()

        return Response({
            'success': True,
            'message': f'Admin access revoked from {target_username}'
        })
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def participants(request):
    """Public participant list used by home page"""
    try:
        users = User.objects.filter(role='participant').order_by('-created_at')
        data = [
            {
                'id': user.id,
                'name': user.full_name or user.username,
                'email': user.email,
                'idea': user.proposal_title or 'N/A',
            }
            for user in users
        ]
        return Response(data)
    except Exception as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({'status': 'API Running 🚀'})
