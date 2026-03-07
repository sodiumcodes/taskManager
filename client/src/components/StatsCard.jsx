import { useEffect, useRef, useState } from 'react';

const StatsCard = ({ icon, label, count, gradient, delay = 0 }) => {
    const [displayCount, setDisplayCount] = useState(0);
    const cardRef = useRef(null);

    useEffect(() => {
        if (count === 0) { setDisplayCount(0); return; }
        const duration = 600;
        const steps = 20;
        const increment = count / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= count) {
                setDisplayCount(count);
                clearInterval(timer);
            } else {
                setDisplayCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [count]);

    return (
        <div
            ref={cardRef}
            style={{
                padding: '22px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all var(--transition-normal)',
                cursor: 'default',
                animation: `fadeInUp 0.45s ease-out ${delay}ms forwards`,
                opacity: 0,
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--border-hover)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
        >
            {/* Subtle gradient accent at top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: gradient, opacity: 0.6 }} />

            {/* Icon */}
            <div
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 'var(--radius-md)',
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0,
                    boxShadow: `0 4px 16px ${gradient.includes('#667eea') ? 'rgba(102, 126, 234, 0.25)' : gradient.includes('#22c55e') ? 'rgba(34, 197, 94, 0.25)' : gradient.includes('#fbbf24') ? 'rgba(251, 191, 36, 0.25)' : 'rgba(96, 165, 250, 0.25)'}`,
                }}
            >
                {icon}
            </div>

            {/* Content */}
            <div>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                    {displayCount}
                </p>
                <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.01em' }}>
                    {label}
                </p>
            </div>
        </div>
    );
};

export default StatsCard;
