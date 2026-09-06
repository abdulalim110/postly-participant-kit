import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_POST_MUTATION, PUBLIC_FEED_QUERY } from '../graphql/posts.js';

const ASSETS_BASE = import.meta.env.VITE_ASSETS_BASE_URL || 'http://localhost:4000/assets';

const POST_IMAGE_OPTIONS = [
  { id: 'post-workspace', name: 'Workspace', filename: 'post-workspace.webp' },
  { id: 'post-coffee', name: 'Coffee', filename: 'post-coffee.webp' },
  { id: 'post-code', name: 'Code', filename: 'post-code.webp' },
  { id: 'post-mountain', name: 'Mountain', filename: 'post-mountain.webp' },
  { id: 'post-city', name: 'City', filename: 'post-city.webp' },
];

export default function CreatePostModal({ isOpen, onClose }) {
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState('post-workspace');
  const [errorMsg, setErrorMsg] = useState('');

  const [createPostMutation, { loading }] = useMutation(CREATE_POST_MUTATION, {
    refetchQueries: [{ query: PUBLIC_FEED_QUERY }],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!caption.trim()) {
      setErrorMsg('Caption postingan tidak boleh kosong.');
      return;
    }

    try {
      await createPostMutation({
        variables: {
          caption: caption.trim(),
          imageUrl: selectedImage,
        },
      });
      setCaption('');
      setSelectedImage('post-workspace');
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Gagal membuat post.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Buat Postingan Baru
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {errorMsg && <div className="alert-box alert-danger">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label>Pilih Gambar Post (Allowlist Lokal):</label>
            <div className="post-image-grid">
              {POST_IMAGE_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  className={`post-image-option ${selectedImage === opt.id ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(opt.id)}
                >
                  <img
                    src={`${ASSETS_BASE}/posts/${opt.filename}`}
                    alt={opt.name}
                  />
                  <div className="post-image-label">{opt.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Preview Gambar Terpilih:</label>
            <div className="selected-image-preview">
              <img
                src={`${ASSETS_BASE}/posts/${selectedImage}.webp`}
                alt="Preview terpilih"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tulis Caption:</label>
            <textarea
              rows="3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ceritakan momen atau pemikiran Anda..."
              className="caption-textarea"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Memublikasikan...' : 'Publikasikan Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
