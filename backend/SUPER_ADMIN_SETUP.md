# Super Admin & Multi-Admin Setup Guide

## 📋 Overview

Your system now has a complete role-based admin management system with:
- ✅ **Super Admin**: Full control over all admins, themes, and statistics
- ✅ **Regular Admins**: Manage individual sites with assigned permissions
- ✅ **Admin Status Control**: Activate/Suspend/Deactivate admins
- ✅ **Site Assignment**: Each admin manages their assigned site
- ✅ **Statistics Dashboard**: Super admin can view all admin statistics

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Run the Seed Script

```bash
cd backend
node seeds/seedAdmins.js
```

**Expected Output:**
```
✅ MongoDB connected
🌱 Starting admin seed...

✅ Created super_admin: Super Admin (raidreus.22@mail.com)
✅ Created admin: Admin - Site 1 (admin1@example.com)
✅ Created admin: Admin - Site 2 (admin2@example.com)
✅ Created admin: Admin - Site 3 (admin3@example.com)

🎉 Admin seed completed successfully!

📋 Created Admins:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPER ADMIN:
  📧 Email: raidreus.22@mail.com
  🔐 Password: raid2016
  🎯 Role: super_admin (Full access)
  📍 Site: All sites
  ✨ Can: Manage admins, theme, stats, all sites

REGULAR ADMINS:
  📧 Email: admin1@example.com | 🔐 Password: admin123 | 📍 Site: site1.com
  📧 Email: admin2@example.com | 🔐 Password: admin456 | 📍 Site: site2.com
  📧 Email: admin3@example.com | 🔐 Password: admin789 | 📍 Site: site3.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2: Test Super Admin Login

1. Go to http://localhost:3000/login
2. Enter:
   - 📧 Email: `raidreus.22@mail.com`
   - 🔐 Password: `raid2016`
3. Click "Sign in to Dashboard"

### Step 3: Test Admin Features

1. Navigate to "Admin Management" in navbar
2. View all admins
3. Create, edit, delete admins
4. Change admin status (suspend/activate)
5. View statistics

---

## 🔐 Credentials

### Super Admin (Master Account)
```
Email:     raidreus.22@mail.com
Password:  raid2016
Role:      super_admin
Permissions: ✅ All
```

### Regular Admins
| Email | Password | Site | Status |
|-------|----------|------|--------|
| admin1@example.com | admin123 | site1.com | active |
| admin2@example.com | admin456 | site2.com | active |
| admin3@example.com | admin789 | site3.com | active |

---

## 📊 Role-Based Permissions

### Super Admin
```javascript
{
  role: "super_admin",
  permissions: {
    manageAdmins: true,    // Can create/delete/manage admins
    manageTheme: true,     // Can manage theme & settings
    viewStats: true,       // Can view all statistics
    manageSite: true       // Can manage all sites
  }
}
```

### Regular Admin
```javascript
{
  role: "admin",
  site: "site1.com",       // Assigned site
  permissions: {
    manageAdmins: false,   // Cannot manage other admins
    manageTheme: true,     // Can manage their site's theme
    viewStats: true,       // Can view their site's stats
    manageSite: true       // Can manage their assigned site
  }
}
```

### Regular User
```javascript
{
  role: "user",            // Cannot login to admin panel
}
```

---

## 🎯 Admin Operations

### Create New Admin
**Endpoint:** `POST /api/users/admins`
**Auth:** Super Admin Required

```bash
curl -X POST http://localhost:5000/api/users/admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "securepass123",
    "site": "site4.com",
    "role": "admin"
  }'
```

### List All Admins
**Endpoint:** `GET /api/users/admins`
**Auth:** Super Admin Required

```bash
curl http://localhost:5000/api/users/admins \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN"
```

### Update Admin
**Endpoint:** `PUT /api/users/admins/:id`
**Auth:** Super Admin Required

```bash
curl -X PUT http://localhost:5000/api/users/admins/ADMIN_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com",
    "site": "site4.com"
  }'
```

### Suspend Admin
**Endpoint:** `PATCH /api/users/admins/:id/status`
**Auth:** Super Admin Required

```bash
curl -X PATCH http://localhost:5000/api/users/admins/ADMIN_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN" \
  -d '{ "status": "suspended" }'
```

**Status Options:**
- `"active"` - Admin can login
- `"inactive"` - Admin account disabled
- `"suspended"` - Admin account temporarily suspended

### Delete Admin
**Endpoint:** `DELETE /api/users/admins/:id`
**Auth:** Super Admin Required

```bash
curl -X DELETE http://localhost:5000/api/users/admins/ADMIN_ID \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN"
```

### Change Password
**Endpoint:** `PUT /api/users/admins/:id/password`

```bash
curl -X PUT http://localhost:5000/api/users/admins/ADMIN_ID/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "currentPassword": "oldpass",
    "newPassword": "newpass"
  }'
