import { useState } from 'react';
import api from '../api/axios';

const TaskCard = ({ task, onDelete, onUpdateStatus, onEdit, onTaskUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newStatus, setNewStatus] = useState(task.status);
    const [confirming, setConfirming] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [newSubtask, setNewSubtask] = useState('');
    const [addingSubtask, setAddingSubtask] = useState(false);

    const priorityColors = {
        High: { bg: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
        Medium: { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)' },
        Low: { bg: 'rgba(34, 197, 94, 0.1)', color: '#34d399', border: 'rgba(34, 197, 94, 0.2)' },
    };

    const statusColors = {
        'Not Started': { bg: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', icon: '○' },
        Pending: { bg: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', icon: '◐' },
        Completed: { bg: 'rgba(34, 197, 94, 0.1)', color: '#34d399', icon: '●' },
    };

    const categoryIcons = { Study: '📚', Work: '💼', Personal: '🏠' };
    const categoryColors = { Study: '#818cf8', Work: '#f472b6', Personal: '#34d399' };

    const pStyle = priorityColors[task.priority] || priorityColors.Low;
    const sStyle = statusColors[task.status] || statusColors['Not Started'];
    const catColor = categoryColors[task.category] || '#818cf8';
    const catIcon = categoryIcons[task.category] || '📋';

    const subtasks = task.subtasks || [];
    const subtaskDone = subtasks.filter(s => s.done).length;
    const subtaskTotal = subtasks.length;
    const subtaskPercent = subtaskTotal > 0 ? Math.round((subtaskDone / subtaskTotal) * 100) : 0;

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    const handleSave = () => { onUpdateStatus(task._id, newStatus); setIsEditing(false); };
    const handleDelete = () => {
        if (confirming) { onDelete(task._id); setConfirming(false); }
        else { setConfirming(true); setTimeout(() => setConfirming(false), 3000); }
    };

    const handleAddSubtask = async () => {
        if (!newSubtask.trim()) return;
        try {
            const res = await api.post(`/task/add-subtask/${task._id}/subtask`, { title: newSubtask.trim() });
            onTaskUpdate?.(res.data.task);
            setNewSubtask('');
            setAddingSubtask(false);
        } catch (err) { /* error */ }
    };

    const handleToggleSubtask = async (subtaskId, done) => {
        try {
            const res = await api.patch(`/task/update-subtask/${task._id}/subtask/${subtaskId}`, { done: !done });
            onTaskUpdate?.(res.data.task);
        } catch (err) { /* error */ }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        try {
            const res = await api.delete(`/task/delete-subtask/${task._id}/subtask/${subtaskId}`);
            onTaskUpdate?.(res.data.task);
        } catch (err) { /* error */ }
    };

    return (
        <div
            className="glass-card"
            style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderLeft: `3px solid ${catColor}`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {task.status === 'Completed' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)' }} />
            )}

            {/* Header: title + priority */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <h3
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        fontSize: '0.975rem', fontWeight: 600,
                        color: task.status === 'Completed' ? 'var(--text-secondary)' : 'var(--text-primary)',
                        lineHeight: 1.45, flex: 1, wordBreak: 'break-word', cursor: 'pointer',
                        textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                        textDecorationColor: 'var(--text-muted)',
                    }}
                >
                    {task.title}
                    {(task.description || subtaskTotal > 0) && (
                        <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: 'var(--text-dim)', verticalAlign: 'middle' }}>
                            {expanded ? '▾' : '▸'}
                        </span>
                    )}
                </h3>
                <span
                    style={{
                        padding: '3px 10px', fontSize: '0.68rem', fontWeight: 700,
                        borderRadius: 'var(--radius-full)', background: pStyle.bg,
                        color: pStyle.color, border: `1px solid ${pStyle.border}`,
                        whiteSpace: 'nowrap', letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0,
                    }}
                >
                    {task.priority}
                </span>
            </div>

            {/* Description - shown when expanded */}
            {expanded && task.description && (
                <p style={{
                    fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6,
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                    whiteSpace: 'pre-wrap',
                }}>
                    {task.description}
                </p>
            )}

            {/* Meta: category + status + subtask progress */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600,
                    borderRadius: 'var(--radius-full)', background: `${catColor}12`, color: catColor,
                }}>
                    <span style={{ fontSize: '0.8rem' }}>{catIcon}</span>
                    {task.category}
                </span>

                {isEditing ? (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                            style={{
                                padding: '4px 10px', fontSize: '0.75rem', fontFamily: 'inherit',
                                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none',
                            }}>
                            <option value="Not Started">Not Started</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <button onClick={handleSave} style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--color-success-dim)', color: 'var(--color-success)', cursor: 'pointer', fontFamily: 'inherit' }}>✓</button>
                        <button onClick={() => { setIsEditing(false); setNewStatus(task.status); }} style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 'var(--radius-sm)', border: 'none', background: 'rgba(148, 163, 184, 0.08)', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                    </div>
                ) : (
                    <span onClick={() => setIsEditing(true)} style={{
                        padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600,
                        borderRadius: 'var(--radius-full)', background: sStyle.bg, color: sStyle.color,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px',
                        transition: 'all var(--transition-fast)',
                    }}>
                        <span style={{ fontSize: '0.6rem' }}>{sStyle.icon}</span>
                        {task.status}
                    </span>
                )}

                {/* Subtask progress pill */}
                {subtaskTotal > 0 && (
                    <span
                        onClick={() => setExpanded(!expanded)}
                        style={{
                            padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600,
                            borderRadius: 'var(--radius-full)', cursor: 'pointer',
                            background: subtaskDone === subtaskTotal ? 'var(--color-success-dim)' : 'rgba(148, 163, 184, 0.08)',
                            color: subtaskDone === subtaskTotal ? 'var(--color-success)' : 'var(--text-muted)',
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        ☑ {subtaskDone}/{subtaskTotal}
                    </span>
                )}
            </div>

            {/* Subtasks section - expanded */}
            {expanded && (
                <div style={{
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)', overflow: 'hidden',
                }}>
                    {/* Subtask progress bar */}
                    {subtaskTotal > 0 && (
                        <div style={{ height: '3px', background: 'var(--bg-tertiary)' }}>
                            <div style={{
                                height: '100%', width: `${subtaskPercent}%`,
                                background: subtaskDone === subtaskTotal ? 'var(--color-success)' : 'var(--accent-primary)',
                                transition: 'width 0.3s ease',
                            }} />
                        </div>
                    )}

                    {/* Subtask list */}
                    {subtasks.map((sub) => (
                        <div
                            key={sub._id}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '8px 12px', borderBottom: '1px solid var(--border-color)',
                                transition: 'background var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.04)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <button
                                onClick={() => handleToggleSubtask(sub._id, sub.done)}
                                style={{
                                    width: 18, height: 18, borderRadius: '4px', flexShrink: 0, cursor: 'pointer',
                                    border: sub.done ? 'none' : '2px solid var(--border-hover)',
                                    background: sub.done ? 'var(--color-success)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '0.6rem', transition: 'all var(--transition-fast)',
                                }}
                            >
                                {sub.done && '✓'}
                            </button>
                            <span style={{
                                flex: 1, fontSize: '0.82rem', lineHeight: 1.4,
                                color: sub.done ? 'var(--text-dim)' : 'var(--text-secondary)',
                                textDecoration: sub.done ? 'line-through' : 'none',
                            }}>
                                {sub.title}
                            </span>
                            <button
                                onClick={() => handleDeleteSubtask(sub._id)}
                                style={{
                                    background: 'none', border: 'none', color: 'var(--text-dim)',
                                    cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px',
                                    opacity: 0.5, transition: 'opacity var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--color-danger)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    {/* Add subtask input */}
                    {addingSubtask ? (
                        <div style={{ display: 'flex', gap: '6px', padding: '8px 12px' }}>
                            <input
                                type="text"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                                placeholder="Subtask title..."
                                autoFocus
                                className="input"
                                style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem' }}
                            />
                            <button onClick={handleAddSubtask} style={{ padding: '6px 12px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--accent-glow)', color: 'var(--accent-primary)', cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
                            <button onClick={() => { setAddingSubtask(false); setNewSubtask(''); }} style={{ padding: '6px 8px', fontSize: '0.72rem', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setAddingSubtask(true); setExpanded(true); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
                                padding: '8px 12px', border: 'none', background: 'transparent',
                                color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: 500,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'color var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                        >
                            <span style={{ fontSize: '0.9rem' }}>+</span> Add subtask
                        </button>
                    )}
                </div>
            )}

            {/* Footer */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '10px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '8px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        {timeAgo(task.createdAt)}
                    </span>

                    {task.dueDate && (() => {
                        const due = new Date(task.dueDate);
                        const now = new Date();
                        now.setHours(0, 0, 0, 0); due.setHours(0, 0, 0, 0);
                        const isOverdue = due < now && task.status !== 'Completed';
                        const isDueToday = due.getTime() === now.getTime() && task.status !== 'Completed';
                        const isDone = task.status === 'Completed';
                        const color = isDone ? 'var(--color-success)' : isOverdue ? 'var(--color-danger)' : isDueToday ? 'var(--color-warning)' : 'var(--text-muted)';
                        const bg = isDone ? 'var(--color-success-dim)' : isOverdue ? 'var(--color-danger-dim)' : isDueToday ? 'var(--color-warning-dim)' : 'rgba(148, 163, 184, 0.06)';
                        const label = isOverdue ? 'Overdue' : isDueToday ? 'Due today' : '';
                        return (
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color, background: bg, padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {label && <span> · {label}</span>}
                            </span>
                        );
                    })()}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                    {/* Expand/collapse toggle */}
                    {(task.description || subtaskTotal > 0) && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            title={expanded ? 'Collapse' : 'Expand'}
                            style={{
                                width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: 'var(--radius-sm)', border: 'none',
                                background: expanded ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.06)',
                                color: 'var(--text-muted)', cursor: 'pointer', transition: 'all var(--transition-fast)',
                                fontSize: '0.7rem',
                            }}
                        >
                            {expanded ? '▲' : '▼'}
                        </button>
                    )}
                    {!isEditing && onEdit && (
                        <button onClick={onEdit} title="Edit task" style={{
                            width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 'var(--radius-sm)', border: 'none',
                            background: 'var(--accent-glow)', color: 'var(--accent-primary)',
                            cursor: 'pointer', transition: 'all var(--transition-fast)',
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    )}
                    <button onClick={handleDelete} title={confirming ? 'Click again to confirm' : 'Delete task'} style={{
                        width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 'var(--radius-sm)', border: 'none',
                        background: confirming ? 'rgba(239, 68, 68, 0.2)' : 'var(--color-danger-dim)',
                        color: 'var(--color-danger)', cursor: 'pointer', transition: 'all var(--transition-fast)',
                        animation: confirming ? 'pulse-glow 1s infinite' : 'none',
                    }}>
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
