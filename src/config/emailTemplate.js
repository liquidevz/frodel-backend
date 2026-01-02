export const createEmailTemplate = (enquirySlug, message, uploadedFiles) => {
  const logoUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const companyName = process.env.COMPANY_NAME || 'Frozen Food Directory';
  const companyEmail = process.env.COMPANY_EMAIL || 'info@frozenfood.com';
  const companyPhone = process.env.COMPANY_PHONE || '+91 1234567890';
  const companyAddress = process.env.COMPANY_ADDRESS || 'India';

  const filesSection = uploadedFiles && uploadedFiles.length > 0
    ? `
      <!-- Files Section -->
      <tr>
        <td style="padding: 0 30px 20px 30px;">
          <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Attached Files</h3>
          ${uploadedFiles
            .map(
              (file, index) => `
            <div style="background-color: #f3f4f6; border-left: 4px solid #2563eb; padding: 12px 15px; margin-bottom: ${index < uploadedFiles.length - 1 ? '10px' : '0'}; border-radius: 4px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <p style="margin: 0 0 4px 0; font-weight: 600; color: #1f2937; font-size: 14px;">${file.name}</p>
                    <p style="margin: 0; color: #6b7280; font-size: 13px;">Size: ${file.size}</p>
                  </td>
                  <td style="text-align: right; vertical-align: middle; padding-left: 15px;">
                    ${file.url ? `<a href="${file.url}" style="background-color: #2563eb; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 600; display: inline-block;">Download</a>` : '<span style="color: #9ca3af; font-size: 13px;">Processing...</span>'}
                  </td>
                </tr>
              </table>
            </div>
          `
            )
            .join('')}
        </td>
      </tr>
    `
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry Reply - ${companyName}</title>
  <style type="text/css">
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background-color: #f9fafb; }
    table { border-collapse: collapse; }
    img { max-width: 100%; height: auto; display: block; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
              <img src="${logoUrl}/logo.png" alt="${companyName} Logo" style="max-width: 140px; height: auto; margin-bottom: 12px; display: inline-block;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Response to Your Enquiry</h1>
            </td>
          </tr>

          <!-- Reference Section -->
          <tr>
            <td style="padding: 30px; border-bottom: 1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Enquiry Reference</p>
                    <p style="color: #1f2937; margin: 0; font-size: 16px; font-weight: 700; font-family: 'Courier New', monospace;">${enquirySlug}</p>
                  </td>
                  <td style="text-align: right;">
                    <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Date</p>
                    <p style="color: #1f2937; margin: 0; font-size: 14px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #1f2937; margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">Your Response</h2>
              <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 14px;">Below is the detailed information regarding your enquiry:</p>
              
              <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 6px; margin: 20px 0; color: #1e40af; line-height: 1.7; font-size: 15px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </td>
          </tr>

          ${filesSection}

          <!-- Additional Info -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f3f4f6; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                <strong>Need clarification?</strong> Please reply to this email or contact us directly at <a href="mailto:${companyEmail}">${companyEmail}</a>. We're here to help!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 40px 30px; text-align: center; color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 15px 0; font-weight: 700; font-size: 18px; letter-spacing: -0.5px;">${companyName}</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 0 10px; text-align: center;">
                          <p style="margin: 0 0 8px 0; color: #d1d5db; font-size: 13px;">
                            <span style="color: #9ca3af;">📧</span> <a href="mailto:${companyEmail}" style="color: #60a5fa; text-decoration: none;">${companyEmail}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 10px; text-align: center;">
                          <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px;">
                            <span style="color: #9ca3af;">📞</span> ${companyPhone}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 10px; text-align: center;">
                          <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                            <span style="color: #9ca3af;">📍</span> ${companyAddress}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Legal Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #111827; border-top: 1px solid #374151;">
              <p style="margin: 0; color: #6b7280; font-size: 11px; line-height: 1.5;">
                This email was sent in response to your enquiry with ${companyName}. If you did not expect this email, please contact us immediately. 
                <br><br>
                <a href="#" style="color: #60a5fa; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #60a5fa; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #60a5fa; text-decoration: none;">Terms of Service</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};