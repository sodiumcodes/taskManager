import { useState } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ user, children, onProfileOpen }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Sidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div
                style={{
                    marginLeft: 0,
                    minHeight: '100vh',
                    transition: 'margin-left var(--transition-normal)',
                }}
                className="main-content-area"
            >
                {/* Top bar */}
                <header
                    className="mobile-topbar"
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 30,
                        padding: '12px 20px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Hamburger (mobile) */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="hamburger-btn"
                        style={{
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    {/* Greeting */}
                    <div>
                        <h2
                            style={{
                                fontSize: '1.05rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                            }}
                        >
                            Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.name?.split(' ')[0] || 'User'}</span> 👋
                        </h2>
                    </div>

                    {/* User avatar — clickable to open profile */}
                    <button
                        onClick={onProfileOpen}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'none',
                            border: '2px solid transparent',
                            borderRadius: 'var(--radius-full)',
                            cursor: 'pointer',
                            padding: '2px',
                            transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                            e.currentTarget.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        title="View profile"
                    >
                        <img
                            src={user?.profile_picture || 'https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg'}
                            alt={user?.name || 'User'}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 'var(--radius-full)',
                                objectFit: 'cover',
                            }}
                        />
                    </button>
                </header>

                {/* Page content */}
                <main style={{ padding: '24px 20px 40px' }}>
                    {children}
                </main>
            </div>

            {/* Responsive styles */}
            <style>{`
        @media (min-width: 769px) {
          .main-content-area {
            margin-left: var(--sidebar-width) !important;
          }
          .hamburger-btn {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
        </div>
    );
};

export default DashboardLayout;
