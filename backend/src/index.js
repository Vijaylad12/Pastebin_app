const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const escapeHtml = require('escape-html');
const pasteRoutes = require('./routes/paste');
const { getPaste, healthCheck, connectDB } = require('./services/db');
const { getCurrentTime, isPasteExpired } = require('./utils/paste-utils');

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api', pasteRoutes);

// HTML View Route
app.get('/p/:id', async (req, res) => {
  const { id } = req.params;
  const now = getCurrentTime(req);

  const paste = await getPaste(id);

  const notFoundHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Paste Not Found</title>
        <style>body { font-family: sans-serif; text-align: center; padding: 50px; }</style>
      </head>
      <body>
        <h1>404 - Paste Not Found or Expired</h1>
        <p>The paste you are looking for does not exist or has expired.</p>
        <a href="${process.env.FRONTEND_URL}">Create a new paste</a>
      </body>
    </html>
  `;

  if (!paste || isPasteExpired(paste, now)) {
    return res.status(404).send(notFoundHtml);
  }

  // Do NOT increment view count for HTML view as per requirements

  const safeContent = escapeHtml(paste.content);
  const createdDate = new Date(paste.createdAt).toLocaleString();
  const expiresDate = paste.expiresAt ? new Date(paste.expiresAt).toLocaleString() : 'Never';
  const views = paste.viewCount;
  const maxViews = paste.maxViews !== null ? paste.maxViews : 'Unlimited';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Paste ${id}</title>
        <style>
          body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
          .meta { background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 20px; font-size: 0.9em; color: #555; }
          .content { background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 5px; white-space: pre-wrap; overflow-x: auto; font-family: monospace; }
          .footer { margin-top: 20px; text-align: center; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="meta">
          <strong>Created:</strong> ${createdDate} | 
          <strong>Expires:</strong> ${expiresDate} | 
          <strong>Views:</strong> ${views} / ${maxViews}
        </div>
        <div class="content">${safeContent}</div>
        <div class="footer">
          <a href="${process.env.FRONTEND_URL}">Create your own paste</a>
        </div>
      </body>
    </html>
  `;

  res.send(html);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
