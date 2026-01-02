import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const emailSignature = `
<div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
  <p style="margin: 0; font-weight: 600; color: #1f2937;">Best Regards,</p>
  <p style="margin: 5px 0; font-weight: 600; color: #2563eb;">${process.env.COMPANY_NAME || 'Frozen Food Directory'}</p>
  <p style="margin: 5px 0; color: #6b7280;">${process.env.COMPANY_EMAIL || 'info@frozenfood.com'}</p>
  <p style="margin: 5px 0; color: #6b7280;">${process.env.COMPANY_PHONE || '+91 1234567890'}</p>
  <p style="margin: 5px 0; color: #6b7280;">${process.env.COMPANY_ADDRESS || 'India'}</p>
</div>
`;
