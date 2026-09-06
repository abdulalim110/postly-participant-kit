import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT_MUTATION } from '../graphql/comments.js';
import { PUBLIC_FEED_QUERY } from '../graphql/posts.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentItem from './CommentItem.jsx';

const ASSETS_BASE = import.meta.env.VITE_ASSETS_BASE_URL || 'http://localhost:4000/assets';

export default function CommentSection({ postId, comments = [], onAuthorClick, onOpenAuth }) {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [createCommentMutation, { loading }] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: PUBLIC_FEED_QUERY }],
  });

  const handleTopLevelCommentSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!commentText.trim()) return;

    try {
      await createCommentMutation({
        variables: {
          postId,
          parentId: null,
          content: commentText.trim(),
        },
      });
      setCommentText('');
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengirim komentar.');
    }
  };

  return (
    <div className="comment-section-container">
      {/* Top Level Comment Form */}
      {currentUser ? (
        <form onSubmit={handleTopLevelCommentSubmit} className="top-level-comment-form">
          <img
            src={`${ASSETS_BASE}/avatars/${currentUser.avatar || 'avatar-alex'}.webp`}
            alt={currentUser.username}
            className="comment-author-avatar-sm"
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tulis komentar..."
            className="top-level-comment-input"
          />
          <button
            type="submit"
            disabled={loading || !commentText.trim()}
            className="btn btn-primary btn-sm"
          >
            {loading ? '...' : 'Kirim'}
          </button>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Ingin berkomentar?
          </span>
          <button
            type="button"
            onClick={() => onOpenAuth && onOpenAuth('login')}
            className="btn btn-secondary btn-sm"
          >
            Masuk untuk Berkomentar
          </button>
        </div>
      )}

      {errorMsg && <div className="alert-box alert-danger">{errorMsg}</div>}

      {/* List of comments */}
      {comments.length > 0 ? (
        <div className="comments-stream">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onAuthorClick={onAuthorClick}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      ) : (
        <div className="no-comments-yet">Belum ada komentar. Jadilah yang pertama berkomentar!</div>
      )}
    </div>
  );
}
