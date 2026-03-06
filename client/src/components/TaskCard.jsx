import { useState } from 'react';

const TaskCard = ({ task, onDelete, onUpdateStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newStatus, setNewStatus] = useState(task.status);
    const [confirming, setConfirming] = useState(false);

    const priorityColors = {
        High: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: 'rgba(239, 68, 68, 0.25)' },
        Medium: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.25)' },
        Low: { bg: 'rgba(34, 197, 94, 0.12)', color: '#34d399', border: 'rgba(34, 197, 94, 0.25)' },
    };

    const statusColors = {
        'Not Started': { bg: 'rgba(96, 165, 250, 0.12)', color: '#60a5fa' },
        Pending: { bg: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' },
        Completed: { bg: 'rgba(34, 197, 94, 0.12)', color: '#34d399' },
    };

    const categoryColors = {
        Study: '#818cf8',
        Work: '#f472b6',
        Personal: '#34d399',
    };

    const pStyle = priorityColors[task.priority] || priorityColors.Low;
    const sStyle = statusColors[task.status] || statusColors['Not Started'];
    const catColor = categoryColors[task.category] || '#818cf8';

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const handleSave = () => {
        onUpdateStatus(task._id, newStatus);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirming) {
            onDelete(task._id);
            setConfirming(false);
        } else {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000);
        }
    };

    return (
        <div
            className="glass-card"
            style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                borderLeft: `3px solid ${catColor}`,
                animation: 'fadeInUp 0.4s ease-out forwards',
            }}
        >
            {/* Header: title + priority */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <h3
                    style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        lineHeight: 1.4,
                        flex: 1,
                        wordBreak: 'break-word',
                    }}
                >
                    {task.title}
                </h3>
                <span
                    style={{
                        padding: '3px 10px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-full)',
                        background: pStyle.bg,
                        color: pStyle.color,
                        border: `1px solid ${pStyle.border}`,
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase',
                        flexShrink: 0,
                    }}
                >
                    {task.priority}
                </span>
            </div>

            {/* Meta: category + status */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-full)',
                        background: `${catColor}18`,
                        color: catColor,
                    }}
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="6" />
                    </svg>
                    {task.category}
                </span>

                {isEditing ? (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                fontFamily: 'inherit',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                outline: 'none',
                            }}
                        >
                            <option value="Not Started">Not Started</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <button
                            onClick={handleSave}
                            style={{
                                padding: '4px 10px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                background: 'rgba(34, 197, 94, 0.15)',
                                color: 'var(--color-success)',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            ✓
                        </button>
                        <button
                            onClick={() => { setIsEditing(false); setNewStatus(task.status); }}
                            style={{
                                padding: '4px 10px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                background: 'rgba(148, 163, 184, 0.1)',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <span
                        onClick={() => setIsEditing(true)}
                        style={{
                            padding: '3px 10px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-full)',
                            background: sStyle.bg,
                            color: sStyle.color,
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        {task.status}
                    </span>
                )}
            </div>

            {/* Footer: timestamp + actions */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-color)',
                }}
            >
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {timeAgo(task.createdAt)}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            title="Update status"
                            style={{
                                width: 30,
                                height: 30,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                background: 'rgba(96, 165, 250, 0.1)',
                                color: 'var(--color-info)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        title={confirming ? 'Click again to confirm' : 'Delete task'}
                        style={{
                            width: 30,
                            height: 30,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: confirming ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--color-danger)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                            animation: confirming ? 'pulse-glow 1s infinite' : 'none',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
