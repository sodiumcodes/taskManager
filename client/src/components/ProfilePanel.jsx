import { useState, useRef } from 'react';
import api from '../api/axios';

const ProfilePanel = ({ isOpen, onClose, user, onUserUpdate, stats }) => {
    const [loading, setLoading] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [newPhone, setNewPhone] = useState(user?.phone || '');
    const [newEmail, setNewEmail] = useState(user?.email || '');
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

    const handleUpdateEmail = async () => {
        if (!newEmail.trim() || newEmail.trim() === user?.email) {
            setEditingEmail(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.patch('/user/change-email', { email: newEmail.trim() });
            const res = await api.get('/user/details');
            onUserUpdate(res.data.user);
            setEditingEmail(false);
            setSuccess('Email updated!');
            clearMessages();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update email');
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

    const EditableField = ({ label, value, isEditing: editing, setEditing, newValue, setNewValue, onSave, type = 'text', placeholder = '' }) => (
        <div
            style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                marginBottom: '10px',
                transition: 'all var(--transition-fast)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editing ? '10px' : 0 }}>
                <div>
                    <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
                        {label}
                    </p>
                    {!editing && (
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {value || '—'}
                        </p>
                    )}
                </div>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        style={{
                            padding: '5px 12px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(129, 140, 248, 0.15)',
                            background: 'var(--accent-glow)',
                            color: 'var(--accent-primary)',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--accent-glow-strong)';
                            e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--accent-glow)';
                            e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.15)';
                        }}
                    >
                        Edit
                    </button>
                )}
            </div>
            {editing && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type={type}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder={placeholder}
                        className="input"
                        style={{ flex: 1, padding: '9px 12px', fontSize: '0.875rem' }}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && onSave()}
                    />
                    <button onClick={onSave} disabled={loading} className="btn btn-primary" style={{ padding: '9px 16px', fontSize: '0.78rem' }}>
                        {loading ? '...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)} className="btn btn-ghost" style={{ padding: '9px 14px', fontSize: '0.78rem' }}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );

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
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
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
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                {/* Header with gradient */}
                <div
                    style={{
                        background: 'linear-gradient(160deg, #0c0a1f 0%, #1a1145 40%, #2d1b69 70%, #4c1d95 100%)',
                        padding: '28px 24px 52px',
                        position: 'relative',
                        textAlign: 'center',
                    }}
                >
                    {/* Grid pattern */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(129, 140, 248, 0.06) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }} />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: 34,
                            height: 34,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: 'rgba(255, 255, 255, 0.6)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            transition: 'all var(--transition-fast)',
                            zIndex: 2,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                        }}
                    >
                        ✕
                    </button>

                    <p style={{ position: 'relative', zIndex: 1, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '4px' }}>
                        Your Profile
                    </p>
                </div>

                {/* Avatar overlapping header */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-42px', position: 'relative', zIndex: 2 }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={user?.profile_picture?.url || 'https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg'}
                            alt={user?.name || 'User'}
                            style={{
                                width: 84,
                                height: 84,
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
                                width: 30,
                                height: 30,
                                borderRadius: 'var(--radius-full)',
                                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                border: '3px solid var(--bg-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                color: 'white',
                                transition: 'all var(--transition-fast)',
                                opacity: uploading ? 0.6 : 1,
                                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                            }}
                            title="Change profile picture"
                        >
                            {uploading ? (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
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

                {/* User name display */}
                <div style={{ textAlign: 'center', padding: '12px 24px 4px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                        {user?.name || 'User'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {user?.email || ''}
                    </p>
                </div>

                {/* Stats mini grid */}
                {stats && (
                    <div style={{ padding: '0 24px 6px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '8px' }}>
                        {[
                            { label: 'Total', value: stats.total, color: 'var(--accent-primary)' },
                            { label: 'Done', value: stats.completed, color: 'var(--color-success)' },
                            { label: 'Pending', value: stats.pending, color: 'var(--color-warning)' },
                            { label: 'To Do', value: stats.notStarted, color: 'var(--color-info)' },
                        ].map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '10px 6px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    textAlign: 'center',
                                }}
                            >
                                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color, lineHeight: 1.2 }}>
                                    {s.value ?? 0}
                                </p>
                                <p style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Editable fields */}
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

                    <EditableField
                        label="Name"
                        value={user?.name}
                        isEditing={editingName}
                        setEditing={(v) => { setEditingName(v); if (v) setNewName(user?.name || ''); }}
                        newValue={newName}
                        setNewValue={setNewName}
                        onSave={handleUpdateName}
                    />

                    <EditableField
                        label="Email"
                        value={user?.email}
                        isEditing={editingEmail}
                        setEditing={(v) => { setEditingEmail(v); if (v) setNewEmail(user?.email || ''); }}
                        newValue={newEmail}
                        setNewValue={setNewEmail}
                        onSave={handleUpdateEmail}
                        type="email"
                    />

                    <EditableField
                        label="Phone"
                        value={user?.phone && user.phone !== 1234567890 ? user.phone : 'Not set'}
                        isEditing={editingPhone}
                        setEditing={(v) => { setEditingPhone(v); if (v) setNewPhone(user?.phone !== 1234567890 ? user?.phone || '' : ''); }}
                        newValue={newPhone}
                        setNewValue={setNewPhone}
                        onSave={handleUpdatePhone}
                        type="tel"
                        placeholder="Enter phone number"
                    />

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
                            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
                                Member Since
                            </p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
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
