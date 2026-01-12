"use server";

import nodemailer from "nodemailer";

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl: string;
};

type PaymentDetails = {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  paypalEmail?: string;
  zelleEmail?: string;
  venmoHandle?: string;
  chimeSign?: string;
  applePayInfo?: string;
};

type OrderPayload = {
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: CartItem[];
  summary: {
    subtotal: string;
    shipping: string;
    taxes: string;
    total: string;
  };
  payment: {
    method: string;
    details: PaymentDetails;
  };
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});
// Verify transporter on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ SMTP connection verification failed:", error);
  } else {
    console.log("✅ SMTP transporter is ready to send emails");
  }
});

function generatePaymentDetailsHtml(payload: OrderPayload): string {
  const { payment } = payload;
  let detailsHtml = `<p><strong>Payment Method:</strong> ${payment.method}</p>`;

  switch (payment.method) {
    case 'card':
      detailsHtml += `<p><strong>Card Number:</strong> ...${payment.details.cardNumber?.slice(-4)}</p>`;
      break;
    case 'paypal':
      detailsHtml += `<p><strong>PayPal Email:</strong> ${payment.details.paypalEmail}</p>`;
      break;
    case 'zelle':
      detailsHtml += `<p><strong>Zelle Contact:</strong> ${payment.details.zelleEmail}</p>`;
      break;
    case 'chime':
      detailsHtml += `<p><strong>Chime $ChimeSign:</strong> ${payment.details.chimeSign}</p>`;
      break;
    case 'apple-pay':
      detailsHtml += `<p><strong>Apple Pay:</strong> Transaction processed via Apple Pay.</p>`;
      break;
    case 'venmo':
      detailsHtml += `<p><strong>Venmo Handle:</strong> ${payment.details.venmoHandle}</p>`;
      break;
  }
  return detailsHtml;
}


function generateOrderHtml(payload: OrderPayload, isAdmin: boolean = false): string {
  const { customer, items, summary, payment } = payload;

  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 0;">
          <div style="display: flex; align-items: center;">
            <img src="${item.imageUrl}" alt="${
        item.name
      }" width="64" height="64" style="border-radius: 8px; margin-right: 16px;">
            <div>
              <p style="font-weight: 600; margin: 0;">${item.name}</p>
              <p style="font-size: 0.875rem; color: #6b7280; margin: 4px 0 0;">Qty: ${
                item.quantity
              }</p>
            </div>
          </div>
        </td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600;">$${item.subtotal.toFixed(
          2
        )}</td>
      </tr>
    `
    )
    .join("");
    
  const paymentInfoHtml = isAdmin 
    ? generatePaymentDetailsHtml(payload)
    : `<p><strong>Payment Method:</strong> ${payment.method}</p>`;


  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1f2937; }
          .container { max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f9fafb; border-radius: 12px; }
          .header { text-align: center; margin-bottom: 24px; }
          .header h1 { font-size: 2.25rem; font-weight: 700; color: #111827; }
          .content { background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .footer { margin-top: 24px; text-align: center; font-size: 0.875rem; color: #6b7280; }
          h2 { font-size: 1.25rem; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 16px; }
          p { margin: 0 0 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isAdmin ? 'New Order Received' : 'Thank You for Your Order!'}</h1>
            <p>${isAdmin ? `Order from ${customer.name} (${customer.email})` : 'Your order has been confirmed. Here are the details:'}</p>
          </div>
          <div class="content">
            <h2>Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
            </table>
            <table style="width: 100%; margin-top: 24px;">
              <tr><td style="padding: 4px 0;">Subtotal:</td><td style="padding: 4px 0; text-align: right;">$${
                summary.subtotal
              }</td></tr>
              <tr><td style="padding: 4px 0;">Shipping:</td><td style="padding: 4px 0; text-align: right;">$${
                summary.shipping
              }</td></tr>
              <tr><td style="padding: 4px 0; border-bottom: 1px solid #e5e7eb;">Taxes:</td><td style="padding: 4px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">$${
                summary.taxes
              }</td></tr>
              <tr style="font-weight: 700; font-size: 1.125rem;"><td style="padding-top: 12px;">Total:</td><td style="padding-top: 12px; text-align: right;">$${
                summary.total
              }</td></tr>
            </table>
            
            <h2 style="margin-top: 24px;">Shipping Information</h2>
            <p><strong>${customer.name}</strong><br>${customer.address}<br>${
    customer.city
  }, ${customer.state} ${customer.zip}</p>
            
            <h2 style="margin-top: 24px;">Payment Information</h2>
            ${paymentInfoHtml}

          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CelestialGems. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
}

export async function handlePlaceOrder(payload: OrderPayload) {
  if (
    !process.env.EMAIL_SERVER_USER ||
    !process.env.EMAIL_SERVER_PASSWORD ||
    !process.env.EMAIL_ADMIN
  ) {
    throw new Error("Email server environment variables are not configured.");
  }

  const customerHtml = generateOrderHtml(payload, false);
  const adminHtml = generateOrderHtml(payload, true);

  // Send email to customer
  await transporter.sendMail({
    from: `"CelestialGems" <${process.env.EMAIL_SERVER_USER}>`,
    to: payload.customer.email,
    subject: "Your CelestialGems Order Confirmation",
    html: customerHtml,
  });

  // Send email to admin
  await transporter.sendMail({
    from: `"CelestialGems Order System" <${process.env.EMAIL_SERVER_USER}>`,
    to: process.env.EMAIL_ADMIN,
    subject: `New Order Received from ${payload.customer.name}`,
    html: adminHtml,
  });
}

    