# Admin Panel Configuration & Setup Guide

## Overview

This document explains how to configure the Admin UI for creating new admins, login functionality, and enhanced dashboard features.

## What's Been Configured

### 1. **Admin Management Service** (`/src/services/adminService.ts`)

A complete service layer for managing admin users with the following operations:
- **getAllAdmins()** - Fetch all admin users
- **getAdminById(id)** - Get specific admin details
- **createAdmin(adminData)** - Create new admin user
- **updateAdmin(id, data)** - Update admin information
- **deleteAdmin(id)** - Remove admin user
- **changePassword(id, oldPass, newPass)** - Change admin password

### 2. **Admin Management Page** (`/src/pages/AdminManagementPage.tsx`)

A full-featured admin management interface with:
- ✅ View all admins in a table
- ✅ Create new admin users with name, email, and password
- ✅ Edit existing admin information
- ✅ Delete admin users with confirmation
- ✅ Real-time form validation
- ✅ Error handling and user feedback
- ✅ Responsive design for mobile/tablet/desktop

### 3. **Enhanced API Integration** (`/src/services/api.ts`)

New `usersAPI` object with endpoints for:
```typescript
usersAPI.getAllAdmins()
usersAPI.getAdminById(id)
usersAPI.createAdmin(adminData)
usersAPI.updateAdmin(id, data)
usersAPI.deleteAdmin(id)
usersAPI.changeAdminPassword(id, data)
usersAPI.getAllUsers()
```

### 4. **Enhanced Dashboard** (`/src/pages/Dashboard.tsx`)

Dashboard now displays 6 key metrics:
- 📦 Total Products
- 📂 Total Categories
- 📋 Total Orders
- 💰 Total Revenue (in DA)
- 👨‍💼 Total Admins
- 👥 Total Users

Plus existing features:
- Monthly revenue chart
- Order completion rate
- Recent orders table

### 5. **Navigation Updates** (`/src/components/common/Navbar.tsx`)

Added "Admin Management" link to main navigation menu, accessible from:
- Desktop navigation bar
- Mobile menu

### 6. **Multilingual Support** (i18n)

Translations added for English, Arabic, and French:
- Admin management labels
- Form field names
- Action buttons
- Error messages

## Backend Setup Required

The Admin UI expects the following backend endpoints. These need to be implemented in your backend:

### Required Endpoints

#### 1. **Create Admin**
```
POST /api/users/admins
Headers: Authorization: Bearer {token}
Body: {
  name: string,
  email: string,
  password: string,
  role: "admin"
}
Response: {
  _id: string,
  name: string,
  email: string,
  role: string,
  createdAt: timestamp
}
```

#### 2. **Get All Admins**
```
GET /api/users/admins
Headers: Authorization: Bearer {token}
Response: [
  {
    _id: string,
    name: string,
    email: string,
    role: string,
    createdAt: timestamp
  }
]
```

#### 3. **Get Admin by ID**
```
GET /api/users/admins/:id
Headers: Authorization: Bearer {token}
Response: {...admin details...}
```

#### 4. **Update Admin**
```
PUT /api/users/admins/:id
Headers: Authorization: Bearer {token}
Body: {
  name?: string,
  email?: string
}
Response: {...updated admin...}
```

#### 5. **Delete Admin**
```
DELETE /api/users/admins/:id
Headers: Authorization: Bearer {token}
Response: {success: true}
```

#### 6. **Change Password**
```
PUT /api/users/admins/:id/password
Headers: Authorization: Bearer {token}
Body: {
  currentPassword: string,
  newPassword: string
}
Response: {message: "Password changed successfully"}
```

#### 7. **Get All Users** (for dashboard count)
```
GET /api/users
Headers: Authorization: Bearer {token}
Response: [
  {
    _id: string,
    name: string,
    email: string,
    role: "user" | "admin",
    createdAt: timestamp
  }
]
```

## Login Configuration

The existing login system:
1. User enters email and password on `/login` page
2. POST to `http://localhost:5000/api/users/login` (or your API_URL)
3. Backend validates credentials and returns:
```json
{
  _id: string,
  name: string,
  email: string,
  role: string (must be "admin"),
  token: JWT_token
}
```
4. Token is stored in localStorage and used for authenticated requests

## Environment Variables

Create/update `.env` file in admin-ui directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## How to Use

### Creating a New Admin

1. Navigate to **Admin Management** from the main menu
2. Click **"Create New Admin"** button
3. Fill in:
   - Admin Name
   - Email address
   - Strong password
4. Click **"Create Admin"**
5. New admin can now login with their credentials

### Admin Login

1. Go to login page (`/login`)
2. Enter admin email and password
3. System validates role is "admin"
4. Redirects to `/dashboard` on success

### Dashboard Access

Once logged in, admin can:
- View all 6 dashboard metrics
- Access products, categories, orders management
- Manage other admins (create, edit, delete)
- Change language (EN, AR, FR)
- Logout

## File Structure

```
admin-ui/src/
├── pages/
│   ├── AdminManagementPage.tsx      [NEW]
│   ├── Dashboard.tsx                [UPDATED]
│   └── ...
├── services/
│   ├── adminService.ts              [NEW]
│   ├── api.ts                       [UPDATED]
│   └── ...
├── components/
│   └── common/
│       └── Navbar.tsx               [UPDATED]
├── i18n/
│   └── locales/
│       ├── en.json                  [UPDATED]
│       ├── ar.json                  [UPDATED]
│       └── fr.json                  [UPDATED]
├── App.tsx                          [UPDATED]
└── ...
```

## Testing Checklist

- [ ] Create admin account via Admin Management page
- [ ] Login with new admin credentials
- [ ] Verify dashboard loads with all 6 metrics
- [ ] Edit admin information
- [ ] Delete admin account
- [ ] Verify multilingual support (EN, AR, FR)
- [ ] Test on mobile/tablet/desktop
- [ ] Verify protected routes (logout redirects to login)

## Troubleshooting

### Admin Creation Fails
- Verify backend `/api/users/admins` POST endpoint is implemented
- Check email doesn't already exist
- Verify Authorization header is being sent with token

### Dashboard Not Showing Admins Count
- Ensure `/api/users` endpoint returns all users
- Check network tab to see API response
- Verify user filtering is working (role field)

### Login Not Working
- Check API_URL environment variable
- Verify backend returns token in response
- Check role is "admin" in response

### Navigation Link Not Appearing
- Clear browser cache
- Rebuild React app
- Verify Navbar.tsx changes were saved

## Next Steps

1. Implement backend endpoints (see Backend Setup Required section)
2. Test with sample admin user
3. Customize styles/colors in tailwind.config.js if needed
4. Deploy to production

## Support

For issues or questions, check:
1. Browser console for error messages
2. Network tab for API request/response details
3. Backend logs for server-side errors
