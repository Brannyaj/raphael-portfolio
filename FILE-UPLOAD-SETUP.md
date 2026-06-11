# File Upload & Email Notification Setup Guide

## 🎉 What's Been Implemented

Your payment form now supports:
- ✅ File uploads (proof of payment screenshots)
- ✅ Email notifications to you with file download URLs
- ✅ Email confirmations to customers
- ✅ Support for Zelle and Venmo payments

## 📋 How It Works

### User Flow:
1. User fills out payment form
2. Selects Zelle or Venmo as payment method
3. Uploads proof of payment (screenshots/receipts)
4. Submits form
5. Files are uploaded to cloud storage
6. **YOU receive email with:**
   - Customer details
   - Project information
   - **Download links for all uploaded files**
7. Customer receives confirmation email

## 🔧 Setup Required

### For Local Development (Testing):

1. **Install multer dependency:**
   ```bash
   npm install multer
   ```

2. **Update script.js API endpoint (line 1356):**
   Change from:
   ```javascript
   const response = await fetch('https://raphael-portfolio-backend.raphael-devworkersdev.workers.dev/api/submit-project', {
   ```
   To:
   ```javascript
   const response = await fetch('http://localhost:3000/api/submit-project', {
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Test the form:**
   - Go to http://localhost:3000/pricing.html
   - Select a service
   - Click "Get Started"
   - Fill form and upload files
   - Submit
   - Check console for file URLs

### For Production (Cloudflare Workers):

1. **Set up Cloudflare R2 Storage:**
   - Go to Cloudflare Dashboard
   - Create R2 bucket: `payment-proofs`
   - Enable public access or configure custom domain

2. **Update worker.js (line 520):**
   Replace placeholder URL with your R2 public URL:
   ```javascript
   return `https://pub-YOUR-R2-BUCKET.r2.dev/${fileName}`;
   ```

3. **Configure Resend API:**
   - Sign up at https://resend.com
   - Get API key
   - Add to Cloudflare Worker environment variables:
     ```bash
     wrangler secret put RESEND_API_KEY
     ```

4. **Add R2 binding to wrangler.toml:**
   ```toml
   [[r2_buckets]]
   binding = "PAYMENT_PROOFS_BUCKET"
   bucket_name = "payment-proofs"
   ```

5. **Deploy:**
   ```bash
   wrangler deploy
   ```

## 📧 Email Configuration

### Admin Email (where YOU receive notifications):
- Set in `worker.js` line 733: `raphaelportfolio318@gmail.com`

### Resend Setup:
1. Verify your domain at Resend
2. Add DNS records
3. Update "from" email addresses in worker.js (lines 309, 394, 588, 733)

## 🗂️ File Storage Options

### Option 1: Cloudflare R2 (Recommended for production)
- Scalable
- Cost-effective
- Integrated with Workers
- **Required setup:** Create bucket + configure wrangler.toml

### Option 2: Local Storage (Development only)
- Files saved to `/uploads` folder
- Accessible at `http://localhost:3000/uploads/filename`
- **Already configured** in server.js

## 🧪 Testing Checklist

- [ ] Install multer: `npm install multer`
- [ ] Update API endpoint in script.js to local
- [ ] Start server: `npm start`
- [ ] Go to pricing page
- [ ] Select service and click "Get Started"
- [ ] Fill out payment form
- [ ] Upload 1-3 test images
- [ ] Submit form
- [ ] Check console for uploaded file URLs
- [ ] Verify files in `/uploads` folder

## 🚀 Production Deployment Checklist

- [ ] Set up Cloudflare R2 bucket
- [ ] Configure R2 binding in wrangler.toml
- [ ] Get Resend API key
- [ ] Add RESEND_API_KEY to Worker secrets
- [ ] Update R2 URL in worker.js
- [ ] Verify domain in Resend
- [ ] Update "from" email addresses
- [ ] Update script.js API endpoint back to production URL
- [ ] Deploy worker: `wrangler deploy`
- [ ] Test end-to-end flow in production

## 📁 Files Modified

1. **script.js** - Added FormData upload logic
2. **worker.js** - Added file upload + email handlers
3. **server.js** - Added multer for local development
4. **payment.html** - Already had file input (no changes needed)

## 🆘 Troubleshooting

### Files not uploading?
- Check browser console for errors
- Verify file size < 20MB
- Check multer is installed: `npm list multer`

### Emails not sending?
- Verify RESEND_API_KEY is set
- Check domain is verified in Resend
- Check Worker logs in Cloudflare dashboard

### R2 errors?
- Verify bucket exists
- Check binding in wrangler.toml
- Ensure bucket name matches exactly

## 💡 Next Steps

1. Test locally first
2. Set up Resend account
3. Configure R2 bucket
4. Deploy to production
5. Test end-to-end

## 📞 Support

If you encounter issues:
- Check Cloudflare Worker logs
- Check Resend delivery logs
- Test with small files first
- Verify all environment variables are set
