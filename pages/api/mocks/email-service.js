// pages/api/mocks/email-service.js
import { getMonthlyCoupons } from '../../../core/marketing/coupons';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { action, email, name, purchasedType, key } = req.body;
  const coupons = getMonthlyCoupons(); // e.g. JULY2026_10, JULY2026_15

  console.log(`--- Mock Email Service Action: ${action} ---`);

  if (action === 'SEND_PURCHASE_RECEIPT') {
    // Mocking purchase delivery email
    const downloadLink = `https://sheets.media/api/download-sheet?type=${purchasedType === 'chords' ? 'chord' : purchasedType === 'scales' ? 'scale' : 'arpeggio'}&key=${key}&item=all&labelDisplay=names&format=pdf&title=${purchasedType}_bundle_${key}`;
    
    const emailHtml = `
      <h1>Thank you for your purchase, ${name}!</h1>
      <p>Your digital chord/scale sheets are ready for download.</p>
      <p><strong>Item Purchased:</strong> All ${key} ${purchasedType} Bundle</p>
      <p><a href="${downloadLink}" style="background: #fff000; color: #000; padding: 10px 20px; border: 2px solid #000; text-decoration: none; font-weight: bold;">Download PDF Sheet Music</a></p>
      <hr/>
      <p>Need support? Reply directly to this email.</p>
    `;

    console.log(`[Email Sent to ${email}] Subject: "Your Sheets.Media Order is Ready"`);
    console.log(`Download link: ${downloadLink}`);

    return res.status(200).json({
      success: true,
      message: `Receipt email dispatched to ${email}`,
      subject: 'Your Sheets.Media Order is Ready',
      bodySnippet: `Item: All ${key} ${purchasedType} Bundle`
    });
  }

  if (action === 'SCHEDULE_FOLLOWUP_CROSS_SELL') {
    // Determine cross-sell product category
    let crossSellType = 'arpeggios';
    if (purchasedType === 'arpeggios') crossSellType = 'scales';
    else if (purchasedType === 'scales') crossSellType = 'chords';

    // The follow-up email features the 15% discount code for the current month!
    const discountCode = coupons.code15;

    const followUpHtml = `
      <h3>Keep your practice going, ${name}! 🎸</h3>
      <p>Hope you are enjoying the <strong>All ${key} ${purchasedType} Bundle</strong>. Consistent practice makes perfect.</p>
      <p>To take your phrasing to the next level, we highly recommend adding arpeggios to your daily routine.</p>
      <p>Get our **All ${key} ${crossSellType} Bundle** at **15% off** today using code: <strong>${discountCode}</strong> at checkout.</p>
      <p><a href="https://sheets.media/store#product-bundle-${key}-${crossSellType}" style="background: #ff4081; color: #000; padding: 8px 16px; border: 2px solid #000; text-decoration: none; font-weight: bold;">Shop the ${crossSellType} Bundle</a></p>
    `;

    console.log(`[Scheduled Email for ${email} in 7 days] Subject: "Level up your ${key} practice - 15% discount inside"`);
    console.log(`Cross-sell offer uses coupon: ${discountCode}`);

    return res.status(200).json({
      success: true,
      message: `7-day follow-up scheduled for ${email}`,
      targetCoupon: discountCode,
      subject: `Level up your ${key} practice - 15% discount inside`,
      suggestedProduct: `bundle-${key}-${crossSellType}`
    });
  }

  return res.status(400).json({ error: `Unsupported action: ${action}` });
}
