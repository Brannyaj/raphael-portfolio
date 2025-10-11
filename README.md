# Raphael's Portfolio Website

A professional portfolio website with integrated Stripe payment processing for project deposits.

## Features

- **Pricing Calculator**: Interactive calculator for different service types and complexity levels
- **Stripe Integration**: Secure payment processing for 10% project deposits
- **Multi-page Layout**: Separate pages for Portfolio, Skills, Pricing, Gallery, Contact, and About
- **Responsive Design**: Works on all devices with glassmorphism UI
- **Payment Tracking**: Automatically calculates 10% deposit and 90% balance

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 3. Access the Website

Open your browser and go to:
```
http://localhost:3000
```

## Stripe Configuration

Your Stripe keys are already configured:
- **Publishable Key**: Set in `script.js`
- **Secret Key**: Set in `server.js`

### Important Security Notes:

⚠️ **NEVER commit your secret key to Git!**

For production deployment:
1. Use environment variables for secret keys
2. Set up Stripe webhooks for payment notifications
3. Add proper database integration to store project data

## How It Works

### Customer Flow:
1. Customer visits pricing page
2. Selects service type (Website, Mobile App, AI, Blockchain)
3. Selects complexity level (Basic, Advanced, Enterprise)
4. Sees total cost and 10% deposit amount
5. Clicks "Get Started"
6. Fills in contact information and project description
7. Enters payment details via Stripe
8. Pays 10% deposit
9. You receive notification and follow up

### Payment Processing:
- 10% deposit paid upfront via Stripe
- 90% balance due after project completion
- All payments are secure and PCI compliant

## API Endpoints

### POST /create-payment-intent
Creates a Stripe payment intent for the deposit amount.

**Request:**
```json
{
  "amount": 30000,  // Amount in cents ($300.00)
  "currency": "usd"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

### POST /api/submit-project
Receives and stores project submission data.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "description": "Project description",
  "projectCost": 3000,
  "depositAmount": 300,
  "service": "Website Development",
  "complexity": "Basic Custom-Built"
}
```

## Deployment

### For Production:

1. **Set up environment variables:**
   ```bash
   STRIPE_SECRET_KEY=your_secret_key
   PORT=3000
   ```

2. **Update server.js** to use environment variables:
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   ```

3. **Deploy to your hosting platform** (Netlify, Vercel, Heroku, etc.)

4. **Set up Stripe webhooks** in your Stripe Dashboard to receive payment notifications

## Support

For questions or issues, contact: raphael@example.com

## License

© 2025 Raphael. All rights reserved.
