const express = require('express');
const router = express.Router();
const { savePaste, getPaste, updatePaste, healthCheck } = require('../services/db');
const { generatePasteId, getCurrentTime, isPasteExpired } = require('../utils/paste-utils');

// Health Check
router.get('/healthz', async (req, res) => {
    const dbHealth = await healthCheck();
    res.json({ ok: dbHealth });
});

// Create Paste
router.post('/pastes', async (req, res) => {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
        return res.status(400).json({ error: 'ttl_seconds must be a positive integer' });
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
        return res.status(400).json({ error: 'max_views must be a positive integer' });
    }

    const id = generatePasteId();
    const now = getCurrentTime(req);

    const expiresAt = ttl_seconds ? now + (ttl_seconds * 1000) : null;
    const maxViews = max_views ? max_views : null;

    const paste = {
        id,
        content,
        createdAt: now,
        expiresAt,
        maxViews,
        viewCount: 0
    };

    await savePaste(paste);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.status(201).json({
        id,
        url: `${frontendUrl}/p/${id}`
    });
});

// Get Paste (JSON)
router.get('/pastes/:id', async (req, res) => {
    const { id } = req.params;
    const now = getCurrentTime(req);

    const paste = await getPaste(id);

    if (!paste) {
        return res.status(404).json({ error: 'Paste not found or expired' });
    }

    if (isPasteExpired(paste, now)) {
        return res.status(404).json({ error: 'Paste not found or expired' });
    }

    // Increment view count
    paste.viewCount += 1;
    await updatePaste(paste);

    // Check if expired after increment (e.g. if maxViews was reached)
    // Actually, requirement says "Paste expires if viewCount >= maxViews".
    // If maxViews is 1, viewCount becomes 1. Next time it's fetched, it's expired.
    // But for THIS response, it is valid.

    const remaining_views = paste.maxViews ? Math.max(0, paste.maxViews - paste.viewCount) : null;
    const expires_at = paste.expiresAt ? new Date(paste.expiresAt).toISOString() : null;

    res.json({
        content: paste.content,
        remaining_views,
        expires_at
    });
});

module.exports = router;