```

### Get Statistics
**Endpoint:** `GET /api/users/stats/admin`
**Auth:** Super Admin Required

```bash
curl http://localhost:5000/api/users/stats/admin \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN"
```

**Response:**
```json
{
  "totalAdmins": 3,
  "totalSuperAdmins": 1,
  "activeAdmins": 4,
  "suspendedAdmins": 0,
  "totalAdminAccounts": 4,
  "lastUpdated": "2026-04-27T10:00:00.000Z"
}
```

---

## 🔧 Database Schema Changes

### User Model Updated

```javascript
{
  name: String,              // Admin name
  email: String,             // Unique email
  password: String,          // Hashed password
  
  // Role-based access
  role: String,              // "user", "admin", "super_admin"
  status: String,            // "active", "inactive", "suspended"
  site: String,              // Assigned site (null for super admin)
  
  // Granular permissions
  permissions: {
    manageAdmins: Boolean,   // Can manage other admins
    manageTheme: Boolean,    // Can manage theme
    viewStats: Boolean,      // Can view statistics
    manageSite: Boolean      // Can manage site content
  },
  
  createdAt: Date,
  lastLogin: Date
}
```

---

## 📁 Files Modified/Created

### Created Files
```
backend/
├── seeds/
│   └── seedAdmins.js               ← Admin seed script
└── src/
    ├── controllers/
    │   └── adminController.js      ← Admin management logic
    └── routes/
        └── adminRoutes.js          ← Admin API routes (optional)
```

### Modified Files
```
backend/
├── src/
│   ├── models/
│   │   └── index.js                ← Updated User schema
│   ├── middleware/
│   │   └── auth.js                 ← Added role/permission checks
│   ├── controllers/
│   │   └── adminController.js      ← Updated
│   └── routes/
│       └── auth.Routes.js          ← Updated with admin routes
└── index.js                         ← Uses new routes
```

---

## ✅ Testing Checklist

### Super Admin Features
- [ ] Login as super admin
- [ ] View all admins in dashboard
- [ ] Create new admin
- [ ] Edit admin information
- [ ] Suspend admin (admin cannot login)
- [ ] Activate admin (admin can login)
- [ ] Delete admin
- [ ] View admin statistics
- [ ] Change other admin's password

### Regular Admin Features
- [ ] Login with regular admin credentials
- [ ] View own profile
- [ ] Cannot view other admins
- [ ] Cannot manage admins
- [ ] Can manage assigned site
- [ ] Can change own password
- [ ] Cannot delete own account

### Error Handling
- [ ] Super admin cannot suspend own account
- [ ] Super admin cannot delete own account
- [ ] Regular admin cannot access admin management
- [ ] Cannot create duplicate email accounts
- [ ] Suspended admin cannot login

---

## 🔒 Security Features

✅ **Password Hashing**: bcryptjs with 10 salt rounds
✅ **JWT Authentication**: 7-day expiration tokens
✅ **Role-Based Access Control**: Super admin only operations
✅ **Status Management**: Suspend inactive admins
✅ **Permission Checking**: Granular permission system
✅ **Self-Protection**: Cannot suspend/delete own account
✅ **Last Login Tracking**: Monitor admin activity

---

## 🚨 Important Notes

### First Time Setup
1. Run seed script to create initial admins
2. Use super admin credentials to login
3. Create additional admins as needed
4. Assign sites to regular admins

### Production Deployment
1. Change default admin passwords
2. Use strong, unique passwords
3. Store JWT_SECRET securely in .env
4. Enable HTTPS for all API calls
5. Set proper CORS origins
6. Use environment variables for sensitive data

### Troubleshooting

**Seed script fails:**
- Check MongoDB connection
- Verify MONGODB_URI in .env
- Ensure bcryptjs is installed

**Cannot login:**
- Verify email matches exactly
- Check password is correct
- Verify role is "admin" or "super_admin"
- Check status is not "suspended"

**Admin routes not working:**
- Verify token is included in header
- Check Authorization header format: `Bearer TOKEN`
- Verify user role is "super_admin"
- Check user status is "active"

---

## 📖 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/users/login | - | Admin login |
| POST | /api/users/register | - | User registration |
| GET | /api/users/admins | Super Admin | List all admins |
| POST | /api/users/admins | Super Admin | Create admin |
| GET | /api/users/admins/:id | Super Admin | Get admin details |
| PUT | /api/users/admins/:id | Super Admin | Update admin |
| DELETE | /api/users/admins/:id | Super Admin | Delete admin |
| PATCH | /api/users/admins/:id/status | Super Admin | Change status |
| PUT | /api/users/admins/:id/password | Admin/Super | Change password |
| GET | /api/users/stats/admin | Super Admin | Get statistics |

---

## 🎉 You're All Set!

Your system now has:
✅ Super admin with full control
✅ Regular admins for site management
✅ Role-based access control
✅ Admin status management
✅ Statistics tracking
✅ Secure authentication

**Next Steps:**
1. Run the seed script
2. Login with super admin credentials
3. Start managing admins via the frontend
4. Customize admin accounts as needed

---

**Questions?** Check the backend API documentation or review the controller code in `adminController.js`.
