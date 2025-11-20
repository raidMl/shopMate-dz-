const express = require("express");
const  createTransporter  = require("nodemailer").createTransport
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

// Add CORS middleware for this route
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

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
    
    console.log('Contact form submission received:', { name, mail, subject });
    
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

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to your business email
      replyTo: mail, // Set reply-to as customer's email
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${mail}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${msgContent.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This message was sent from the ShopMate contact form.</em></p>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.json({ 
      success: true, 
      message: "Message sent successfully!",
      messageId: info.messageId
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