import { useState, useRef } from 'react';
import api from '../api/axios';

const ProfilePanel = ({ isOpen, onClose, user, onUserUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [newPhone, setNewPhone] = useState(user?.phone || '');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const clearMessages = () => {
        setTimeout(() => { setError(''); setSuccess(''); }, 3000);
    };

    const handleUploadPicture = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profile_picture', file);

        setUploading(true);
        setError('');
        try {
            await api.post('/user/profile-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Re-fetch profile to get updated data
            const res = await api.get('/user/details');
            onUserUpdate(res.data.user);
            setSuccess('Profile picture updated!');
            clearMessages();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload picture');
            clearMessages();
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateName = async () => {
        if (!newName.trim() || newName.trim() === user?.name) {
            setEditingName(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.patch('/user/name', { name: newName.trim() });
            const res = await api.get('/user/details');
            onUserUpdate(res.data.user);
            setEditingName(false);
            setSuccess('Name updated!');
            clearMessages();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update name');
            clearMessages();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePhone = async () => {
        if (!newPhone || newPhone === user?.phone) {
            setEditingPhone(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/user/phone', { phone: newPhone });
            const res = await api.get('/user/details');
            onUserUpdate(res.data.user);
            setEditingPhone(false);
            setSuccess('Phone updated!');
            clearMessages();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update phone');
            clearMessages();
        } finally {
            setLoading(false);
        }
    };

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';

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
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                }}
            />

            {/* Panel */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '440px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-lg)',
                    animation: 'modalSlideUp 0.3s ease-out',
                    overflow: 'hidden',
                }}
            >
                {/* Header with gradient */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                        padding: '28px 24px 48px',
                        position: 'relative',
                        textAlign: 'center',
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                        }}
                    >
                        ✕
                    </button>

                    <p
                        style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: '4px',
                        }}
                    >
                        Your Profile
                    </p>
                </div>

                {/* Avatar overlapping header */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-40px', position: 'relative', zIndex: 2 }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={user?.profile_picture?.url || 'https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg'}
                            alt={user?.name || 'User'}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 'var(--radius-full)',
                                objectFit: 'cover',
                                border: '4px solid var(--bg-secondary)',
                                boxShadow: 'var(--shadow-md)',
                            }}
                        />
                        {/* Camera icon overlay */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: -2,
                                width: 28,
                                height: 28,
                                borderRadius: 'var(--radius-full)',
                                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                border: '2px solid var(--bg-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                color: 'white',
                                transition: 'all var(--transition-fast)',
                                opacity: uploading ? 0.6 : 1,
                            }}
                            title="Change profile picture"
                        >
                            {uploading ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" />
                                </svg>
                            ) : (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleUploadPicture}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {/* User info & editable fields */}
                <div style={{ padding: '16px 24px 24px' }}>
                    {/* Messages */}
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '14px', fontSize: '0.82rem' }}>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success" style={{ marginBottom: '14px', fontSize: '0.82rem' }}>
                            {success}
                        </div>
                    )}

                    {/* Name */}
                    <div
                        style={{
                            padding: '14px 16px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            marginBottom: '10px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editingName ? '10px' : 0 }}>
                            <div>
                                <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                                    Name
                                </p>
                                {!editingName && (
                                    <p style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {user?.name || '—'}
                                    </p>
                                )}
                            </div>
                            {!editingName && (
                                <button
                                    onClick={() => { setEditingName(true); setNewName(user?.name || ''); }}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        background: 'var(--accent-glow)',
                                        color: 'var(--accent-primary)',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        {editingName && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="input"
                                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.875rem' }}
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                                />
                                <button onClick={handleUpdateName} disabled={loading} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                                    {loading ? '...' : 'Save'}
                                </button>
                                <button onClick={() => setEditingName(false)} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Email (read-only) */}
                    <div
                        style={{
                            padding: '14px 16px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            marginBottom: '10px',
                        }}
                    >
                        <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                            Email
                        </p>
                        <p style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {user?.email || '—'}
                        </p>
                    </div>

                    {/* Phone */}
                    <div
                        style={{
                            padding: '14px 16px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            marginBottom: '10px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editingPhone ? '10px' : 0 }}>
                            <div>
                                <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                                    Phone
                                </p>
                                {!editingPhone && (
                                    <p style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                                        {user?.phone && user.phone !== 1234567890 ? user.phone : 'Not set'}
                                    </p>
                                )}
                            </div>
                            {!editingPhone && (
                                <button
                                    onClick={() => { setEditingPhone(true); setNewPhone(user?.phone !== 1234567890 ? user?.phone || '' : ''); }}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        background: 'var(--accent-glow)',
                                        color: 'var(--accent-primary)',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        {editingPhone && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="tel"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    placeholder="Enter phone number"
                                    className="input"
                                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.875rem' }}
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdatePhone()}
                                />
                                <button onClick={handleUpdatePhone} disabled={loading} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                                    {loading ? '...' : 'Save'}
                                </button>
                                <button onClick={() => setEditingPhone(false)} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Member since */}
                    {memberSince && (
                        <div
                            style={{
                                padding: '14px 16px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                            }}
                        >
                            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                                Member Since
                            </p>
                            <p style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                                {memberSince}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePanel;
