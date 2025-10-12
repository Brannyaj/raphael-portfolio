// Cloudflare Worker for Raphael's Portfolio Backend
// Handles Stripe payment processing, webhooks, and email notifications

export default {
  async fetch(request, env, ctx) {
    // Dynamically import Stripe
    const Stripe = (await import('stripe')).default;
    
    // Initialize Stripe with your secret key from environment variables
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS requests for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      // Route: Create Payment Intent
      if (path === '/create-payment-intent' && request.method === 'POST') {
        const { amount, currency, metadata } = await request.json();

        // Create a PaymentIntent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // amount in cents
          currency: currency || 'usd',
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: metadata || {}, // Store customer info for webhook
        });

        return new Response(
          JSON.stringify({
            clientSecret: paymentIntent.client_secret,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Route: Update Payment Intent Metadata
      if (path === '/update-payment-intent' && request.method === 'POST') {
        const { paymentIntentId, metadata } = await request.json();

        if (!paymentIntentId) {
          return new Response(
            JSON.stringify({ error: 'Payment Intent ID is required' }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        }

        // Update the PaymentIntent with customer metadata
        const paymentIntent = await stripe.paymentIntents.update(
          paymentIntentId,
          {
            metadata: metadata || {},
          }
        );

        return new Response(
          JSON.stringify({
            success: true,
            paymentIntentId: paymentIntent.id,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Route: Submit Project Data
      if (path === '/api/submit-project' && request.method === 'POST') {
        const projectData = await request.json();

        // Log project submission
        console.log('Project submission received:', projectData);

        // Store project data temporarily (you could save to KV or D1 here)
        // For now, we'll rely on Stripe metadata to get this data in the webhook

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Project data received successfully',
            data: projectData,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Route: Stripe Webhook Handler
      if (path === '/webhook' && request.method === 'POST') {
        const signature = request.headers.get('stripe-signature');
        const body = await request.text();

        let event;

        try {
          event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
          );
        } catch (err) {
          console.error('Webhook signature verification failed:', err.message);
          return new Response(
            JSON.stringify({ error: `Webhook Error: ${err.message}` }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
              },
            }
          );
        }

        // Handle the event
        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent.id);
            
            // Send confirmation emails
            try {
              await sendPaymentConfirmationEmails(paymentIntent, env.RESEND_API_KEY);
              console.log('Confirmation emails sent successfully');
            } catch (emailError) {
              console.error('Failed to send confirmation emails:', emailError);
              // Don't fail the webhook if email fails
            }
            break;
            
          case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;
            
          default:
            console.log(`Unhandled event type ${event.type}`);
        }

        return new Response(
          JSON.stringify({ received: true }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Default: Route not found
      return new Response(
        JSON.stringify({ error: 'Not Found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};

// Send payment confirmation emails via Resend
async function sendPaymentConfirmationEmails(paymentIntent, resendApiKey) {
  const metadata = paymentIntent.metadata || {};
  const amount = (paymentIntent.amount / 100).toFixed(2);
  const customerEmail = paymentIntent.receipt_email || metadata.email;
  
  if (!customerEmail) {
    console.error('No customer email found in payment intent');
    return;
  }

  // Send confirmation to customer
  await sendCustomerConfirmation(customerEmail, metadata, amount, resendApiKey);
  
  // Send notification to you (Raphael)
  await sendAdminNotification(metadata, amount, paymentIntent.id, resendApiKey);
}

// Send confirmation email to customer
async function sendCustomerConfirmation(customerEmail, metadata, amount, resendApiKey) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #6C8094; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .highlight { color: #6C8094; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Confirmed!</h1>
          <p>Thank you for your deposit payment</p>
        </div>
        <div class="content">
          <p>Hi ${metadata.name || 'there'},</p>
          
          <p>Your payment has been successfully processed! I've received your project details and will be in touch within <strong>24 hours</strong> to discuss the next steps.</p>
          
          <div class="info-box">
            <h3>Payment Details:</h3>
            <p><strong>Amount Paid:</strong> $${amount}</p>
            <p><strong>Service:</strong> ${metadata.service || 'N/A'}</p>
            <p><strong>Project Type:</strong> ${metadata.complexity || 'N/A'}</p>
            ${metadata.tier ? `<p><strong>Tier:</strong> ${metadata.tier}</p>` : ''}
            <p><strong>Total Project Cost:</strong> $${metadata.totalCost || 'N/A'}</p>
            <p><strong>Remaining Balance:</strong> $${metadata.remainingAmount || 'N/A'}</p>
          </div>
          
          <div class="info-box">
            <h3>What's Next?</h3>
            <ul>
              <li>I'll review your project requirements in detail</li>
              <li>We'll schedule a call to discuss your vision</li>
              <li>I'll provide a detailed project timeline</li>
              <li>Work begins once we finalize all details</li>
            </ul>
          </div>
          
          <p>If you have any questions in the meantime, feel free to reply to this email or contact me at:</p>
          <p><a href="mailto:raphaelagbo279@gmail.com">raphaelagbo279@gmail.com</a><br>
          <a href="tel:+14157411433">+1 415-741-1433</a></p>
          
          <p>Looking forward to bringing your project to life!</p>
          
          <p>Best regards,<br>
          <strong>Raphael</strong><br>
          <em>Senior Software Engineer</em></p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation email from raphaelportfolio.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Raphael <noreply@raphaelportfolio.com>',
      to: [customerEmail],
      subject: 'Project details received',
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send customer email: ${error}`);
  }

  console.log('Customer confirmation email sent to:', customerEmail);
}

// Send notification email to admin (Raphael)
async function sendAdminNotification(metadata, amount, paymentIntentId, resendApiKey) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #6C8094; }
        .highlight { color: #6C8094; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Payment Received!</h1>
          <p>A customer just completed their deposit payment</p>
        </div>
        <div class="content">
          <div class="info-box">
            <h3>Payment Information:</h3>
            <p><strong>Amount Received:</strong> $${amount}</p>
            <p><strong>Payment ID:</strong> ${paymentIntentId}</p>
            <p><strong>Total Project Value:</strong> $${metadata.totalCost || 'N/A'}</p>
            <p><strong>Remaining Balance:</strong> $${metadata.remainingAmount || 'N/A'}</p>
          </div>
          
          <div class="info-box">
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> ${metadata.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${metadata.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${metadata.phone || 'N/A'}</p>
          </div>
          
          <div class="info-box">
            <h3>Project Details:</h3>
            <p><strong>Service Type:</strong> ${metadata.service || 'N/A'}</p>
            <p><strong>Complexity:</strong> ${metadata.complexity || 'N/A'}</p>
            ${metadata.tier ? `<p><strong>Tier:</strong> ${metadata.tier}</p>` : ''}
            ${metadata.isHourlyRate ? `<p><strong>Hourly Rate Project</strong></p>` : ''}
            ${metadata.projectDescription ? `<p><strong>Description:</strong><br>${metadata.projectDescription}</p>` : ''}
          </div>
          
          <div class="info-box">
            <h3>Next Steps:</h3>
            <ul>
              <li>Review the customer's requirements</li>
              <li>Contact them within 24-48 hours</li>
              <li>Schedule initial consultation call</li>
              <li>Provide detailed project timeline</li>
            </ul>
          </div>
          
          <p><strong>Action Required:</strong> Reach out to the customer to start the project!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Raphael Portfolio <noreply@raphaelportfolio.com>',
      to: ['raphaelagbo279@gmail.com'],
      subject: 'New Payment Received',
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send admin email: ${error}`);
  }

  console.log('Admin notification email sent');
}
