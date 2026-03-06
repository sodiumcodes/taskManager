import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const Sidebar = ({ user, onClose, isOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await api.post('/auth/logout');
        } catch (err) {
            // Even if server logout fails, clear local state
        }
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            ),
        },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 40,
                        animation: 'overlayFadeIn 0.2s ease-out',
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 'var(--sidebar-width)',
                    background: 'var(--bg-secondary)',
                    borderRight: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 50,
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform var(--transition-normal)',
                }}
                className="sidebar-desktop"
            >
                {/* Logo */}
                <div
                    style={{
                        padding: '24px 20px',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: 'var(--radius-sm)',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            color: 'white',
                            flexShrink: 0,
                        }}
                    >
                        T
                    </div>
                    <div>
                        <h1
                            style={{
                                fontSize: '1.15rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                lineHeight: 1.2,
                            }}
                        >
                            TaskFlow
                        </h1>
                        <p
                            style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                fontWeight: 500,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Task Manager
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    <p
                        style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            padding: '0 8px',
                            marginBottom: '8px',
                        }}
                    >
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    onClose?.();
                                }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    background: isActive ? 'var(--accent-glow)' : 'transparent',
                                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 600 : 500,
                                    fontFamily: 'inherit',
                                    transition: 'all var(--transition-fast)',
                                    textAlign: 'left',
                                    marginBottom: '4px',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(148, 163, 184, 0.08)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* User section */}
                <div
                    style={{
                        padding: '16px',
                        borderTop: '1px solid var(--border-color)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 8px',
                            marginBottom: '8px',
                        }}
                    >
                        <img
                            src={user?.profile_picture || 'https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg'}
                            alt={user?.name || 'User'}
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 'var(--radius-full)',
                                objectFit: 'cover',
                                border: '2px solid var(--border-color)',
                                flexShrink: 0,
                            }}
                        />
                        <div style={{ overflow: 'hidden' }}>
                            <p
                                style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {user?.name || 'User'}
                            </p>
                            <p
                                style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '10px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(248, 113, 113, 0.2)',
                            background: 'rgba(248, 113, 113, 0.08)',
                            color: 'var(--color-danger)',
                            cursor: loggingOut ? 'not-allowed' : 'pointer',
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            fontFamily: 'inherit',
                            transition: 'all var(--transition-fast)',
                            opacity: loggingOut ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (!loggingOut) {
                                e.currentTarget.style.background = 'rgba(248, 113, 113, 0.15)';
                                e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.35)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.2)';
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </aside>

            {/* CSS for desktop sidebar always visible */}
            <style>{`
        @media (min-width: 769px) {
          .sidebar-desktop {
            transform: translateX(0) !important;
          }
          .sidebar-overlay {
            display: none !important;
          }
        }
      `}</style>
        </>
    );
};

export default Sidebar;
