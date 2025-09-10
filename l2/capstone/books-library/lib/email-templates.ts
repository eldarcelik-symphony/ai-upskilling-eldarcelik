/**
 * Email Templates for Book Library
 * 
 * This file contains email templates used throughout the application.
 * Note: Supabase verification emails are configured directly in the Supabase dashboard
 * and use the templates defined here as reference.
 */

export const emailTemplates = {
  /**
   * Supabase Email Verification Template
   * 
   * This template is used in the Supabase Auth settings for email verification.
   * The {{ .ConfirmationURL }} placeholder is automatically replaced by Supabase.
   * 
   * Subject: "Verify Your Email Address"
   */
  supabaseEmailVerification: {
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; margin-bottom: 20px;">Welcome to the Book Library!</h2>
        
        <p>Hello,</p>
        
        <p>Thank you for registering with our Book Library! To complete your account setup, please verify your email address by clicking the button below.</p>
        
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Next Steps:</h3>
          <ol style="color: #1e40af; margin: 0; padding-left: 20px;">
            <li>Click the verification button below</li>
            <li>Wait for admin approval (you'll receive an email when approved)</li>
            <li>Start browsing and borrowing books!</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{ .ConfirmationURL }}" 
            style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This email was sent from the Book Library system. If you have any questions, please contact our support team.
        </p>
      </div>
    `,
  },
} as const;
