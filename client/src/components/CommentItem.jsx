import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT_MUTATION } from '../graphql/comments.js';
import { PUBLIC_FEED_QUERY } from '../graphql/posts.js';
import { useAuth } from '../context/AuthContext.jsx';

const ASSETS_BASE = import.meta.env.VITE_ASSETS_BASE_URL || 'http://localhost:4000/assets';

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = isNaN(Number(timestamp)) ? new Date(timestamp) : new Date(Number(timestamp));
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommentItem({ comment, postId, onAuthorClick, onOpenAuth }) {
  const { currentUser } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [createCommentMutation, { loading: loadingReply }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      refetchQueries: [{ query: PUBLIC_FEED_QUERY }],
    }
  );

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!replyText.trim()) return;

    try {
      await createCommentMutation({
        variables: {
          postId,
          parentId: comment.id,
          content: replyText.trim(),
        },
      });
      setReplyText('');
      setIsReplying(false);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengirim balasan.');
    }
  };

  const isTopLevel = !comment.parentId;

  return (
    <div className={`comment-item ${isTopLevel ? 'top-level-comment' : 'reply-comment'}`}>
      <div className="comment-main-row">
        <img
          src={`${ASSETS_BASE}/avatars/${comment.author?.avatar || 'avatar-alex'}.webp`}
          alt={comment.author?.username}
          className="comment-author-avatar"
        />
        <div className="comment-bubble-wrapper">
          <div className="comment-bubble">
            <span
              className="comment-author-name"
              onClick={() => onAuthorClick && onAuthorClick(comment.author?.username)}
            >
              @{comment.author?.username}
            </span>
            <p className="comment-content-text">{comment.content}</p>
          </div>

          <div className="comment-meta-row">
            <span className="comment-time">{formatTime(comment.createdAt)}</span>

            {/* Balas button ONLY on top-level comments to enforce 1-level reply */}
            {isTopLevel && (
              <button
                type="button"
                className="comment-reply-btn"
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth && onOpenAuth('login');
                  } else {
                    setIsReplying(!isReplying);
                  }
                }}
              >
                {isReplying ? 'Batal' : 'Balas'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline Reply Form */}
      {isReplying && isTopLevel && (
        <form onSubmit={handleReplySubmit} className="inline-reply-form">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Membalas @${comment.author?.username}...`}
            className="reply-input"
            autoFocus
          />
          <button
            type="submit"
            disabled={loadingReply || !replyText.trim()}
            className="btn btn-primary btn-sm"
          >
            {loadingReply ? '...' : 'Kirim'}
          </button>
        </form>
      )}

      {errorMsg && <div className="alert-box alert-danger reply-error">{errorMsg}</div>}

      {/* Nested Replies List (Rendered 1-level) */}
      {isTopLevel && comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies-list">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onAuthorClick={onAuthorClick}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      )}
    </div>
  );
}
