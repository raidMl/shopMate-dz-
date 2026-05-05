# 🚀 Super Admin Quick Reference

## Instant Setup

```bash
cd backend
npm install bcryptjs mongoose dotenv  # If needed
node seeds/seedAdmins.js
```

## Login Credentials

### Super Admin (You)
```
📧 Email:     raidreus.22@mail.com
🔐 Password:  raid2016
🎯 Access:    Full control + all features
```

### Pre-Created Regular Admins
```
Email: admin1@example.com | Pass: admin123 | Site: site1.com
Email: admin2@example.com | Pass: admin456 | Site: site2.com
Email: admin3@example.com | Pass: admin789 | Site: site3.com
```

## Super Admin Powers

### ✅ What You Can Do
```
✓ Create new admin accounts
✓ Edit admin information
✓ Delete admin accounts
✓ Suspend/Activate admins
✓ Manage theme & settings
✓ View all statistics
✓ Manage all sites
✓ Change any admin's password
```

### ❌ What You Cannot Do
```
✗ Suspend your own account
✗ Delete your own account
✗ (Everything else is allowed!)
```

## Regular Admin Powers

### ✅ What They Can Do
```
✓ Manage their assigned site
✓ Manage theme for their site
✓ View their site statistics
✓ Change own password
✓ View own profile
```

### ❌ What They Cannot Do
```
✗ Manage other admins
✗ Access other sites
✗ Delete own account
✗ Suspend own account
✗ View global statistics
```

## Common Tasks

### Create New Admin
1. Login as super admin
2. Go to Admin Management
3. Click "Create New Admin"
4. Fill: Name, Email, Site, Password
5. Click Create

### Suspend Problem Admin
1. Go to Admin Management
2. Find admin in table
3. Click "Suspend" (or Edit → Change Status)
4. Admin cannot login anymore

### Activate Suspended Admin
1. Go to Admin Management
2. Find suspended admin
3. Click "Activate"
4. Admin can login again

### Delete Admin
1. Go to Admin Management
2. Find admin to delete
3. Click "Delete"
4. Confirm deletion
5. Account is removed

### View Statistics
1. Click Admin Dashboard
2. See stats cards:
   - Total Products
   - Total Categories
   - Total Orders
   - Total Revenue
   - **Total Admins** ← You
   - **Total Users** ← They

## API Endpoints (For Developers)

### Get Token
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "raidreus.22@mail.com",
    "password": "raid2016"
  }'
```

### Create Admin
```bash
curl -X POST http://localhost:5000/api/users/admins \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "secure123",
    "site": "site.com"
  }'
```

### List All Admins
```bash
curl http://localhost:5000/api/users/admins \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Suspend Admin
```bash
curl -X PATCH http://localhost:5000/api/users/admins/ADMIN_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "suspended"}'
```

### Delete Admin
```bash
curl -X DELETE http://localhost:5000/api/users/admins/ADMIN_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Admin Statuses

| Status | Meaning | Can Login? |
|--------|---------|-----------|
| `active` | Normal | ✅ Yes |
| `inactive` | Disabled | ❌ No |
| `suspended` | Temporarily blocked | ❌ No |

## File Locations

```
Backend:
  - /backend/seeds/seedAdmins.js        ← Run this first!
  - /backend/src/models/index.js        ← User schema (updated)
  - /backend/src/controllers/adminController.js
  - /backend/src/middleware/auth.js     ← Permissions
  - /backend/src/routes/auth.Routes.js  ← Admin API

Frontend:
  - /admin-ui/src/pages/AdminManagementPage.tsx
  - /admin-ui/src/services/adminService.ts
```

## Database Schema

```javascript
User {
  name: String,
  email: String,
  password: String (hashed),
  
  role: "user" | "admin" | "super_admin",
  status: "active" | "inactive" | "suspended",
  site: String | null,
  
  permissions: {
    manageAdmins: Boolean,
    manageTheme: Boolean,
    viewStats: Boolean,
    manageSite: Boolean
  },
  
  createdAt: Date,
  lastLogin: Date
}
```

## Troubleshooting

**Issue**: Seed script fails
**Fix**: 
```bash
npm install bcryptjs mongoose dotenv
node seeds/seedAdmins.js
```

**Issue**: Cannot login
**Fix**: 
- Email: `raidreus.22@mail.com` (exactly)
- Password: `raid2016` (exactly)
- Role must be "admin" or "super_admin"

**Issue**: Admin management page doesn't work
**Fix**:
- Verify super admin token in localStorage
- Check browser console for errors
- Verify API endpoint is running

**Issue**: Cannot see admin counts on dashboard
**Fix**:
- Implement `/api/users` GET endpoint
- Or check `/api/users/stats/admin` endpoint

## Security Checklist

- [ ] Run seed script once only
- [ ] Change default admin passwords
- [ ] Use strong passwords for production
- [ ] Set JWT_SECRET in .env
- [ ] Enable HTTPS in production
- [ ] Restrict CORS origins in production
- [ ] Monitor suspicious login attempts
- [ ] Regularly check admin activity
- [ ] Suspend inactive admins
- [ ] Update Node.js packages

## Next Steps

1. ✅ Run seed script → `node seeds/seedAdmins.js`
2. ✅ Login with super admin email
3. ✅ View admin management page
4. ✅ Create/edit/delete test admins
5. ✅ Test on mobile device
6. ✅ Deploy to production

## Support

For detailed setup: See `SUPER_ADMIN_SETUP.md`
For API docs: See `BACKEND_IMPLEMENTATION.md`
For frontend: See `admin-ui/ADMIN_CONFIG_GUIDE.md`

---

**You're ready to go! 🎉**

Questions? Check the setup document or contact the development team.
