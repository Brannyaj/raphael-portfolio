// Cloudflare Worker for Raphael's Portfolio Backend
// Handles Stripe payment processing and project submissions

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
        const { amount, currency } = await request.json();

        // Create a PaymentIntent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // amount in cents
          currency: currency || 'usd',
          automatic_payment_methods: {
            enabled: true,
          },
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

      // Route: Submit Project Data
      if (path === '/api/submit-project' && request.method === 'POST') {
        const projectData = await request.json();

        // Log project submission (you can later integrate with a database or email service)
        console.log('Project submission received:', projectData);

        // Here you could:
        // 1. Store in Cloudflare KV or D1 database
        // 2. Send email via SendGrid/Mailgun
        // 3. Send notification to yourself

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
          event = stripe.webhooks.constructEvent(
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
            // TODO: Update database, send confirmation emails, etc.
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
