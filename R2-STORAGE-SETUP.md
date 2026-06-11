# Cloudflare R2 Storage Setup Guide

## 🎯 What You're Setting Up

Cloudflare R2 will store the proof of payment files that customers upload. After setup, you'll receive email notifications with download links to these files.

---

## 📋 Step-by-Step Setup in Cloudflare Dashboard

### 1. Log into Cloudflare Dashboard
- Go to: https://dash.cloudflare.com/
- Log in with your account

### 2. Navigate to R2 Storage
- In the left sidebar, click **"R2"** (under Storage & Databases)
- Or go directly to: https://dash.cloudflare.com/?to=/:account/r2

### 3. Create Your First R2 Bucket

#### Step 3.1: Click "Create bucket"
- You'll see a blue button "Create bucket" - click it

#### Step 3.2: Configure Bucket Settings
Fill in these details:

**Bucket Name:**
```
payment-proofs
```
⚠️ **Important:** Use exactly this name, or you'll need to update your code later.

**Location:**
- Choose **"Automatic"** (recommended)
- Or select a specific region closest to your users

**Storage Class:**
- Select **"Standard"** (default)

#### Step 3.3: Create the Bucket
- Click **"Create bucket"**
- Your bucket is now created!

### 4. Enable Public Access (For File Downloads)

You have 2 options:

#### Option A: Custom Domain (Recommended)
1. Click on your bucket name `payment-proofs`
2. Go to **"Settings"** tab
3. Scroll to **"Public access"** section
4. Click **"Connect Domain"**
5. Enter a subdomain: `files.yourdomain.com`
6. Follow DNS setup instructions
7. Once verified, your files will be accessible at:
   ```
   https://files.yourdomain.com/filename
   ```

#### Option B: R2.dev Subdomain (Quick Setup)
1. Click on your bucket name `payment-proofs`
2. Go to **"Settings"** tab
3. Scroll to **"Public access"** section
4. Click **"Allow Access"**
5. You'll get a public URL like:
   ```
   https://pub-abc123xyz.r2.dev
   ```
6. **SAVE THIS URL** - you'll need it!

---

## 🔧 Configuration After R2 Setup

### Step 1: Note Your R2 Public URL

After enabling public access, you should have one of these:

**Custom Domain:**
```
https://files.yourdomain.com
```

**Or R2.dev Subdomain:**
```
https://pub-[YOUR-UNIQUE-ID].r2.dev
```

**📝 Write it down - you need this for the next step!**

---

### Step 2: Update worker.js with Your R2 URL

Open `worker.js` and find **line 520** (in the `uploadFileToR2` function):

**CHANGE THIS:**
```javascript
// Return public URL (you'll need to configure R2 public access or use signed URLs)
return `https://pub-YOURR2BUCKET.r2.dev/${fileName}`;
```

**TO THIS (using your actual URL):**
```javascript
// If using custom domain:
return `https://files.yourdomain.com/${fileName}`;

// OR if using R2.dev subdomain:
return `https://pub-abc123xyz.r2.dev/${fileName}`;
```

---

### Step 3: Update wrangler.toml

Open `wrangler.toml` and add this R2 binding configuration:

**Add this to the bottom of wrangler.toml:**
```toml
[[r2_buckets]]
binding = "PAYMENT_PROOFS_BUCKET"
bucket_name = "payment-proofs"
```

**Full example wrangler.toml should look like:**
```toml
name = "raphael-portfolio-backend"
main = "worker.js"
compatibility_date = "2023-12-01"

# Your existing environment variables
[vars]
# ... your existing vars ...

