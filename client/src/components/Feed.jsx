import React from 'react';
import { useQuery } from '@apollo/client';
import { PUBLIC_FEED_QUERY } from '../graphql/posts.js';
import PostCard from './PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Feed({ onOpenCreatePost, onOpenAuth, onAuthorClick }) {
  const { loading, error, data } = useQuery(PUBLIC_FEED_QUERY);
  const { currentUser } = useAuth();

  const posts = data?.feed || [];

  return (
    <div className="feed-container">
      {/* Create Post Prompt Banner for Logged In User */}
      {currentUser ? (
        <div className="create-post-prompt-card">
          <img
            src={`http://localhost:4000/assets/avatars/${currentUser.avatar || 'avatar-alex'}.webp`}
            alt={currentUser.username}
            className="user-avatar-sm"
          />
          <button
            onClick={onOpenCreatePost}
            className="create-post-input-fake"
          >
            Apa yang sedang Anda pikirkan, @{currentUser.username}?
          </button>
          <button
            onClick={onOpenCreatePost}
            className="btn btn-primary btn-sm"
          >
            + Post
          </button>
        </div>
      ) : (
        <div className="guest-welcome-banner">
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              Selamat datang di Postly Feed Publik
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Masuk atau daftar untuk membagikan postingan dan berkomentar.
            </div>
          </div>
          <button
            onClick={() => onOpenAuth('login')}
            className="btn btn-secondary btn-sm"
          >
            Masuk / Daftar
          </button>
        </div>
      )}

      {/* Feed Stream */}
      {loading && (
        <div className="feed-loading-state">
          <div className="spinner"></div>
          <span>Memuat feed postingan terbaru...</span>
        </div>
      )}

      {error && (
        <div className="alert-box alert-danger">
          Gagal memuat feed: {error.message}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="empty-feed-card">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📷</div>
          <h3>Belum Ada Postingan</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.92rem' }}>
            Jadilah yang pertama membuat postingan di Postly!
          </p>
          {currentUser && (
            <button
              onClick={onOpenCreatePost}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Buat Post Sekarang
            </button>
          )}
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="feed-posts-list">
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
  );
}
