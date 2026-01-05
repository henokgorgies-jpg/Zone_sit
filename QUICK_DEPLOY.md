# 🚀 Quick cPanel Deployment Guide

## ✅ Your deployment package is ready!

**File:** `cpanel-deployment.zip` (2.8 MB)
**Location:** Project root folder

---

## 📤 Upload to cPanel (3 Easy Steps)

### Method 1: Upload ZIP File (Recommended - Fastest)

1. **Login to cPanel**
   - Go to your hosting cPanel URL
   - Enter your credentials

2. **Upload the ZIP**
   - Click "File Manager"
   - Navigate to `public_html` (or your domain folder)
   - Click "Upload" button
   - Select `cpanel-deployment.zip`
   - Wait for upload to complete

3. **Extract Files**
   - Right-click on `cpanel-deployment.zip`
   - Select "Extract"
   - Choose "Extract Files"
   - Delete the ZIP file after extraction

### Method 2: FTP Upload (Alternative)

1. **Connect via FTP**
   - Use FileZilla or any FTP client
   - Host: your-domain.com
   - Username: your cPanel username
   - Password: your cPanel password
   - Port: 21

2. **Upload Files**
   - Navigate to `public_html` on server
   - Upload ALL contents from the `dist` folder
   - Make sure `.htaccess` is uploaded too

---

## 🧪 Test Your Site

After uploading, visit your domain:
- `https://yourdomain.com`

### What to Check:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ All pages are accessible
- ✅ Images and assets load
- ✅ Supabase features work (login, data fetching, etc.)

---

## 🔧 Common Issues & Fixes

### Issue: Blank Page
**Fix:** Check if `.htaccess` was uploaded. Enable mod_rewrite in cPanel.

### Issue: 404 on Page Refresh
**Fix:** Verify `.htaccess` is in the root of `public_html`

### Issue: Assets Not Loading
**Fix:** 
- Check file permissions (644 for files, 755 for folders)
- Clear browser cache (Ctrl + Shift + R)

### Issue: Supabase Not Working
**Fix:**
- Verify Supabase project is active
- Check your Supabase credentials in `.env`
- Rebuild: `npm run build`
- Re-upload

---

## 🔄 How to Update Your Site

When you make changes:

```bash
# 1. Make your changes
# 2. Build for production
npm run build

# 3. Create new deployment package
Copy-Item .htaccess -Destination dist\.htaccess -Force
Compress-Archive -Path "dist\*" -DestinationPath "cpanel-deployment.zip" -Force

# 4. Upload to cPanel and extract
```

---

## 📁 What's Included in the Package?

Your deployment package contains:
- ✅ `index.html` - Main HTML file
- ✅ `.htaccess` - Server configuration
- ✅ `assets/` - Optimized JS and CSS files
- ✅ `images/` - Image assets
- ✅ `favicon.ico` - Site icon
- ✅ `robots.txt` - SEO file

---

## 🔐 Security Notes

- ✅ `.env` file is NOT included (it's only for local development)
- ✅ Your Supabase keys are compiled into the build
- ✅ Make sure to enable Row Level Security (RLS) in Supabase
- ✅ Install SSL certificate in cPanel (Let's Encrypt is free)

---

## 📖 Need More Help?

See the detailed guide: `CPANEL_DEPLOYMENT.md`

---

**Ready to deploy? Upload `cpanel-deployment.zip` to your cPanel now! 🎉**
