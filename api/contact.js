const nodemailer = require('nodemailer');

// In-memory rate limit: 1 submission per IP per minute
const rateLimitMap = new Map();

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
    const now = Date.now();
    const lastSubmission = rateLimitMap.get(ip) || 0;
    if (now - lastSubmission < 60_000) {
        return res.status(429).json({ error: 'Too many requests. Please wait a minute before trying again.' });
    }
    rateLimitMap.set(ip, now);

    const { firstName, lastName, email, message } = req.body;

    // Required field validation
    if (!firstName || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email format validation
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    // Length limits
    if (firstName.length > 100 || (lastName && lastName.length > 100)) {
        return res.status(400).json({ error: 'Name too long' });
    }
    if (email.length > 254) {
        return res.status(400).json({ error: 'Email too long' });
    }
    if (message.length > 2000) {
        return res.status(400).json({ error: 'Message must be 2000 characters or fewer' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const safeName    = escapeHtml(`${firstName} ${lastName || ''}`.trim());
    const safeEmail   = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    try {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `New message from ${firstName} ${lastName || ''}`.trim(),
            text: `Name: ${firstName} ${lastName || ''}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Message:</strong></p>
                <p>${safeMessage}</p>
            `,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
};
