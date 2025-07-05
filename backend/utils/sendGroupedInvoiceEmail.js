const nodemailer = require("nodemailer");
const generateGroupedInvoicePDFBuffer = require("./generateGroupedInvoicePDFBuffer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your app password
  },
});

async function sendGroupedInvoiceEmail({
  recipientEmail,
  invoiceId,
  customerName,
  customerEmail,
  customerPhone,
  products,
  totalAmount,
}) {
  try {
    // 📄 Generate PDF buffer
    const pdfBuffer = await generateGroupedInvoicePDFBuffer({
      invoiceId,
      customerName,
      customerEmail,
      customerPhone,
      products,
      totalAmount,
    });

    const mailOptions = {
      from: `"Rohini Beauty Parlour" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `🧾 Invoice & Confirmation - Rohini Beauty Parlour [ID: ${invoiceId}]`,
      text: `Dear ${customerName},\n\nThank you for your purchase of ₹${totalAmount}.\nPlease find your invoice attached.\n\nFeel free to visit our store to collect your items or reach out with any queries.\n\nBest regards,\nRohini Beauty Parlour`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #d63384;">Thank You for Your Purchase, ${customerName}!</h2>
          <p>We're happy to confirm that we received your payment of <strong>₹${totalAmount}</strong>.</p>
          <p><strong>Invoice ID:</strong> ${invoiceId}<br/>
             <strong>Email:</strong> ${customerEmail}<br/>
             <strong>Phone:</strong> ${customerPhone}</p>
          <p>You can collect your items from Rohini Beauty Parlour at your convenience.</p>
          <p style="margin-top: 20px;">If you have any questions, feel free to reply to this email.</p>
          <p style="color: #555;">Warm regards,<br><strong>Rohini Beauty Parlour</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: "Invoice.pdf",
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Grouped invoice email sent successfully.");
  } catch (err) {
    console.error("❌ Error sending grouped invoice email:", err);
    throw err; // propagate error to caller
  }
}

module.exports = sendGroupedInvoiceEmail;
