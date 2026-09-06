import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const ASSETS_BASE = import.meta.env.VITE_ASSETS_BASE_URL || 'http://localhost:4000/assets';

export default function Navbar({
  onNavigateFeed,
  onNavigateProfile,
  onOpenCreatePost,
  onOpenAuth,
  activeView,
}) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <div
          className="navbar-brand"
          onClick={onNavigateFeed}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <div className="brand-logo">P</div>
          <span className="brand-name">Postly</span>
        </div>

        <nav className="navbar-nav">
          <button
            onClick={onNavigateFeed}
            className={`nav-link-btn ${activeView === 'feed' ? 'active' : ''}`}
          >
            Feed
          </button>
          {currentUser && (
            <button
              onClick={onOpenCreatePost}
              className="nav-link-btn"
            >
              + Buat Post
            </button>
          )}
        </nav>

        <div className="navbar-actions">
          {currentUser ? (
            <div className="user-profile-badge">
              <div
                className="user-badge-link"
                onClick={() => onNavigateProfile(currentUser.username)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                title="Lihat Profil Saya"
              >
                <img
                  src={`${ASSETS_BASE}/avatars/${currentUser.avatar || 'avatar-alex'}.webp`}
                  alt={currentUser.username}
                  className="user-avatar-sm"
                />
                <span className="username-text">@{currentUser.username}</span>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-btn-group">
              <button
                onClick={() => onOpenAuth('login')}
                className="btn btn-secondary btn-sm"
              >
                Masuk
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn btn-primary btn-sm"
              >
                Daftar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
