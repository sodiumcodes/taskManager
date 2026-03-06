import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import TaskCard from '../components/TaskCard';
import StatsCard from '../components/StatsCard';
import AddTaskModal from '../components/AddTaskModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/task/get-tasks');
      setTasks(response.data.tasks || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
        return;
      }
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    const response = await api.post('/task/create-task', taskData);
    setTasks([...tasks, response.data.task]);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/task/delete-task/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/task/update-status/${taskId}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  // Client-side computed stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const notStarted = tasks.filter((t) => t.status === 'Not Started').length;
    return { total, completed, pending, notStarted };
  }, [tasks]);

  // Client-side filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterCategory !== 'All' && t.category !== filterCategory) return false;
      if (filterStatus !== 'All' && t.status !== filterStatus) return false;
      if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filterCategory, filterStatus, filterPriority, searchQuery]);

  if (loading && !user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          color: 'var(--text-muted)',
          fontSize: '1rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'white',
              margin: '0 auto 16px',
              animation: 'pulse-glow 2s infinite',
            }}
          >
            T
          </div>
          Loading your workspace...
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {error}
            <button
              onClick={() => setError('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '1rem',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          }
          label="Total Tasks"
          count={stats.total}
          gradient="linear-gradient(135deg, #667eea, #764ba2)"
          delay={0}
        />
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
          label="Not Started"
          count={stats.notStarted}
          gradient="linear-gradient(135deg, #60a5fa, #3b82f6)"
          delay={60}
        />
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          label="In Progress"
          count={stats.pending}
          gradient="linear-gradient(135deg, #fbbf24, #d97706)"
          delay={120}
        />
        <StatsCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
          label="Completed"
          count={stats.completed}
          gradient="linear-gradient(135deg, #22c55e, #059669)"
          delay={180}
        />
      </div>

      {/* Filter Bar + Add Button */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="input"
            style={{ paddingLeft: '38px', background: 'var(--bg-primary)' }}
            id="search-tasks"
          />
        </div>

        {/* Filters */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="select"
          style={{ flex: '0 0 auto', width: 'auto', minWidth: '120px', background: 'var(--bg-primary)' }}
        >
          <option value="All">All Categories</option>
          <option value="Personal">🏠 Personal</option>
          <option value="Study">📚 Study</option>
          <option value="Work">💼 Work</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="select"
          style={{ flex: '0 0 auto', width: 'auto', minWidth: '130px', background: 'var(--bg-primary)' }}
        >
          <option value="All">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="select"
          style={{ flex: '0 0 auto', width: 'auto', minWidth: '120px', background: 'var(--bg-primary)' }}
        >
          <option value="All">All Priority</option>
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🔴 High</option>
        </select>

        {/* Add button */}
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary"
          style={{ flex: '0 0 auto' }}
          id="add-task-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '16px',
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '160px' }} />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2rem',
            }}
          >
            {tasks.length === 0 ? '📋' : '🔍'}
          </div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
          </h3>
          <p style={{ fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
            {tasks.length === 0
              ? 'Create your first task to get started! Click "Add Task" above.'
              : 'Try adjusting your filters or search query.'}
          </p>
          {tasks.length === 0 && (
            <button
              onClick={() => setModalOpen(true)}
              className="btn btn-primary"
              style={{ marginTop: '24px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create First Task
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '16px',
          }}
          className="stagger-children"
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
      )}

      {/* Floating Add button (mobile) */}
      <button
        onClick={() => setModalOpen(true)}
        className="fab-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          border: 'none',
          color: 'white',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          zIndex: 30,
          transition: 'all var(--transition-fast)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Add Task Modal */}
      <AddTaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddTask} />

      <style>{`
        @media (max-width: 768px) {
          .fab-btn {
            display: flex !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Dashboard;
