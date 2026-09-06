import React, { useState } from 'react';
import CommentSection from './CommentSection.jsx';

const ASSETS_BASE = import.meta.env.VITE_ASSETS_BASE_URL || 'http://localhost:4000/assets';

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = isNaN(Number(timestamp)) ? new Date(timestamp) : new Date(Number(timestamp));
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PostCard({ post, onAuthorClick, onOpenAuth }) {
  const [showComments, setShowComments] = useState(true);
  const authorAvatar = post.author?.avatar || 'avatar-alex';
  const postImageKey = post.imageUrl || 'post-workspace';

  // Count total comments (top-level + replies)
  const totalComments = (post.comments || []).reduce(
    (acc, c) => acc + 1 + (c.replies ? c.replies.length : 0),
    0
  );

  return (
    <article className="post-card">
      <header className="post-card-header">
        <div
          className="post-author-info"
          onClick={() => onAuthorClick && onAuthorClick(post.author?.username)}
          style={{ cursor: onAuthorClick ? 'pointer' : 'default' }}
        >
          <img
            src={`${ASSETS_BASE}/avatars/${authorAvatar}.webp`}
            alt={post.author?.username || 'User'}
            className="author-avatar-img"
          />
          <div>
            <div className="author-username-title">@{post.author?.username || 'anonymous'}</div>
            <div className="post-time-meta">{formatTimestamp(post.createdAt)}</div>
          </div>
        </div>
      </header>

      <div className="post-image-wrapper">
        <img
          src={`${ASSETS_BASE}/posts/${postImageKey}.webp`}
          alt={post.caption}
          className="post-main-img"
          loading="lazy"
        />
      </div>

      <div className="post-card-body">
        <p className="post-caption-text">
          <strong
            className="post-caption-author"
            onClick={() => onAuthorClick && onAuthorClick(post.author?.username)}
          >
            @{post.author?.username}
          </strong>{' '}
          {post.caption}
        </p>
      </div>

      <footer className="post-card-footer">
        <button
          type="button"
          className="comment-toggle-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {totalComments} komentar {showComments ? '▲' : '▼'}
        </button>
      </footer>

      {showComments && (
        <CommentSection
          postId={post.id}
          comments={post.comments || []}
          onAuthorClick={onAuthorClick}
          onOpenAuth={onOpenAuth}
        />
      )}
    </article>
  );
}
