// pages/api/mocks/stripe-webhook.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  console.log('--- Mock Stripe Webhook Triggered ---');
  const event = req.body;

  // Validate the event type we are mocking
  if (event.type !== 'checkout.session.completed') {
    return res.status(400).json({ error: 'Event type not supported by mock.' });
  }

  const session = event.data.object;
  const customerEmail = session.customer_details?.email || 'musician@example.com';
  const customerName = session.customer_details?.name || 'Practicing Musician';
  const lineItems = session.line_items || [];

  console.log(`Purchase detected for Customer: ${customerName} (${customerEmail})`);
  console.log('Purchased Items:', JSON.stringify(lineItems));

  // Determine what cross-sell is relevant
  let purchasedType = 'chords';
  let targetKey = 'C';
  
  if (lineItems.length > 0) {
    const title = lineItems[0].price?.product?.name || '';
    if (title.toLowerCase().includes('scale')) purchasedType = 'scales';
    if (title.toLowerCase().includes('arpeggio')) purchasedType = 'arpeggios';
    
    // Check if key is in title
    const match = title.match(/Key of ([A-G]#?)/i);
    if (match && match[1]) targetKey = match[1];
  }

  // Trigger mock transactional email service
  try {
    const origin = req.headers.origin || `http://${req.headers.host}`;
    const emailRes = await axios.post(`${origin}/api/mocks/email-service`, {
      action: 'SEND_PURCHASE_RECEIPT',
      email: customerEmail,
      name: customerName,
      purchasedType,
      key: targetKey
    });

    console.log('Email Mock response:', emailRes.data);

    // Schedule 7-day follow-up cross-sell mock
    await axios.post(`${origin}/api/mocks/email-service`, {
      action: 'SCHEDULE_FOLLOWUP_CROSS_SELL',
      email: customerEmail,
      name: customerName,
      purchasedType,
      key: targetKey
    });

    return res.status(200).json({
      message: 'Stripe webhook mock processed successfully.',
      emailServiceStatus: 'Receipt sent and follow-up scheduled.',
      webhookDetails: {
        customerEmail,
        customerName,
        purchasedType,
        key: targetKey
      }
    });
  } catch (err) {
    console.error('Failed to trigger mock email service:', err.message);
    return res.status(500).json({ error: 'Webhook processed, but email mock failed.', details: err.message });
  }
}
