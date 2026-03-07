import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onDelete, onUpdateStatus, onEdit, onTaskUpdate }) => {
    const columns = [
        { key: 'Not Started', label: 'To Do', color: '#60a5fa', icon: '○' },
        { key: 'Pending', label: 'In Progress', color: '#fbbf24', icon: '◐' },
        { key: 'Completed', label: 'Done', color: '#34d399', icon: '●' },
    ];

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
    };

    const handleDragLeave = (e) => {
        e.currentTarget.style.background = 'transparent';
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        e.currentTarget.style.background = 'transparent';
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            const task = tasks.find(t => t._id === taskId);
            if (task && task.status !== status) {
                onUpdateStatus(taskId, status);
            }
        }
    };

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                minHeight: '400px',
            }}
        >
            {columns.map((col) => {
                const columnTasks = tasks.filter(t => t.status === col.key);
                return (
                    <div
                        key={col.key}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, col.key)}
                        style={{
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'background var(--transition-fast)',
                        }}
                    >
                        {/* Column header */}
                        <div style={{
                            padding: '14px 16px', borderBottom: '1px solid var(--border-color)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: col.color, boxShadow: `0 0 8px ${col.color}40`,
                                }} />
                                <span style={{
                                    fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)',
                                    letterSpacing: '-0.01em',
                                }}>
                                    {col.label}
                                </span>
                            </div>
                            <span style={{
                                fontSize: '0.72rem', fontWeight: 700, color: col.color,
                                background: `${col.color}15`, padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                            }}>
                                {columnTasks.length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div style={{
                            flex: 1, padding: '12px', display: 'flex', flexDirection: 'column',
                            gap: '10px', overflowY: 'auto', minHeight: '200px',
                        }}>
                            {columnTasks.length > 0 ? (
                                columnTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task._id)}
                                        onDragEnd={handleDragEnd}
                                        style={{ cursor: 'grab' }}
                                    >
                                        <TaskCard
                                            task={task}
                                            onDelete={onDelete}
                                            onUpdateStatus={onUpdateStatus}
                                            onEdit={() => onEdit(task)}
                                            onTaskUpdate={onTaskUpdate}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    flex: 1, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-dim)', fontSize: '0.82rem',
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: 'var(--radius-sm)', padding: '24px',
                                }}>
                                    <span style={{ fontSize: '1.5rem', marginBottom: '6px', opacity: 0.5 }}>{col.icon}</span>
                                    <span>Drop tasks here</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: repeat(3"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default KanbanBoard;
