const { nanoid } = require('nanoid');

const generatePasteId = () => {
    return nanoid(10);
};

const getCurrentTime = (req) => {
    if (process.env.TEST_MODE === '1' && req && req.headers['x-test-now-ms']) {
        const testTime = parseInt(req.headers['x-test-now-ms'], 10);
        if (!isNaN(testTime)) {
            return testTime;
        }
    }
    return Date.now();
};

const isPasteExpired = (paste, currentTime) => {
    if (!paste) return true;

    // Check TTL
    if (paste.expiresAt && currentTime >= paste.expiresAt) {
        return true;
    }

    // Check Max Views
    if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
        return true;
    }

    return false;
};

module.exports = {
    generatePasteId,
    getCurrentTime,
    isPasteExpired
};
