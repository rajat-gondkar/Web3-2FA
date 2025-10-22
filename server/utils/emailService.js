import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Load environment variables (in case this module is imported before dotenv.config() in server.js)
dotenv.config();

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.error('⚠️ WARNING: SENDGRID_API_KEY is not set. Email functionality will not work.');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized successfully');
}

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

// Send OTP email using SendGrid
export const sendOTPEmail = async (email, otp) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key is not configured. Please set SENDGRID_API_KEY environment variable.');
    }

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER,
      subject: 'BlockQuest - Email Verification Code',
      html: getOTPEmailTemplate(otp),
      text: `Your BlockQuest verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`
    };

    const response = await sgMail.send(msg);
    console.log(`📧 Email sent successfully to ${email} via SendGrid`);
    console.log(`📊 Response status: ${response[0].statusCode}`);
    
    return { 
      success: true, 
      messageId: response[0].headers['x-message-id'],
      statusCode: response[0].statusCode 
    };
  } catch (error) {
    console.error(`❌ Email sending failed to ${email}:`, {
      message: error.message,
      code: error.code,
      response: error.response?.body
    });
    
    // Provide more helpful error messages based on SendGrid errors
    let errorMessage = 'Failed to send email';
    
    if (error.code === 401 || error.code === 403) {
      errorMessage = 'SendGrid authentication failed. Please check your SENDGRID_API_KEY.';
    } else if (error.code === 400) {
      errorMessage = 'Invalid email configuration. Please verify sender email is verified in SendGrid.';
    } else if (error.message.includes('API key')) {
      errorMessage = 'SendGrid API key is missing or invalid.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Generate random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
