// Quick SendGrid API key tester
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const testSendGrid = async () => {
  try {
    console.log('Testing SendGrid configuration...\n');
    
    // Check if API key exists
    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY is not set in .env file');
      return;
    }
    
    console.log('✅ API Key found in .env');
    console.log(`📝 Key format: ${process.env.SENDGRID_API_KEY.substring(0, 10)}...`);
    console.log(`📝 Key length: ${process.env.SENDGRID_API_KEY.length} characters\n`);
    
    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid initialized\n');
    
    // Try to send a test email
    console.log('📧 Attempting to send test email...');
    
    const msg = {
      to: process.env.EMAIL_USER || 'rajat.contacts05@gmail.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'rajat.contacts05@gmail.com',
      subject: 'SendGrid Test Email',
      text: 'This is a test email from Auth3',
      html: '<strong>This is a test email from Auth3</strong>',
    };
    
    const response = await sgMail.send(msg);
    
    console.log('✅ Email sent successfully!');
    console.log(`📊 Status Code: ${response[0].statusCode}`);
    console.log(`📬 Message ID: ${response[0].headers['x-message-id']}`);
    console.log('\n🎉 SendGrid is configured correctly!');
    
  } catch (error) {
    console.error('\n❌ SendGrid Test Failed:');
    console.error(`Error Code: ${error.code}`);
    console.error(`Error Message: ${error.message}`);
    
    if (error.response) {
      console.error('Response Body:', JSON.stringify(error.response.body, null, 2));
    }
    
    console.log('\n🔍 Troubleshooting:');
    
    if (error.code === 401 || error.code === 403) {
      console.log('- API key is invalid or revoked');
      console.log('- Generate a new API key at: https://app.sendgrid.com/settings/api_keys');
      console.log('- Make sure to select "Full Access" or "Mail Send" permissions');
    } else if (error.code === 400) {
      console.log('- Sender email is not verified in SendGrid');
      console.log('- Verify at: https://app.sendgrid.com/settings/sender_auth');
      console.log(`- Current FROM email: ${process.env.SENDGRID_FROM_EMAIL}`);
    }
  }
};

console.log('🚀 Auth3 SendGrid Tester\n');
console.log('========================================\n');

testSendGrid();