# R2 Bucket Binding (ADD THIS)
[[r2_buckets]]
binding = "PAYMENT_PROOFS_BUCKET"
bucket_name = "payment-proofs"
```

---

## 🚀 Deployment

### 1. Deploy Your Worker

From your project directory, run:
```bash
npx wrangler deploy
```

### 2. Verify Deployment
You should see:
```
✨ Deployment complete!
```

---

## ✅ Testing the Setup

### Test 1: Upload a File Manually
1. Go to Cloudflare Dashboard → R2 → payment-proofs
2. Click "Upload"
3. Upload a test image
4. Note the file name
5. Try accessing it at your public URL:
   ```
   https://your-r2-url/test-image.jpg
   ```
6. If you can see/download the file ✅ Public access works!

### Test 2: Test the Full Flow
1. Go to your website: https://yourdomain.com/pricing.html
2. Select a service
3. Click "Get Started"
4. Fill out the payment form
5. Upload a proof of payment image
6. Submit the form
7. Check your email (raphaelportfolio318@gmail.com)
8. Email should have download links to uploaded files
9. Click the links to verify files are accessible

---

## 📊 What Information to Provide

Once R2 is set up, here's what you need:

### ✅ Checklist of Information:

- [ ] **R2 Bucket Name:** `payment-proofs`
- [ ] **R2 Public URL:** `https://pub-________.r2.dev` or `https://files.yourdomain.com`
- [ ] **Worker Binding Name:** `PAYMENT_PROOFS_BUCKET` (already in code)
- [ ] **wrangler.toml updated:** Added R2 binding configuration
- [ ] **worker.js updated:** Line 520 has correct public URL
- [ ] **Worker deployed:** Ran `npx wrangler deploy`

---

## 💰 R2 Pricing (Very Affordable)

**Storage:**
- First 10 GB/month: **FREE**
- After: $0.015 per GB/month

**Operations:**
- Class A (writes): $4.50 per million requests
- Class B (reads): $0.36 per million requests

**Egress (downloads):**
- **FREE** - Unlike S3, no egress charges!

**Example Cost:**
- 100 file uploads/month (~1 GB): **FREE**
- 1,000 file downloads: **FREE**
- Total: **$0/month** 🎉

---

## 🔒 Security Considerations

### File Access Control
Your current setup makes files publicly accessible via URL. This is fine for:
- ✅ Proof of payment screenshots
- ✅ Non-sensitive customer files
- ✅ Files you'll review within 24-48 hours

For better security (optional):
1. Use signed URLs with expiration
2. Implement access tokens
3. Set up CORS rules

---

## 🆘 Troubleshooting

### "Bucket not found" Error
- ✅ Check bucket name in wrangler.toml matches exactly: `payment-proofs`
- ✅ Verify R2 binding is added to wrangler.toml
- ✅ Redeploy worker: `npx wrangler deploy`

### Files Upload but Can't Be Downloaded
- ✅ Verify public access is enabled on the bucket
- ✅ Check the URL in worker.js line 520 is correct
- ✅ Try accessing a test file directly via the R2 public URL

### "env.PAYMENT_PROOFS_BUCKET is undefined"
- ✅ Check the binding name in wrangler.toml: `PAYMENT_PROOFS_BUCKET`
- ✅ Redeploy: `npx wrangler deploy`
- ✅ Check worker logs in Cloudflare dashboard

### CORS Errors
If you get CORS errors when downloading files:
1. Go to R2 bucket → Settings
2. Add CORS policy:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }
]
```

---

## 📞 Quick Reference

**R2 Dashboard:**
https://dash.cloudflare.com/?to=/:account/r2

**Worker Dashboard:**
https://dash.cloudflare.com/?to=/:account/workers

**Resend Dashboard (for email testing):**
https://resend.com/emails

---

## 🎯 Summary: What You Need to Do

1. ✅ Create R2 bucket named `payment-proofs`
2. ✅ Enable public access (Option A or B)
3. ✅ Copy your R2 public URL
4. ✅ Update `worker.js` line 520 with your URL
5. ✅ Add R2 binding to `wrangler.toml`
6. ✅ Deploy: `npx wrangler deploy`
7. ✅ Test by submitting payment form
8. ✅ Check email for download links

---

## ✨ You're All Set!

Once completed, customers will:
1. Fill out payment form
2. Upload proof of payment
3. Files saved to R2
4. You get email with download links
5. Click links to view/download files

Need help? Check Cloudflare Worker logs in the dashboard!
