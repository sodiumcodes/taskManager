import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import ProfilePanel from '../components/ProfilePanel';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [filter, setFilter] = useState({ category: '', status: '', priority: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const [userRes, taskRes] = await Promise.all([
                api.get('/user/details'),
                api.get('/task/get-tasks'),
            ]);
            setUser(userRes.data.user);
            setTasks(taskRes.data.tasks || []);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filtered & searched tasks
    const filteredTasks = tasks.filter((t) => {
        if (filter.category && t.category !== filter.category) return false;
        if (filter.status && t.status !== filter.status) return false;
        if (filter.priority && t.priority !== filter.priority) return false;
        if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    // Compute stats from local tasks
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        pending: tasks.filter(t => t.status === 'Pending').length,
        notStarted: tasks.filter(t => t.status === 'Not Started').length,
    };

    const handleAddTask = async (taskData) => {
        const res = await api.post('/task/create-task', taskData);
        setTasks((prev) => [res.data.task, ...prev]);
    };

    const handleDeleteTask = async (taskId) => {
        await api.delete(`/task/delete-task/${taskId}`);
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        await api.patch(`/task/update-status/${taskId}`, { status: newStatus });
        setTasks((prev) =>
            prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
    };

    const activeFilterCount = [filter.category, filter.status, filter.priority].filter(Boolean).length;

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        backgroundSize: '200% 200%', animation: 'gradient-shift 2s ease-in-out infinite',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: '1.2rem', color: 'white',
                        boxShadow: 'var(--shadow-accent)',
                    }}>T</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Loading your workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout user={user} onProfileOpen={() => setShowProfile(true)}>
            {/* Stats */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '14px',
                    marginBottom: '28px',
                }}
            >
                <StatsCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                    label="Total Tasks"
                    count={stats.total}
                    gradient="linear-gradient(135deg, #667eea, #764ba2)"
                    delay={0}
                />
                <StatsCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
                    label="Completed"
                    count={stats.completed}
                    gradient="linear-gradient(135deg, #22c55e, #059669)"
                    delay={80}
                />
                <StatsCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                    label="Pending"
                    count={stats.pending}
                    gradient="linear-gradient(135deg, #fbbf24, #d97706)"
                    delay={160}
                />
                <StatsCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                    label="Not Started"
                    count={stats.notStarted}
                    gradient="linear-gradient(135deg, #60a5fa, #3b82f6)"
                    delay={240}
                />
            </div>

            {/* Action bar */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    alignItems: 'center',
                    marginBottom: '22px',
                    animation: 'fadeIn 0.4s ease-out 300ms forwards',
                    opacity: 0,
                }}
            >
                {/* Search */}
                <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input"
                        style={{ paddingLeft: '38px', paddingTop: '10px', paddingBottom: '10px', fontSize: '0.85rem' }}
                    />
                </div>

                {/* Filters */}
                <select
                    value={filter.category}
                    onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
                    className="select"
                    style={{ width: 'auto', minWidth: '130px', padding: '10px 36px 10px 12px', fontSize: '0.82rem' }}
                >
                    <option value="">All Categories</option>
                    <option value="Personal">🏠 Personal</option>
                    <option value="Study">📚 Study</option>
                    <option value="Work">💼 Work</option>
                </select>

                <select
                    value={filter.status}
                    onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
                    className="select"
                    style={{ width: 'auto', minWidth: '130px', padding: '10px 36px 10px 12px', fontSize: '0.82rem' }}
                >
                    <option value="">All Status</option>
                    <option value="Not Started">Not Started</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>

                <select
                    value={filter.priority}
                    onChange={(e) => setFilter((f) => ({ ...f, priority: e.target.value }))}
                    className="select"
                    style={{ width: 'auto', minWidth: '120px', padding: '10px 36px 10px 12px', fontSize: '0.82rem' }}
                >
                    <option value="">All Priority</option>
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                </select>

                {activeFilterCount > 0 && (
                    <button
                        onClick={() => setFilter({ category: '', status: '', priority: '' })}
                        style={{
                            padding: '8px 14px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: 'var(--color-danger-dim)',
                            color: 'var(--color-danger)',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}
                    >
                        ✕ Clear ({activeFilterCount})
                    </button>
                )}

                {/* Add Task */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Task
                </button>
            </div>

            {/* Tasks grid */}
            {filteredTasks.length > 0 ? (
                <div
                    className="stagger-children"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '14px',
                    }}
                >
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onDelete={handleDeleteTask}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className="animate-fade-in"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '80px 24px',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '16px', filter: 'grayscale(30%)' }}>
                        {searchQuery || activeFilterCount > 0 ? '🔍' : '📋'}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {searchQuery || activeFilterCount > 0 ? 'No tasks match your filters' : 'No tasks yet'}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '360px' }}>
                        {searchQuery || activeFilterCount > 0
                            ? 'Try adjusting your search or filters to find what you\'re looking for.'
                            : 'Create your first task to get started with TaskFlow.'}
                    </p>
                    {!(searchQuery || activeFilterCount > 0) && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn btn-primary"
                            style={{ padding: '12px 28px' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Create Your First Task
                        </button>
                    )}
                </div>
            )}

            {/* Modals */}
            <AddTaskModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddTask}
            />
            <ProfilePanel
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
                user={user}
                onUserUpdate={(updatedUser) => setUser(updatedUser)}
                stats={stats}
            />

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 480px) {
                    .stagger-children {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default Dashboard;
