import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration - should be in environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    let emailContent;

    switch (type) {
      case 'admin_signup_notification':
        emailContent = {
          from: `"LearnHub" <${process.env.SMTP_USER}>`,
          to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          subject: `New User Signup - Approval Required: ${data.name}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
                  .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
                  .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>New User Signup - Approval Required</h1>
                  </div>
                  <div class="content">
                    <p>Hello Admin,</p>
                    <p>A new user has signed up and requires your approval:</p>
                    <div class="info-box">
                      <p><strong>Name:</strong> ${data.name}</p>
                      <p><strong>Email:</strong> ${data.email}</p>
                      <p><strong>Signup Date:</strong> ${new Date(data.signupDate).toLocaleString()}</p>
                    </div>
                    <p>Please review and approve this user in the admin dashboard.</p>
                    <p style="margin-top: 30px;">
                      <a href="${data.dashboardUrl}" class="button">Go to Admin Dashboard</a>
                    </p>
                  </div>
                  <div class="footer">
                    <p>This is an automated notification from LearnHub</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        };
        break;

      case 'course_purchase':
        emailContent = {
          from: `"LearnHub" <${process.env.SMTP_USER}>`,
          to: to,
          subject: `Course Purchase Confirmation: ${data.courseTitle}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
                  .zoom-box { background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196f3; }
                  .zoom-link { display: inline-block; padding: 12px 30px; background: #2196f3; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; }
                  .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Course Purchase Confirmation</h1>
                  </div>
                  <div class="content">
                    <p>Hello ${data.userName},</p>
                    <p>Thank you for your purchase! Your course has been successfully added to your account.</p>
                    <div class="info-box">
                      <h3>Course Details</h3>
                      <p><strong>Course:</strong> ${data.courseTitle}</p>
                      <p><strong>Instructor:</strong> ${data.instructor}</p>
                      <p><strong>Price:</strong> $${data.totalAmount.toFixed(2)}</p>
                      <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
                    </div>
                    <div class="zoom-box">
                      <h3 style="margin-top: 0;">Join Your Live Classes</h3>
                      <p>Use the Zoom link below to join your daily classes:</p>
                      <p style="text-align: center;">
                        <a href="${data.zoomLink}" class="zoom-link" target="_blank">Join Zoom Class</a>
                      </p>
                      <p style="font-size: 14px; color: #666; margin-top: 15px;">
                        <strong>Zoom Link:</strong><br>
                        <a href="${data.zoomLink}" style="color: #2196f3; word-break: break-all;">${data.zoomLink}</a>
                      </p>
                      <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        Please save this link for future reference. You'll use it to access all your class sessions.
                      </p>
                    </div>
                    <p style="margin-top: 30px;">
                      You can access your course and view all your enrolled courses in your dashboard.
                    </p>
                  </div>
                  <div class="footer">
                    <p>This is an automated confirmation email from LearnHub</p>
                    <p>If you have any questions, please contact our support team.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    await transporter.sendMail(emailContent);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}

