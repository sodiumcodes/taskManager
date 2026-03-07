import { useState } from 'react';

const EditTaskModal = ({ isOpen, onClose, task, onSave }) => {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [category, setCategory] = useState(task?.category || 'Personal');
    const [priority, setPriority] = useState(task?.priority || 'Low');
    const [status, setStatus] = useState(task?.status || 'Not Started');
    const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !task) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            await onSave(task._id, {
                title: title.trim(),
                description: description.trim(),
                category,
                status,
                priority,
                ...(dueDate ? { dueDate } : {}),
            });
            onClose();
        } catch (err) {
            // handled by parent
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
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                }}
            />

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
                {/* Gradient accent */}
                <div style={{ height: '3px', background: 'linear-gradient(90deg, #60a5fa, #818cf8, #a78bfa)', backgroundSize: '200% 100%', animation: 'gradient-shift 3s ease-in-out infinite' }} />

                {/* Header */}
                <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                            Edit Task
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                            Update task details
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                            background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
                            fontSize: '1rem', fontFamily: 'inherit', transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-danger-dim)'; e.currentTarget.style.color = 'var(--color-danger)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {/* Title */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Task Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            className="input"
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Notes <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details or notes..."
                            rows={3}
                            className="input"
                            style={{ resize: 'vertical', minHeight: '60px' }}
                        />
                    </div>

                    {/* Category & Priority */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="select">
                                <option value="Personal">🏠 Personal</option>
                                <option value="Study">📚 Study</option>
                                <option value="Work">💼 Work</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="select">
                                <option value="Low">🟢 Low</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="High">🔴 High</option>
                            </select>
                        </div>
                    </div>

                    {/* Status & Due Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="select">
                                <option value="Not Started">Not Started</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="input"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1, padding: '12px' }}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className="btn btn-primary"
                            style={{ flex: 2, padding: '12px', fontSize: '0.95rem' }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Saving...
                                </span>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
