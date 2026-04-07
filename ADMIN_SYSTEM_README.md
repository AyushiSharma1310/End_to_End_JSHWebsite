# Admin System Documentation

## Overview
The application now supports role-based access control with two user types:
- **Participants**: Regular users who register for the hackathon
- **Admins**: Event organizers with access to the admin dashboard

## Database Changes
- Added `role` column to the `users` table with default value 'participant'
- All new registrations are automatically assigned the 'participant' role
- Admins are created separately with the 'admin' role

## Admin Creation
To create an admin account:
1. Navigate to `/create-admin`
2. Fill out the admin creation form
3. The admin will be created with role 'admin' and registration_step 'completed'

## Admin Features
Admins have access to:
- **Dashboard Overview**: Statistics on total participants and registration progress
- **Participants Management**: View all participant details in a table format
- **Role-based Access**: Automatic redirection to admin dashboard upon login

## API Endpoints

### Admin Creation
```
POST /create-admin
Body: { full_name, email, mobile, password }
```

### Admin Dashboard Data
```
GET /admin/dashboard?username=<admin_username>
Response: { totalParticipants, registrationStats, recentRegistrations }
```

### Participants List (Admin Only)
```
GET /admin/participants?username=<admin_username>
Response: Array of all participant data
```

## Security
- All admin endpoints require the `username` parameter for authentication
- Server-side middleware `requireAdmin` validates admin role before allowing access
- Participants cannot access admin routes

## Usage
1. Create admin accounts via `/create-admin`
2. Admins login normally via `/login`
3. Upon successful login, admins are redirected to `/admin`
4. Participants continue with normal registration flow

## File Changes
- `server/index.js`: Added role column, admin endpoints, and middleware
- `client/src/pages/Login.jsx`: Updated to handle role-based redirection
- `client/src/pages/Register.jsx`: Added admin check and redirection
- `client/src/pages/AdminDashboard.jsx`: New admin dashboard page
- `client/src/pages/AdminCreation.jsx`: New admin creation page
- `client/src/App.jsx`: Added new routes