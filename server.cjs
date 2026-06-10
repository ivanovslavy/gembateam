const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

const PORT = process.env.PORT || 3082;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
const SITE_NAME = process.env.SITE_NAME || 'Website';

app.use(express.json({ limit: '1mb' }));

// Rate limiting (simple in-memory)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 submissions per hour per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return true;
  }
  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

// Clean up rate limit map every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap) {
    if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

// Verify Turnstile token
async function verifyTurnstile(token, ip) {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verification error:', err);
    return false;
  }
}

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((err) => {
  if (err) {
    console.error('SMTP connection error:', err.message);
    console.log('Contact form emails will fail until SMTP is configured correctly.');
  } else {
    console.log('SMTP connection verified successfully.');
  }
});

// Auto-reply HTML (bilingual EN + BG)
function autoReplyHtml(kind, name) {
  const safeName = escapeHtml(name);
  const introEn = kind === 'career'
    ? 'Thank you for your application. We have received your details and our team will review them shortly.'
    : 'Thank you for contacting GEMBA Team. We have received your message.';
  const introBg = kind === 'career'
    ? 'Благодарим Ви за кандидатурата. Получихме Вашите данни и нашият екип ще ги разгледа в най-кратък срок.'
    : 'Благодарим Ви, че се свързахте с GEMBA Team. Получихме Вашето съобщение.';
  const followEn = kind === 'career'
    ? 'Our HR team will review your application within 5–7 business days.'
    : 'We will get back to you within 1–3 business days.';
  const followBg = kind === 'career'
    ? 'Нашият HR екип ще разгледа Вашата кандидатура в рамките на 5–7 работни дни.'
    : 'Ще се свържем с Вас в рамките на 1–3 работни дни.';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #222;">
      <p>Dear ${safeName},</p>
      <p>${introEn}</p>
      <p>${followEn}</p>
      <p style="margin-top: 24px;">Kind regards,<br/>GEMBA Team</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p>Уважаеми/а ${safeName},</p>
      <p>${introBg}</p>
      <p>${followBg}</p>
      <p style="margin-top: 24px;">С уважение,<br/>GEMBA Team</p>
      <p style="margin-top: 24px; font-size: 12px; color: #999;">
        <a href="https://gembateam.com" style="color: #4F46E5;">gembateam.com</a>
        — This is an automated confirmation. Please do not reply to this email.
      </p>
    </div>
  `;
}

function sendAutoReply(kind, to, name) {
  const subject = kind === 'career'
    ? 'Thank you for your application — GEMBA Team'
    : 'Thank you for contacting GEMBA Team';
  transporter.sendMail({
    from: `"GEMBA Team" <${SMTP_USER}>`,
    to,
    subject,
    html: autoReplyHtml(kind, name),
  }).catch((err) => console.error('Auto-reply failed:', err));
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Rate limit
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { name, email, subject, message, turnstileToken } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Verify Turnstile
  if (!turnstileToken) {
    return res.status(400).json({ error: 'Turnstile verification required.' });
  }

  const turnstileValid = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileValid) {
    return res.status(403).json({ error: 'Turnstile verification failed.' });
  }

  // Send email
  try {
    await transporter.sendMail({
      from: `"GEMBA Team Contact" <${SMTP_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: subject ? `[Contact Form] ${subject}` : `[Contact Form] Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #4F46E5;">New Contact — GEMBA Team</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #666; width: 100px;">Name:</td>
              <td style="padding: 8px;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #666;">Email:</td>
              <td style="padding: 8px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            ${subject ? `<tr>
              <td style="padding: 8px; font-weight: bold; color: #666;">Subject:</td>
              <td style="padding: 8px;">${escapeHtml(subject)}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <p style="margin-top: 16px; font-size: 12px; color: #999;">
            Sent from gembateam.com contact form · IP: ${ip}
          </p>
        </div>
      `,
    });

    sendAutoReply('contact', email, name);

    return res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// CV / Career form endpoint
app.post('/api/career', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { name, email, message, turnstileToken } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (!turnstileToken) {
    return res.status(400).json({ error: 'Turnstile verification required.' });
  }

  const turnstileValid = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileValid) {
    return res.status(403).json({ error: 'Turnstile verification failed.' });
  }

  try {
    await transporter.sendMail({
      from: `"GEMBA Team Careers" <${SMTP_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[Career Application] ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #06B6D4;">New Career Application — GEMBA Team</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #666; width: 100px;">Name:</td>
              <td style="padding: 8px;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #666;">Email:</td>
              <td style="padding: 8px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
          </table>
          ${message ? `<div style="margin-top: 16px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>` : ''}
          <p style="margin-top: 16px; font-size: 12px; color: #999;">
            Sent from gembateam.com careers form · IP: ${ip}
          </p>
        </div>
      `,
    });

    sendAutoReply('career', email, name);

    return res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send application. Please try again.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend API running on port ${PORT}`);
});
