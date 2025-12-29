import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPaste } from '../services/api';

function ViewPaste() {
    const { id } = useParams();
    const [paste, setPaste] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [copyTextSuccess, setCopyTextSuccess] = useState('');
    const [copyLinkSuccess, setCopyLinkSuccess] = useState('');

    useEffect(() => {
        const fetchPaste = async () => {
            try {
                const data = await getPaste(id);
                setPaste(data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load paste');
            } finally {
                setLoading(false);
            }
        };

        fetchPaste();
    }, [id]);

    const copyContent = async () => {
        if (paste) {
            try {
                await navigator.clipboard.writeText(paste.content);
                setCopyTextSuccess('Copied!');
                setTimeout(() => setCopyTextSuccess(''), 2000);
            } catch (err) {
                setCopyTextSuccess('Failed');
            }
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopyLinkSuccess('Copied!');
            setTimeout(() => setCopyLinkSuccess(''), 2000);
        } catch (err) {
            setCopyLinkSuccess('Failed');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    if (error) {
        return (
            <div className="card">
                <div className="alert error">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <Link to="/" className="back-link">Create New Paste</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="header-actions">
                <h1>Paste View</h1>
                <div className="action-buttons">
                    <button onClick={copyLink} className="action-btn secondary">
                        {copyLinkSuccess || 'Copy Link'}
                    </button>
                    <button onClick={copyContent} className="action-btn primary">
                        {copyTextSuccess || 'Copy Text'}
                    </button>
                </div>
            </div>

            <div className="meta-info">
                {paste.expires_at && (
                    <span className="meta-tag">Expires: {new Date(paste.expires_at).toLocaleString()}</span>
                )}
                {paste.remaining_views !== null && (
                    <span className="meta-tag">Remaining Views: {paste.remaining_views}</span>
                )}
            </div>

            <div className="paste-content">
                <pre>{paste.content}</pre>
            </div>

            <div className="footer-actions">
                <Link to="/" className="back-link">Create New Paste</Link>
            </div>
        </div>
    );
}

export default ViewPaste;
