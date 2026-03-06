const StatsCard = ({ icon, label, count, gradient, delay = 0 }) => {
    return (
        <div
            style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all var(--transition-normal)',
                cursor: 'default',
                animation: `fadeInUp 0.4s ease-out ${delay}ms forwards`,
                opacity: 0,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
        >
            {/* Icon */}
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-sm)',
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>

            {/* Content */}
            <div>
                <p
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        lineHeight: 1.1,
                    }}
                >
                    {count}
                </p>
                <p
                    style={{
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                    }}
                >
                    {label}
                </p>
            </div>
        </div>
    );
};

export default StatsCard;
