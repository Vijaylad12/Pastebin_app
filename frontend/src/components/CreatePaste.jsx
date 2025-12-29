import { useState } from 'react';
import { createPaste } from '../services/api';

function CreatePaste() {
    const [content, setContent] = useState('');
    const [ttlSeconds, setTtlSeconds] = useState('');
    const [maxViews, setMaxViews] = useState('');
    const [pasteUrl, setPasteUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPasteUrl('');
        setCopySuccess('');
        setLoading(true);

        try {
            if (!content.trim()) {
                throw new Error('Content is required');
            }

            const data = {
                content,
                ttl_seconds: ttlSeconds ? parseInt(ttlSeconds, 10) : undefined,
                max_views: maxViews ? parseInt(maxViews, 10) : undefined,
            };

            const response = await createPaste(data);
            // Construct frontend URL
            const frontendUrl = `${window.location.origin}/p/${response.id}`;
            setPasteUrl(frontendUrl);
            setContent('');
            setTtlSeconds('');
            setMaxViews('');
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to create paste');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(pasteUrl);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            setCopySuccess('Failed to copy');
        }
    };

    return (
        <div className="card">
            <h1>Pastebin Lite</h1>

            {error && <div className="alert error">{error}</div>}
            {pasteUrl && (
                <div className="alert success">
                    <p>Paste created!</p>
                    <div className="link-container">
                        <a href={pasteUrl} target="_blank" rel="noopener noreferrer">{pasteUrl}</a>
                        <button onClick={copyToClipboard} className="copy-btn">
                            {copySuccess || 'Copy Link'}
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your text here..."
                        rows={10}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="ttl">Expires In (seconds)</label>
                        <input
                            type="number"
                            id="ttl"
                            value={ttlSeconds}
                            onChange={(e) => setTtlSeconds(e.target.value)}
                            placeholder="Optional"
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxViews">Max Views</label>
                        <input
                            type="number"
                            id="maxViews"
                            value={maxViews}
                            onChange={(e) => setMaxViews(e.target.value)}
                            placeholder="Optional"
                            min="1"
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Creating...' : 'Create Paste'}
                </button>
            </form>
        </div>
    );
}

export default CreatePaste;
