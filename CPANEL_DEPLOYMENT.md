# 🚀 cPanel Deployment Guide for Govern Easy Site

## Prerequisites
- cPanel hosting account with File Manager access
- FTP/SFTP credentials (optional, for easier upload)
- Your Supabase project URL and Anon Key

---

## 📦 Step 1: Prepare Your Build

The production build has been created in the `dist` folder. This contains all the optimized files ready for deployment.

---

## 🌐 Step 2: Upload Files to cPanel

### Option A: Using cPanel File Manager (Recommended for beginners)

1. **Login to cPanel**
   - Go to your hosting provider's cPanel URL
   - Enter your credentials

2. **Navigate to File Manager**
   - Find and click "File Manager" in cPanel
   - Navigate to `public_html` folder (or your domain's root folder)

3. **Clear Existing Files (if any)**
   - Select all files in `public_html`
   - Delete them (backup first if needed)

4. **Upload Your Build**
   - Click "Upload" button
   - Select ALL files from your local `dist` folder
   - Upload the `.htaccess` file from the project root
   - Wait for upload to complete

5. **Extract (if uploaded as ZIP)**
   - Alternatively, you can ZIP the `dist` folder contents
   - Upload the ZIP file
   - Right-click and select "Extract"
   - Move extracted files to `public_html` root

### Option B: Using FTP/SFTP (Recommended for faster uploads)

1. **Use an FTP Client** (FileZilla, WinSCP, etc.)
   - Host: Your domain or server IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (FTP) or 22 (SFTP)

2. **Upload Files**
   - Navigate to `public_html` on the server
   - Upload all contents from your local `dist` folder
   - Upload the `.htaccess` file from the project root

---

## ⚙️ Step 3: Configure Environment Variables

Since this is a static site with Supabase, your environment variables are built into the JavaScript bundle. However, for security:

### Important Security Note:
Your Supabase credentials are currently in the `.env` file. Make sure:

1. **Never upload the `.env` file to the server**
2. **The credentials are already compiled into your build** (in `dist` folder)
3. **Use Row Level Security (RLS) in Supabase** to protect your data

### To Update Supabase Credentials:
If you need to change Supabase settings, update your local `.env` file and rebuild:
```bash
npm run build
```
Then re-upload the `dist` folder contents.

---

## 🔧 Step 4: Verify .htaccess Configuration

Make sure the `.htaccess` file is in the root of `public_html`. This file:
- Enables React Router to work properly
- Handles 404 redirects to index.html
- Enables GZIP compression
- Sets browser caching
- Adds security headers

---

## 🗂️ Step 5: File Structure on Server

Your `public_html` folder should look like this:

```
public_html/
├── .htaccess
├── index.html
├── vite.svg
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other asset files]
└── [other files from dist]
```

---

## ✅ Step 6: Test Your Deployment

1. **Visit your domain** (e.g., `https://yourdomain.com`)
2. **Check if the site loads correctly**
3. **Test navigation** - Click through different pages
4. **Check browser console** - Look for any errors (F12)
5. **Test Supabase connection** - Try features that use the database

---

## 🐛 Troubleshooting

### Issue: Blank page or "Cannot GET /" error
**Solution:** Make sure `.htaccess` file is uploaded and mod_rewrite is enabled in cPanel

### Issue: 404 errors on page refresh
**Solution:** Verify `.htaccess` rewrite rules are working. Contact hosting support to enable mod_rewrite

### Issue: Assets not loading (CSS/JS)
**Solution:** 
- Check file permissions (should be 644 for files, 755 for folders)
- Clear browser cache
- Check if files are in the correct location

### Issue: Supabase connection errors
**Solution:**
- Verify your Supabase project is active
- Check if your Supabase URL and Anon Key are correct in `.env`
- Rebuild the project: `npm run build`
- Re-upload the `dist` folder

### Issue: Mixed Content errors (HTTP/HTTPS)
**Solution:**
- Enable SSL certificate in cPanel (Let's Encrypt is usually free)
- Uncomment the HTTPS redirect lines in `.htaccess`

---

## 🔄 Updating Your Site

When you make changes to your code:

1. **Make your changes locally**
2. **Test locally:** `npm run dev`
3. **Build for production:** `npm run build`
4. **Upload the new `dist` folder contents** to cPanel
5. **Clear browser cache** and test

---

## 📊 Performance Optimization

### Enable GZIP Compression
Already configured in `.htaccess`

### Enable Browser Caching
Already configured in `.htaccess`

### Enable SSL/HTTPS
1. Go to cPanel → SSL/TLS Status
2. Install Let's Encrypt SSL (usually free)
3. Uncomment HTTPS redirect in `.htaccess`

### Use CDN (Optional)
Consider using Cloudflare for:
- Better performance
- DDoS protection
- Free SSL
- Caching

---

## 🔐 Security Checklist

- ✅ `.env` file is NOT uploaded to server
- ✅ `.htaccess` security headers are in place
- ✅ Supabase Row Level Security (RLS) is enabled
- ✅ SSL certificate is installed
- ✅ Directory browsing is disabled
- ✅ Sensitive files are protected

---

## 📞 Need Help?

If you encounter issues:
1. Check cPanel error logs (Error Log in cPanel)
2. Check browser console for JavaScript errors
3. Contact your hosting provider's support
4. Verify Supabase dashboard for API errors

---

## 🎉 You're Done!

Your Govern Easy Site should now be live and accessible at your domain!

**Quick Upload Checklist:**
- [ ] Build project (`npm run build`)
- [ ] Upload `dist` folder contents to `public_html`
- [ ] Upload `.htaccess` file
- [ ] Test the live site
- [ ] Verify all features work
- [ ] Enable SSL certificate

---

**Last Updated:** 2025-12-31
