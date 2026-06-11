# 🚀 R2 Quick Setup - Configuration Values

## What You Need to Provide After R2 Setup

Once you've created your R2 bucket in Cloudflare, you need to configure these values:

---

## 📝 STEP 1: In Cloudflare Dashboard

### Create R2 Bucket
1. Go to: https://dash.cloudflare.com/?to=/:account/r2
2. Click "Create bucket"
3. Name: **`payment-proofs`** ✅ (Already configured in code)
4. Location: Automatic
5. Click "Create bucket"

### Enable Public Access
1. Click on your bucket "payment-proofs"
2. Go to "Settings" tab
3. Under "Public access", click "Allow Access"
4. **COPY THE URL YOU GET** - something like:
   ```
   https://pub-abc123xyz789.r2.dev
   ```

---

## 📝 STEP 2: Update worker.js

### What to Change:
Open `worker.js` and go to **line 520**

### Current Code (line 520):
```javascript
return `https://pub-YOURR2BUCKET.r2.dev/${fileName}`;
```

### Change to (use YOUR actual R2 URL):
```javascript
return `https://pub-abc123xyz789.r2.dev/${fileName}`;
```

**Replace `pub-abc123xyz789` with your actual R2 public URL!**

---

## 📝 STEP 3: wrangler.toml

✅ **ALREADY DONE!** I've updated this file for you:

```toml
[[r2_buckets]]
binding = "PAYMENT_PROOFS_BUCKET"
bucket_name = "payment-proofs"
```

---

## 📝 STEP 4: Deploy

Run this command:
```bash
npx wrangler deploy
```

---

## ✅ Configuration Checklist

Copy this checklist and fill in YOUR values:

```
☐ R2 Bucket Created
   Bucket Name: payment-proofs ✓
   
☐ Public Access Enabled
   My R2 Public URL: https://pub-________________.r2.dev
   
☐ worker.js Updated (line 520)
   Changed URL to: https://pub-________________.r2.dev
   
☐ wrangler.toml Updated ✓ (Already done)
   
☐ Worker Deployed
   Ran: npx wrangler deploy
   Result: ✨ Deployment complete!
```

---

## 🎯 Example: What YOUR Configuration Should Look Like

### If your R2 URL is: `https://pub-a1b2c3d4e5f6.r2.dev`

**Then in worker.js line 520:**
```javascript
return `https://pub-a1b2c3d4e5f6.r2.dev/${fileName}`;
```

---

## 🧪 Test After Setup

1. Go to: https://yourdomain.com/pricing.html
2. Select any service → Get Started
3. Fill payment form
4. Upload a test image
5. Submit
6. Check email at: **raphaelportfolio318@gmail.com**
7. Email should have download links
8. Click links → Should download files ✅

---

## 🆘 Need Help?

### Can't find R2 public URL?
1. Cloudflare Dashboard → R2
2. Click on "payment-proofs" bucket
3. Settings tab
4. Look for "Public access" section
5. URL should be visible there

### Worker deployment fails?
```bash
# Check if you're logged in
npx wrangler whoami

# Login if needed
npx wrangler login

# Then deploy
npx wrangler deploy
```

---

## 📋 Summary - What YOU Need to Do:

1. ✅ Create R2 bucket "payment-proofs" in Cloudflare
2. ✅ Enable public access
3. ✅ Copy the R2 public URL (starts with https://pub-)
4. ✅ Paste it in worker.js line 520
5. ✅ Run: `npx wrangler deploy`
6. ✅ Test the payment form

**That's it! 🎉**
