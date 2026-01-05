# ✅ cPanel Deployment Checklist

## Pre-Deployment
- [ ] Project builds successfully (`npm run build`)
- [ ] All features tested locally (`npm run dev`)
- [ ] Supabase credentials are correct in `.env`
- [ ] Supabase Row Level Security (RLS) is configured
- [ ] `.htaccess` file is created

## Deployment Package
- [ ] `cpanel-deployment.zip` created (2.8 MB)
- [ ] `.htaccess` included in the package
- [ ] All assets are in the package

## cPanel Setup
- [ ] Logged into cPanel
- [ ] Navigated to File Manager
- [ ] Opened `public_html` folder
- [ ] Backed up existing files (if any)
- [ ] Cleared `public_html` folder

## Upload
- [ ] Uploaded `cpanel-deployment.zip`
- [ ] Extracted the ZIP file
- [ ] Deleted the ZIP file after extraction
- [ ] Verified all files are in `public_html` root (not in a subfolder)

## File Structure Check
Your `public_html` should have:
- [ ] `index.html`
- [ ] `.htaccess`
- [ ] `assets/` folder
- [ ] `images/` folder
- [ ] `favicon.ico`
- [ ] `robots.txt`

## Testing
- [ ] Site loads at your domain
- [ ] Homepage displays correctly
- [ ] Navigation works (click different pages)
- [ ] Page refresh doesn't cause 404 errors
- [ ] Images and assets load
- [ ] CSS styling is applied
- [ ] JavaScript functionality works
- [ ] Supabase connection works
- [ ] Admin login works
- [ ] Database operations work

## Security & Performance
- [ ] SSL certificate installed (HTTPS)
- [ ] HTTPS redirect enabled in `.htaccess`
- [ ] File permissions correct (644 for files, 755 for folders)
- [ ] `.env` file NOT uploaded to server
- [ ] Supabase RLS policies are active
- [ ] Browser caching enabled (via `.htaccess`)
- [ ] GZIP compression enabled (via `.htaccess`)

## Post-Deployment
- [ ] Tested on different browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile devices
- [ ] Checked browser console for errors (F12)
- [ ] Verified all admin features work
- [ ] Verified all public pages work
- [ ] Checked cPanel error logs (if any issues)

## Optional Enhancements
- [ ] Set up Cloudflare for CDN
- [ ] Configure email forwarding in cPanel
- [ ] Set up automated backups
- [ ] Add Google Analytics (if needed)
- [ ] Submit sitemap to Google Search Console

## Troubleshooting Done (if needed)
- [ ] Cleared browser cache
- [ ] Verified mod_rewrite is enabled
- [ ] Checked file permissions
- [ ] Reviewed cPanel error logs
- [ ] Tested Supabase connection
- [ ] Contacted hosting support (if needed)

---

## 🎉 Deployment Complete!

**Site URL:** https://your-domain.com
**Deployed on:** _______________
**Version:** _______________

---

**Notes:**
_Add any deployment notes or issues encountered here_

---

**Next Update Scheduled:** _______________
