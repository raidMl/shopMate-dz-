# Admin Setup System - Quick Start Guide

## 🚀 How to Use

### **Step 1: Admin Creates Account**
```
1. Navigate to: /client/html/createAdmin.html
2. Fill in the form:
   ✓ Name
   ✓ Email
   ✓ Password (8+ chars, needs upper, lower, number)
   ✓ Site Name
   ✓ Phone
   ✓ Wilaya (from dropdown)
3. Check the terms checkbox
4. Click "إنشاء الحساب"
5. Account created → Automatically redirected to setup page
```

### **Step 2: Configure Store**
```
After redirect, you'll see SetupInfoGen.html with:

Left Sidebar: 6 sections to complete
- 📋 Basic Info
- 📍 Address & Location
- 📱 Social Media
- 🚚 Shipping
- 💳 Payment Methods
- 📜 Policies

Top: Progress bar showing 0-100%

Main Area: Form for current section
```

### **Step 3: Complete Each Section**

#### Basic Information
- Store name, email, phone
- Logo URL + preview
- Domain & description
- **Click: Save and Continue**

#### Address & Location
- Full address
- City, Wilaya, Postal code
- **Click: Save and Continue**

#### Social Media
- Facebook, Instagram, TikTok
- Twitter, WhatsApp, YouTube
- (Leave blank if not using)
- **Click: Save and Continue**

#### Shipping Configuration
- ☑️ Enable home delivery (domicile)
- ☑️ Enable office pickup (bureau)
- Free shipping threshold amount
- Default delivery days
- **Click: Save and Continue**

#### Payment Methods
- ☑️ Cash on delivery (COD)
- ☑️ Bank transfer
- ☑️ Edahab mobile
- **Click: Save and Continue**

#### Store Policies
- Return period (days)
- Warranty policy
- Terms & Conditions
- **Click: Complete Setup**

### **Step 4: Setup Complete**
```
✅ All sections marked complete
✅ Progress bar at 100%
🎉 "Setup Complete" message
→ Link to Dashboard
```

---

## 📊 Progress Bar

| Progress | What's Done |
|----------|-----------|
| 0% | Initial state |
| 20% | Account created
| 40% | Basic info saved |
| 50% | Address saved |
| 65% | Social media saved |
| 80% | Shipping saved |
| 95% | Payment methods saved |
| 100% | All sections complete |

---

## ⚡ Features

### Can Skip Any Section
- Click "تخطي" (Skip) button
- Go to next section
- Come back later to fill it

### Edit Anytime
- After initial setup, click any section in sidebar
- Modify fields
- Click "Save" to update

### Check Progress
- Progress bar updates in real-time
- Setup % shows in header
- Completed sections marked with ✓

### Auto-Save
- Each section saves independently
- No need to save everything at once
- Can exit and return later

---

## 🔒 Security

✅ **JWT Token** - Securely stored
✅ **Admin Only** - Regular users can't access
✅ **Data Ownership** - Can only edit your own config
✅ **Validation** - All inputs checked

---

## 💾 What Gets Saved

All data stored in MongoDB:

```javascript
✓ Site name
✓ Contact info (email, phone)
✓ Logo URL
✓ Domain
✓ Description
✓ Address & location
✓ All social media links
✓ Shipping preferences
✓ Payment methods available
✓ Policies (returns, warranty, T&C)
✓ Setup progress %
✓ Completion status
✓ Last modified timestamp
```

---

## 🐛 Troubleshooting

**"Account creation failed"**
- Check email isn't already registered
- Password must be 8+ characters
- All fields required

**"Redirected back to login"**
- Token might have expired
- Clear browser cache and login again
- Check localStorage has token (F12 → Application)

**"Setup page shows empty"**
- Token might be invalid
- Try refreshing page
- If still empty, create new account

**"Save button not working"**
- Check internet connection
- Browser console for errors (F12)
- Try with smaller amount of text

---

## 📱 Mobile Support

✓ Fully responsive
✓ Touch-friendly buttons
✓ Optimized for small screens
✓ Sidebar converts to dropdown on mobile

---

## 🔄 Next Steps After Setup

After completing setup:

1. **Access Dashboard**
   - Click "الذهاب إلى لوحة التحكم"
   - Manage products, orders, customers

2. **Edit Configuration**
   - Return to setup anytime
   - Update store info, add products
   - Change payment methods

3. **View Orders**
   - See new customer orders
   - Track delivery status
   - Process payments

4. **Add Products**
   - Create product listings
   - Set prices, images, descriptions
   - Manage inventory

---

## 🎨 Form Tips

**Logo URL**
- Use direct image URL
- Supported: JPG, PNG, GIF
- Preview shows before saving

**Phone Number**
- Format: 213XXXXXXXXX (11 digits)
- Works with or without country code

**Wilaya Selection**
- Choose from 58 option list
- Your store location
- Used for delivery calculations

**Social Media**
- Leave blank if not using
- Full URL required (https://...)
- Example: https://facebook.com/yourpage

**Text Areas**
- Write detailed policies
- Use line breaks for readability
- No character limit

---

## ⏱️ Estimated Time

Total setup time: **10-15 minutes**
- Account creation: 1 min
- Basic info: 2 min
- Address: 1 min
- Social media: 2 min
- Shipping: 1 min
- Payment methods: 1 min
- Policies: 3 min

---

## 📞 Need Help?

Still have questions? Check:
- ADMIN_SETUP_SYSTEM.md for technical details
- Backend API documentation
- Database schema reference

---

**Status: Ready to Go! 🚀**
