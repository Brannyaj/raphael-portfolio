# Stripe Webhook Setup Guide

## 🎯 Goal
Configure Stripe to automatically send payment confirmations to customers and project details to you via email when payments succeed.

---

## ✅ What's Already Done:
- ✅ Cloudflare Worker updated with webhook handler
- ✅ Resend API key configured
- ✅ Email templates created (customer + admin)
- ✅ Frontend sending customer data as metadata

---

## 🔧 What You Need to Do:

### **Step 1: Go to Stripe Dashboard**

1. Login to: https://dashboard.stripe.com/
2. Click **"Developers"** in the top menu
3. Click **"Webhooks"** in the left sidebar

---

### **Step 2: Create Webhook Endpoint**

1. Click **"Add endpoint"** button
2. Enter this URL in "Endpoint URL":
   ```
   https://raphael-portfolio-backend.raphael-devworkersdev.workers.dev/webhook
   ```

3. Under **"Select events to listen to"**, click:
   - **"Select events"** button
   - Search for: `payment_intent.succeeded`
   - Check the box next to it
   - Click **"Add events"**

4. Click **"Add endpoint"** at the bottom

---

### **Step 3: Get Webhook Signing Secret**

1. After creating the webhook, you'll see it in the list
2. Click on the webhook endpoint you just created
3. Look for **"Signing secret"** section
4. Click **"Reveal"** to show the secret
5. It will look like: `whsec_...` (copy this!)

---

### **Step 4: Add Webhook Secret to Cloudflare Worker**

Run this command in your terminal (replace `YOUR_WEBHOOK_SECRET` with the actual secret):

```bash
cd /Users/raphaelagbo/raphael
echo "YOUR_WEBHOOK_SECRET" | wrangler secret put STRIPE_WEBHOOK_SECRET
```

Example (DON'T use this, use yours):
```bash
echo "whsec_abc123xyz789..." | wrangler secret put STRIPE_WEBHOOK_SECRET
```

---

### **Step 5: Test the Webhook**

1. Go to your live site: https://raphaelportfolio.com
2. Go through the payment flow:
   - Pricing → Select service → Get Started
   - Fill out the form
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future date (e.g., 12/34)
   - Any CVC (e.g., 123)
   - Any ZIP (e.g., 12345)

3. After payment completes, check:
   - ✅ Customer receives confirmation email
   - ✅ You receive notification at: raphaelagbo279@gmail.com
   - ✅ Emails have all project details

---

## 📧 What Emails Look Like:

### **Customer Receives:**
- ✅ Subject: "Payment Confirmed - Your Project is Starting Soon!"
- ✅ Payment amount and details
- ✅ Project breakdown
- ✅ Next steps
- ✅ Your contact info

### **You Receive:**
- 💰 Subject: "New Payment: $XXX from [Customer Name]"
- 💵 Payment details
- 👤 Customer contact info
- 📋 Full project details
- ⚡ Action items

---

## 🔍 Troubleshooting:

### **Emails not sending?**

1. Check Stripe webhook logs:
   - Stripe Dashboard → Developers → Webhooks
   - Click your webhook endpoint
   - Check "Recent deliveries"
   - Look for errors

2. Check Cloudflare Worker logs:
   ```bash
   wrangler tail --format pretty
   ```
   Then trigger a test payment

3. Verify Resend domain:
   - Login to: https://resend.com/
   - Check if domain is verified
   - Make sure you're sending from: `noreply@raphaelportfolio.com`

### **Webhook signature verification failed?**

- Make sure you added the correct webhook secret
- The secret should start with `whsec_`
- Re-run the `wrangler secret put STRIPE_WEBHOOK_SECRET` command

---

## 🎯 After Setup:

Once webhooks are working:
- ✅ Every successful payment triggers 2 emails automatically
- ✅ You'll never miss a client payment
- ✅ Customers get instant confirmation
- ✅ All project details delivered to your inbox
- ✅ No need to check Stripe dashboard constantly

---

## 📝 Important Notes:

1. **Test Mode vs Live Mode:**
   - Webhooks are separate for test and live modes
   - If testing, create webhook in **test mode**
   - For production, create webhook in **live mode**

2. **Current Setup:**
   - Using **LIVE** Stripe keys
   - Webhooks will send real emails
   - Make sure webhook is in **LIVE mode** too!

3. **Security:**
   - Webhook secret is required for security
   - Never share your webhook secret publicly
   - If leaked, regenerate it in Stripe Dashboard

---

**Ready to set it up? Follow the steps above!** 🚀

Once done, test a payment and you'll get your first automated email notification! 📧

