/**
 * Guest Notification Module
 * Sends SMS and/or email to guests when their booking status changes
 * Supports Twilio (SMS) and Nodemailer (Email)
 */

// Initialize Twilio if credentials are available
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (e) {
    console.error('Twilio not available or not installed:', e.message);
  }
}

// Initialize nodemailer if credentials are available.
// If SMTP is not configured, use an Ethereal test account so the flow can still be verified.
let emailTransporter = null;
let nodemailerModule = null;

async function initEmailTransporter() {
  if (emailTransporter) return emailTransporter;

  try {
    nodemailerModule = nodemailerModule || require('nodemailer');
  } catch (error) {
    console.warn('Email notifications disabled: nodemailer is not installed.');
    return null;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    emailTransporter = nodemailerModule.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return emailTransporter;
  }

  try {
    const testAccount = await nodemailerModule.createTestAccount();
    emailTransporter = nodemailerModule.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Email notifications using Ethereal test account:', testAccount.user);
    return emailTransporter;
  } catch (error) {
    console.warn('Email notifications disabled: unable to create test account.', error.message || error);
    return null;
  }
}

/**
 * Send SMS to guest using Twilio
 * @param {string} phoneNumber - Guest phone number (E.164 format: +919876543210)
 * @param {string} message - Message body
 * @returns {Promise<boolean>} true if sent, false if Twilio unavailable
 */
async function sendSMS(phoneNumber, message) {
  if (!twilioClient || !process.env.TWILIO_PHONE_FROM) {
    console.warn('SMS: Twilio not configured. Skipping SMS.');
    return false;
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_FROM,
      to: phoneNumber,
    });
    console.log(`SMS sent to ${phoneNumber}`);
    return true;
  } catch (err) {
    console.error(`Failed to send SMS to ${phoneNumber}:`, err.message || err);
    return false;
  }
}

/**
 * Send email to guest
 * @param {string} email - Guest email address
 * @param {string} subject - Email subject
 * @param {string} htmlBody - HTML email body
 * @returns {Promise<boolean>} true if sent, false if email not configured
 */
async function sendEmail(email, subject, htmlBody) {
  const transporter = await initEmailTransporter();
  if (!transporter) {
    console.warn('Email: SMTP/test transport not configured. Skipping email.');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      html: htmlBody,
    });
    console.log(`Email sent to ${email} (subject: ${subject})`);
    if (info && typeof nodemailerModule?.getTestMessageUrl === 'function') {
      const previewUrl = nodemailerModule.getTestMessageUrl(info);
      if (previewUrl) console.log('Email preview URL:', previewUrl);
    }
    return true;
  } catch (err) {
    console.error(`Failed to send email to ${email}:`, err.message || err);
    return false;
  }
}

/**
 * Notify guest of booking approval
 * @param {Object} booking - Booking document with guest info
 * @param {Object} resort - Resort/owner info (name, email)
 */
async function notifyBookingApproved(booking, resort) {
  if (!booking.guest) {
    console.warn('No guest info on booking. Skipping guest notification.');
    return;
  }

  const { name: guestName, phone: guestPhone, email: guestEmail } = booking.guest;
  const roomType = booking.roomType || 'Your room';
  const checkIn = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'TBD';
  const checkOut = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'TBD';
  const resortName = resort?.businessName || resort?.name || 'Our Resort';

  // SMS content
  const smsMessage = `Hi ${guestName}, your booking at ${resortName} has been approved! 
Room: ${roomType}
Check-in: ${checkIn}
Check-out: ${checkOut}
We look forward to your stay!`;

  // Email content
  const emailHtml = `
    <h2>Booking Approved!</h2>
    <p>Hi ${guestName},</p>
    <p>Great news! Your booking at <strong>${resortName}</strong> has been approved.</p>
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Booking Details:</strong></p>
      <p><strong>Room Type:</strong> ${roomType}</p>
      <p><strong>Check-in:</strong> ${checkIn}</p>
      <p><strong>Check-out:</strong> ${checkOut}</p>
      <p><strong>Total Nights:</strong> ${booking.totalNights || '?'}</p>
    </div>
    <p>If you have any questions, please contact us.</p>
    <p>We look forward to your stay!</p>
  `;

  // Send SMS if phone number is available
  if (guestPhone) {
    await sendSMS(guestPhone, smsMessage);
  }

  // Send email if email is available
  if (guestEmail) {
    await sendEmail(
      guestEmail,
      `${resortName} - Booking Approved`,
      emailHtml
    );
  }
}

/**
 * Notify guest of booking rejection
 * @param {Object} booking - Booking document
 * @param {Object} resort - Resort/owner info
 * @param {string} reason - Reason for rejection (optional)
 */
async function notifyBookingRejected(booking, resort, reason) {
  if (!booking.guest) {
    console.warn('No guest info on booking. Skipping guest notification.');
    return;
  }

  const { name: guestName, phone: guestPhone, email: guestEmail } = booking.guest;
  const roomType = booking.roomType || 'Your room';
  const resortName = resort?.businessName || resort?.name || 'Our Resort';

  // SMS content
  const smsMessage = `Hi ${guestName}, unfortunately your booking for ${roomType} at ${resortName} could not be confirmed. 
${reason ? `Reason: ${reason}` : 'Please contact us for more information.'}`;

  // Email content
  const emailHtml = `
    <h2>Booking Not Confirmed</h2>
    <p>Hi ${guestName},</p>
    <p>Unfortunately, we are unable to confirm your booking for <strong>${roomType}</strong> at <strong>${resortName}</strong>.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p>Please feel free to contact us to discuss alternative dates or options.</p>
  `;

  // Send SMS if phone number is available
  if (guestPhone) {
    await sendSMS(guestPhone, smsMessage);
  }

  // Send email if email is available
  if (guestEmail) {
    await sendEmail(
      guestEmail,
      `${resortName} - Booking Not Confirmed`,
      emailHtml
    );
  }
}

/**
 * Notify guest of booking cancellation
 * @param {Object} booking - Booking document
 * @param {Object} resort - Resort/owner info
 */
async function notifyBookingCancelled(booking, resort) {
  if (!booking.guest) {
    console.warn('No guest info on booking. Skipping guest notification.');
    return;
  }

  const { name: guestName, phone: guestPhone, email: guestEmail } = booking.guest;
  const resortName = resort?.businessName || resort?.name || 'Our Resort';

  // SMS content
  const smsMessage = `Hi ${guestName}, your booking at ${resortName} has been cancelled. If you have any questions, please contact us.`;

  // Email content
  const emailHtml = `
    <h2>Booking Cancelled</h2>
    <p>Hi ${guestName},</p>
    <p>Your booking at <strong>${resortName}</strong> has been cancelled.</p>
    <p>If this was unexpected or you have questions, please reach out to us.</p>
  `;

  // Send SMS if phone number is available
  if (guestPhone) {
    await sendSMS(guestPhone, smsMessage);
  }

  // Send email if email is available
  if (guestEmail) {
    await sendEmail(
      guestEmail,
      `${resortName} - Booking Cancelled`,
      emailHtml
    );
  }
}

module.exports = {
  sendSMS,
  sendEmail,
  notifyBookingApproved,
  notifyBookingRejected,
  notifyBookingCancelled,
};
