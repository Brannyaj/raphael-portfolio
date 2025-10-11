# 🚀 Portfolio Website - Quick Start Guide

## Important: Server & URL Information

### ✅ HOW TO ACCESS YOUR WEBSITE

**Open your browser and visit:**
```
http://localhost:3000
```

**For the pricing page specifically:**
```
http://localhost:3000/pricing.html
```

### 🔴 Common Mistake
- ❌ DON'T use: `http://localhost` (no port number)
- ❌ DON'T use: `http://localhost:8000` (old Python server)
- ✅ DO use: `http://localhost:3000` (Node.js server with Stripe)

---

## 🎯 How to Test the Pricing Calculator with Stripe Payment

### Step-by-Step Process:

1. **Visit the pricing page:**
   - Open: `http://localhost:3000/pricing.html`

2. **Select a service:**
   - Choose from: Website, Mobile App, AI Integration, or Blockchain

3. **Select complexity:**
   - Choose the complexity level (Basic, Advanced, Enterprise, etc.)

4. **View the pricing:**
   - You'll see the estimated cost
   - 10% deposit amount
   - 90% remaining balance (due after project completion)

5. **Click "Get Started":**
   - You'll be redirected to a **separate payment page** (`payment.html`)
   - This keeps the pricing page clean and professional

6. **On the Payment Page:**
   - You'll see:
     - **Project Summary** (left side - sticky)
       - Selected service
       - Complexity level
       - Total cost
       - 10% deposit amount
       - Remaining balance
     - **Payment Form** (right side)
       - Client details fields (Name, Email, Phone, Project Description)
       - **Stripe Payment Element** (for card payment)

7. **Fill out the form and pay:**
   - Enter your details
   - Enter card information in the Stripe element
   - Click "Pay Deposit & Submit Project"
   - On success, you'll be redirected to the success page

---

## 🖥️ Server Management

### Start the Server
```bash
npm start
```
or
```bash
./start.sh
```

### Stop the Server
```bash
# Find the process ID
lsof -ti:3000

# Kill the process (replace <PID> with the actual process ID)
kill -9 <PID>
```

---

## 📝 Stripe Test Cards (For Testing)

Use these test card numbers in the Stripe payment element:

- **Success:** `4242 4242 4242 4242`
- **Authentication Required:** `4000 0025 0000 3155`
- **Declined:** `4000 0000 0000 9995`

**For all test cards:**
- Use any future expiration date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

---

## 🔑 Current Stripe Configuration

- **Environment:** Live mode
- **Publishable Key:** Configured in `script.js`
- **Secret Key:** Configured in `server.js`

⚠️ **Security Note:** Before deploying to production, move the secret key to environment variables using a `.env` file.

---

## 📂 Important Files

- `server.js` - Node.js backend with Stripe integration
- `pricing.html` - Pricing calculator page (clean, no form)
- `payment.html` - **NEW** Separate payment page with form and Stripe
- `script.js` - Frontend logic for calculator, page navigation, and Stripe
- `styles.css` - All styling (including new payment page styles)
- `payment-success.html` - Success page after payment

---

## 🐛 Troubleshooting

### "I don't see the pricing calculator dropdowns"
- **Solution:** Make sure you're accessing `http://localhost:3000`, not just `localhost`

### "Stripe payment element not loading"
- **Solution:** Ensure the Node.js server is running on port 3000
- **Check:** Open browser console (F12) for any errors

### "POST request returns 501 error"
- **Solution:** You're accessing the wrong port. Use port 3000, not 8000

---

## ✅ Everything Working?

If you can see:
1. ✅ Service dropdown
2. ✅ Complexity dropdown
3. ✅ Pricing display after selection
4. ✅ Form with Stripe payment element after clicking "Get Started"

**Then everything is set up correctly! 🎉**

---

**Need help?** Check the browser console (F12) for any JavaScript errors.

