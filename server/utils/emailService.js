import nodemailer from 'nodemailer';

// Create reusable transporter with enhanced configuration for production
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // Use STARTTLS (port 587)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      // Do not fail on invalid certs (useful for some hosting providers)
      rejectUnauthorized: false
    },
    // Connection timeout
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,
    socketTimeout: 60000, // 60 seconds
    // Enable debug output in development
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  };

  // If service is specified (e.g., 'gmail'), use it for auto-configuration
  if (process.env.EMAIL_SERVICE) {
    config.service = process.env.EMAIL_SERVICE;
  }

  return nodemailer.createTransport(config);
};

// Generate OTP email HTML template
const getOTPEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: 'Arial', sans-serif; 
                background: #f4f4f4; 
                margin: 0;
                padding: 0;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: #ffffff; 
                border-radius: 10px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                overflow: hidden;
            }
            .header { 
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                padding: 30px; 
                text-align: center; 
            }
            .header h1 { 
                color: white; 
                margin: 0; 
                font-size: 28px;
            }
            .content { 
                padding: 40px; 
                text-align: center; 
            }
            .content h2 {
                color: #1f2937;
                margin-bottom: 20px;
            }
            .content p {
                color: #4b5563;
                font-size: 16px;
                line-height: 1.6;
            }
            .otp-code { 
                font-size: 36px; 
                font-weight: bold; 
                letter-spacing: 8px; 
                color: #6366f1; 
                background: #f3f4f6; 
                padding: 20px; 
                border-radius: 10px; 
                margin: 30px 0; 
                display: inline-block;
            }
            .footer { 
                padding: 20px; 
                text-align: center; 
                color: #6b7280; 
                font-size: 12px; 
                background: #f9fafb;
            }
            .security-note {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
            }
            .security-note p {
                margin: 5px 0;
                font-size: 14px;
                color: #78350f;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 BlockQuest</h1>
            </div>
            <div class="content">
                <h2>Verify Your Email</h2>
                <p>Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p>Enter this code to verify your email address.</p>
                <div class="security-note">
                    <p><strong>⚠️ Security Notice:</strong></p>
                    <p>• Never share this code with anyone</p>
                    <p>• BlockQuest will never ask for this code</p>
                    <p>• If you didn't request this code, please ignore this email</p>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2025 BlockQuest. All rights reserved.</p>
                <p>Blockchain-based Authentication Platform</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    // Verify transporter configuration (optional, can be commented out in production)
    if (process.env.NODE_ENV === 'development') {
      try {
        await transporter.verify();
        console.log('✅ Email server is ready to send messages');
      } catch (verifyError) {
        console.warn('⚠️ Email verification warning:', verifyError.message);
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'BlockQuest - Email Verification Code',
      html: getOTPEmailTemplate(otp),
      // Add text fallback
      text: `Your BlockQuest verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email sending failed to ${email}:`, {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to send email';
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      errorMessage = 'Email server connection timeout. Please check your email configuration.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your email credentials.';
    } else if (error.responseCode === 535) {
      errorMessage = 'Invalid email credentials. Please check EMAIL_USER and EMAIL_PASSWORD.';
    }
    
    throw new Error(errorMessage);
  }
};

// Generate random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
