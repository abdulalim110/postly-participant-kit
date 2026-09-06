import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { USER_PROFILE_QUERY } from '../graphql/profile.js';
import PostCard from './PostCard.jsx';

const ASSETS_BASE = import.meta.env.VITE_ASSETS_BASE_URL || 'http://localhost:4000/assets';

function formatJoinDate(timestamp) {
  if (!timestamp) return '';
  const date = isNaN(Number(timestamp)) ? new Date(timestamp) : new Date(Number(timestamp));
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

export default function ProfileView({
  username,
  onBackToFeed,
  onAuthorClick,
  onOpenAuth,
  onOpenCreatePost,
}) {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'cards'

  const { loading, error, data } = useQuery(USER_PROFILE_QUERY, {
    variables: { username },
    fetchPolicy: 'cache-and-network',
  });

  if (loading && !data) {
    return (
      <div className="profile-container">
        <button onClick={onBackToFeed} className="btn-back">
          ← Kembali ke Feed
        </button>
        <div className="feed-loading-state" style={{ marginTop: '2rem' }}>
          <div className="spinner"></div>
          <span>Memuat profil @{username}...</span>
        </div>
      </div>
    );
  }

  if (error || !data?.userProfile) {
    return (
      <div className="profile-container">
        <button onClick={onBackToFeed} className="btn-back">
          ← Kembali ke Feed
        </button>
        <div className="alert-box alert-danger" style={{ marginTop: '1.5rem' }}>
          <h3>Pengguna Tidak Ditemukan</h3>
          <p style={{ marginTop: '0.5rem' }}>
            {error?.message || `Pengguna @${username} tidak ditemukan atau belum terdaftar.`}
          </p>
          <button
            onClick={onBackToFeed}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '1rem' }}
          >
            Kembali ke Feed Publik
          </button>
        </div>
      </div>
    );
  }

  const user = data.userProfile;
  const posts = user.posts || [];

  return (
    <div className="profile-container">
      {/* Back Navigation Bar */}
      <div className="profile-nav-bar">
        <button onClick={onBackToFeed} className="btn-back">
          ← Kembali ke Feed
        </button>
      </div>

      {/* Profile Header Card (Merujuk references/UI/profile-v2.png) */}
      <div className="profile-header-card">
        <div className="profile-avatar-wrapper">
          <img
            src={`${ASSETS_BASE}/avatars/${user.avatar || 'avatar-alex'}.webp`}
            alt={user.username}
            className="profile-avatar-lg"
          />
        </div>

        <div className="profile-details">
          <h1 className="profile-fullname">{user.username}</h1>
          <div className="profile-handle">@{user.username}</div>
          <p className="profile-bio">
            Berbagi momen sederhana di Postly.
          </p>
          <div className="profile-meta-tags">
            <span className="profile-badge">
              📸 <strong>{posts.length}</strong> Post
            </span>
            <span className="profile-badge">
              🗓️ Bergabung {formatJoinDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Posts Section */}
      <div className="profile-posts-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">
            Post {user.username}
          </h2>
          <div className="profile-view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('grid');
                setSelectedPostId(null);
              }}
              title="Grid View"
            >
              ⊞ Grid
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Feed Cards View"
            >
              ☰ Feed
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="empty-profile-posts">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📷</div>
            <h3>Belum Ada Postingan</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              @{user.username} belum membagikan postingan apa pun.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="profile-posts-grid">
            {posts.map((post) => {
              const totalComments = (post.comments || []).reduce(
                (acc, c) => acc + 1 + (c.replies ? c.replies.length : 0),
                0
              );
              const isSelected = selectedPostId === post.id;

              return (
                <div key={post.id} className="profile-grid-item-container">
                  <div
                    className={`profile-grid-item ${isSelected ? 'selected' : ''}`}
                    onClick={() =>
                      setSelectedPostId(selectedPostId === post.id ? null : post.id)
                    }
                  >
                    <img
                      src={`${ASSETS_BASE}/posts/${post.imageUrl || 'post-workspace'}.webp`}
                      alt={post.caption}
                      className="profile-grid-img"
                      loading="lazy"
                    />
                    <div className="profile-grid-overlay">
                      <p className="profile-grid-caption">{post.caption}</p>
                      <span className="profile-grid-comment-count">
                        💬 {totalComments} komentar
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detail below clicked grid item */}
                  {isSelected && (
                    <div className="profile-grid-expanded-post">
                      <PostCard
                        post={post}
                        onAuthorClick={onAuthorClick}
                        onOpenAuth={onOpenAuth}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="profile-posts-list">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onAuthorClick={onAuthorClick}
                onOpenAuth={onOpenAuth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
