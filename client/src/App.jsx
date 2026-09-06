import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import AuthModal from './components/AuthModal.jsx';
import CreatePostModal from './components/CreatePostModal.jsx';
import Feed from './components/Feed.jsx';
import ProfileView from './components/ProfileView.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState({ type: 'feed' }); // { type: 'feed' } | { type: 'profile', username: string }
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleNavigateFeed = () => {
    setCurrentView({ type: 'feed' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateProfile = (username) => {
    if (!username) return;
    setCurrentView({ type: 'profile', username });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onNavigateFeed={handleNavigateFeed}
        onNavigateProfile={handleNavigateProfile}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenAuth={handleOpenAuth}
        activeView={currentView.type}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '3rem', paddingTop: '1.5rem' }}>
        {currentView.type === 'feed' ? (
          <Feed
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onOpenAuth={handleOpenAuth}
            onAuthorClick={handleNavigateProfile}
          />
        ) : (
          <ProfileView
            username={currentView.username}
            onBackToFeed={handleNavigateFeed}
            onAuthorClick={handleNavigateProfile}
            onOpenAuth={handleOpenAuth}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
          />
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.25rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Postly Participant Kit — AI Native Engineer
      </footer>

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={handleCloseAuth}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </div>
  );
}
