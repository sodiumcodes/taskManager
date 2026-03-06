import { useState } from 'react';

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Personal');
    const [priority, setPriority] = useState('Low');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            await onAdd({
                title: title.trim(),
                category,
                status: 'Not Started',
                priority,
            });
            setTitle('');
            setCategory('Personal');
            setPriority('Low');
            onClose();
        } catch (err) {
            // error handled by parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                animation: 'overlayFadeIn 0.2s ease-out',
            }}
        >
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '480px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-lg)',
                    animation: 'modalSlideUp 0.3s ease-out',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Create New Task
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Add a task to your workflow
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(148, 163, 184, 0.1)',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            fontFamily: 'inherit',
                            transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.15)';
                            e.currentTarget.style.color = 'var(--color-danger)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {/* Title */}
                    <div style={{ marginBottom: '18px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                marginBottom: '6px',
                            }}
                        >
                            Task Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What do you need to do?"
                            required
                            autoFocus
                            className="input"
                        />
                    </div>

                    {/* Category & Priority row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    marginBottom: '6px',
                                }}
                            >
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="select"
                            >
                                <option value="Personal">🏠 Personal</option>
                                <option value="Study">📚 Study</option>
                                <option value="Work">💼 Work</option>
                            </select>
                        </div>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    marginBottom: '6px',
                                }}
                            >
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="select"
                            >
                                <option value="Low">🟢 Low</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="High">🔴 High</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !title.trim()}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" />
                                </svg>
                                Creating...
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Create Task
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
