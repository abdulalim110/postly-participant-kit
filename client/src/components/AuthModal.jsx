import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../graphql/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

const ASSETS_BASE = import.meta.env.VITE_ASSETS_BASE_URL || 'http://localhost:4000/assets';

const AVATAR_OPTIONS = [
  { id: 'avatar-alex', name: 'Alex' },
  { id: 'avatar-emily', name: 'Emily' },
  { id: 'avatar-james', name: 'James' },
  { id: 'avatar-sarah', name: 'Sarah' },
];

export default function AuthModal({ isOpen, initialMode = 'login', onClose }) {
  const [mode, setMode] = useState(initialMode);
  const { login: saveAuth } = useAuth();

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('avatar-alex');
  const [formError, setFormError] = useState('');

  const [loginMutation, { loading: loadingLogin }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: loadingRegister }] = useMutation(REGISTER_MUTATION);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!identifier.trim() || !password) {
      setFormError('Semua field wajib diisi.');
      return;
    }

    try {
      const res = await loginMutation({
        variables: { identifier: identifier.trim(), password },
      });
      if (res.data?.login) {
        saveAuth(res.data.login.token, res.data.login.user);
        onClose();
      }
    } catch (err) {
      setFormError(err.message || 'Gagal login. Periksa kembali kredensial Anda.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!email.trim() || !username.trim() || !password) {
      setFormError('Email, username, dan password wajib diisi.');
      return;
    }
    if (password.length < 4) {
      setFormError('Password minimal 4 karakter.');
      return;
    }

    try {
      const res = await registerMutation({
        variables: {
          email: email.trim(),
          username: username.trim(),
          password,
          avatar,
        },
      });
      if (res.data?.register) {
        saveAuth(res.data.register.token, res.data.register.user);
        onClose();
      }
    } catch (err) {
      setFormError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="auth-tab-group">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setFormError('');
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setFormError('');
              }}
            >
              Daftar Akun
            </button>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {formError && <div className="alert-box alert-danger">{formError}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label>Email atau Username</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="misal: alex atau alex@example.com"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loadingLogin}
              className="btn btn-primary btn-block"
            >
              {loadingLogin ? 'Memproses...' : 'Masuk ke Postly'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username unik"
                required
              />
            </div>

            <div className="form-group">
              <label>Password (min. 4 karakter)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label>Pilih Avatar</label>
              <div className="avatar-grid">
                {AVATAR_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className={`avatar-option ${avatar === opt.id ? 'selected' : ''}`}
                    onClick={() => setAvatar(opt.id)}
                  >
                    <img
                      src={`${ASSETS_BASE}/avatars/${opt.id}.webp`}
                      alt={opt.name}
                    />
                    <span>{opt.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingRegister}
              className="btn btn-primary btn-block"
            >
              {loadingRegister ? 'Membuat Akun...' : 'Daftar Sekarang'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
