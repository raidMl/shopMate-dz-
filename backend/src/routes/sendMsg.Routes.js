const express = require("express");
const  createTransporter  = require("nodemailer").createTransport

const router = express.Router();

const transporter = createTransporter({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'raidreus.22@gmail.com',
    pass: 'ljmq noux anwy egic',
  },
});

// Contact form submission handler
async function sendContactEmail(req, res) {
  try {
    const { name, mail, subject, msgContent } = req.body;
    
    // Validate required fields
    if (!name || !mail || !subject || !msgContent) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }
    
    // Send email to admin
    const adminEmailInfo = await transporter.sendMail({
      from: '"ShopMate Store 🛒" <shopemate.dz@gmail.com>',
      to: 'shopemate.dz@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6ee7b7, #3b82f6); padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">From:</strong> 
              <span style="color: #6b7280;">${name} &lt;${mail}&gt;</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">Subject:</strong> 
              <span style="color: #6b7280;">${subject}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">Date:</strong> 
              <span style="color: #6b7280;">${new Date().toLocaleString()}</span>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #3b82f6;">
              <strong style="color: #374151; display: block; margin-bottom: 10px;">Message:</strong>
              <div style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${msgContent}</div>
            </div>
          </div>
          
          <div style="background: #f1f5f9; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              This message was sent from the ShopMate contact form
            </p>
          </div>
        </div>
      `
    });
    
    // Send confirmation email to customer
    const customerEmailInfo = await transporter.sendMail({
      from: '"ShopMate Store 🛒" <shopemate.dz@gmail.com>',
      to: mail,
      subject: `Thank you for contacting ShopMate - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6ee7b7, #3b82f6); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">Thank You for Contacting Us!</h2>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
            <p style="color: #374151; margin-bottom: 15px;">Dear ${name},</p>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Thank you for reaching out to ShopMate! We have received your message and will get back to you within 24 hours during business days.
            </p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981; margin-bottom: 20px;">
              <h4 style="color: #374151; margin: 0 0 10px 0;">Your Message Summary:</h4>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              In the meantime, feel free to browse our products or check out our FAQ section for immediate answers to common questions.
            </p>
          </div>
          
          <div style="background: #f1f5f9; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
              Best regards,<br>
              The ShopMate Team
            </p>
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              📧 shopemate.dz@gmail.com | 📱 (+213) 669453240
            </p>
          </div>
        </div>
      `
    });

    console.log("Admin email sent: %s", adminEmailInfo.messageId);
    console.log("Customer email sent: %s", customerEmailInfo.messageId);
    
    res.status(200).json({ 
      success: true, 
      message: "Message sent successfully",
      adminMessageId: adminEmailInfo.messageId,
      customerMessageId: customerEmailInfo.messageId
    });
    
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send email. Please try again later." 
    });
  }
}

router.route("/").post(sendContactEmail);

module.exports = router;