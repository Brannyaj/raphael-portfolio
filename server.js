const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Serve static files with proper MIME types
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.mp4')) {
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Accept-Ranges', 'bytes');
        }
    }
}));

// Create payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // amount in cents
            currency: currency || 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Submit project data endpoint with file uploads
app.post('/api/submit-project', upload.array('files', 20), async (req, res) => {
    try {
        const projectData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            description: req.body.description,
            projectCost: req.body.projectCost,
            depositAmount: req.body.depositAmount,
            service: req.body.service,
            complexity: req.body.complexity,
            paymentMethod: req.body.paymentMethod,
        };
        
        // Get uploaded file information
        const uploadedFiles = req.files || [];
        const fileUrls = uploadedFiles.map(file => ({
            name: file.originalname,
            url: `http://localhost:${PORT}/uploads/${file.filename}`,
            size: file.size,
            type: file.mimetype
        }));
        
        console.log('Project submission received:', projectData);
        console.log('Files uploaded:', fileUrls.length);
        
        // Log file URLs for easy access
        if (fileUrls.length > 0) {
            console.log('\nUploaded Files:');
            fileUrls.forEach((file, index) => {
                console.log(`${index + 1}. ${file.name}`);
                console.log(`   URL: ${file.url}`);
                console.log(`   Size: ${formatFileSize(file.size)}`);
            });
        }
        
        // In production, you would:
        // 1. Send email notifications with file URLs
        // 2. Save to database
        // For local development, just log the info
        
        res.json({
            success: true,
            message: 'Project data and files received successfully',
            data: projectData,
            filesUploaded: fileUrls.length,
            fileUrls: fileUrls
        });
    } catch (error) {
        console.error('Error submitting project:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Webhook to handle Stripe events (optional but recommended)
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = 'whsec_YOUR_WEBHOOK_SECRET'; // Get this from Stripe Dashboard

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent.id);
            // Here you would update your database, send confirmation emails, etc.
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Stripe integration is ready!');
});

