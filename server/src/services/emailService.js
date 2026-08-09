const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, using ethereal email (fake SMTP)
  // In production, replace with real SMTP credentials (Gmail, SendGrid, etc.)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'test@ethereal.email',
      pass: process.env.EMAIL_PASS || 'test123'
    }
  });
};

// For Gmail (uncomment and use in production):
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS // Use App Password, not regular password
//   }
// });

// Send order confirmation email to customer
const sendOrderConfirmationEmail = async (order, customerEmail) => {
  try {
    const transporter = createTransporter();

    // Calculate total items
    const totalItems = order.orderItems.reduce((sum, item) => sum + item.qty, 0);

    // Create email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .order-item { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
          .order-item:last-child { border-bottom: none; }
          .total-section { background: #fff3f0; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .price-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .total-row { font-size: 18px; font-weight: bold; padding-top: 15px; border-top: 2px solid #e91e63; }
          .shipping-address { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { background: #e91e63; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for shopping with Nykaa</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px;">Hi ${order.shippingAddress.name || 'Valued Customer'},</p>
            <p>Your order has been successfully placed! We're excited to get your products to you.</p>
            
            <div class="order-info">
              <h2 style="margin-top: 0; color: #e91e63;">Order Details</h2>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            </div>

            <div class="order-info">
              <h3 style="margin-top: 0; color: #e91e63;">Items Ordered (${totalItems})</h3>
              ${order.orderItems.map(item => `
                <div class="order-item">
                  <div>
                    <strong>${item.name}</strong><br>
                    <span style="color: #666;">Quantity: ${item.qty}</span>
                  </div>
                  <div style="text-align: right;">
                    <strong style="color: #e91e63;">₹${item.price}</strong>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="total-section">
              <h3 style="margin-top: 0; color: #e91e63;">Price Summary</h3>
              <div class="price-row">
                <span>Subtotal (${totalItems} items):</span>
                <span>₹${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div class="price-row">
                <span>Tax:</span>
                <span>₹${order.taxPrice.toFixed(2)}</span>
              </div>
              <div class="price-row">
                <span>Shipping:</span>
                <span>₹${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div class="price-row total-row">
                <span>Total:</span>
                <span style="color: #e91e63;">₹${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div class="shipping-address">
              <h3 style="margin-top: 0; color: #e91e63;">📍 Shipping Address</h3>
              <p style="margin: 5px 0;">${order.shippingAddress.address}</p>
              <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
              <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
              ${order.shippingAddress.phone ? `<p style="margin: 5px 0;">📞 ${order.shippingAddress.phone}</p>` : ''}
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; color: #666;">Track your order status anytime from your account.</p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/profile" class="button">View Order Status</a>
            </div>
          </div>

          <div class="footer">
            <p>💝 Thank you for shopping with Nykaa!</p>
            <p>If you have any questions, please contact us at support@nykaa.com</p>
            <p style="color: #999; margin-top: 20px;">© ${new Date().getFullYear()} Nykaa E-Retail Limited. All Rights Reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Nykaa - Beauty Shopping" <${process.env.EMAIL_USER || 'noreply@nykaa.com'}>`,
      to: customerEmail,
      subject: `Order Confirmation - Order #${order._id}`,
      html: emailHTML,
      text: `
        Order Confirmation
        
        Hi ${order.shippingAddress.name || 'Customer'},
        
        Your order has been successfully placed!
        
        Order ID: ${order._id}
        Order Date: ${new Date(order.createdAt).toLocaleDateString()}
        Total Amount: ₹${order.totalPrice.toFixed(2)}
        
        Shipping Address:
        ${order.shippingAddress.address}
        ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
        ${order.shippingAddress.country}
        
        Thank you for shopping with Nykaa!
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    console.log('Preview URL (Ethereal):', nodemailer.getTestMessageUrl(info));
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send order notification to admin
const sendAdminOrderNotification = async (order, customerEmail) => {
  try {
    const transporter = createTransporter();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nykaa.com';

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e91e63; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #e91e63; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🛍️ New Order Received!</h2>
          </div>
          <div class="content">
            <div class="info-box">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Customer Email:</strong> ${customerEmail}</p>
              <p><strong>Total Amount:</strong> ₹${order.totalPrice.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            </div>
            <div class="info-box">
              <h3>Shipping Address</h3>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
              <p>${order.shippingAddress.country}</p>
              <p>Phone: ${order.shippingAddress.phone}</p>
            </div>
            <div class="info-box">
              <h3>Items (${order.orderItems.length})</h3>
              ${order.orderItems.map(item => `
                <p>• ${item.name} (Qty: ${item.qty}) - ₹${item.price}</p>
              `).join('')}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Nykaa System" <${process.env.EMAIL_USER || 'system@nykaa.com'}>`,
      to: adminEmail,
      subject: `New Order #${order._id} - ₹${order.totalPrice.toFixed(2)}`,
      html: emailHTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendAdminOrderNotification
};
