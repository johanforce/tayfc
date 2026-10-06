import React, { useState, useEffect } from 'react';
import { AppDatabase, Player, Match } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PlayerDetailModal } from './components/common/PlayerDetailModal';
import { VideoPlayerModal } from './components/common/VideoPlayerModal';
import { HeroBanner } from './components/client/HeroBanner';
import { MatchCenter } from './components/client/MatchCenter';
import { LineupSection } from './components/client/LineupSection';
import { SquadSection } from './components/client/SquadSection';
import { MediaAndNewsSection } from './components/client/MediaAndNewsSection';
import { ClubHistorySection } from './components/client/ClubHistorySection';
import { MatchDetailModal } from './components/client/MatchDetailModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [database, setDatabase] = useState<AppDatabase>(() => storageService.loadDatabase());
  const [activeView, setActiveView] = useState<'client' | 'admin'>('client');

  // Modals state
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: ''
  });

  // Sync state changes to localStorage
  const handleUpdateDatabase = (newDb: AppDatabase) => {
    setDatabase(newDb);
    storageService.saveDatabase(newDb);
  };

  const upcomingMatch = database.matches.find(m => m.status === 'UPCOMING') || database.matches[0];

  const handleOpenVideo = (url: string, title: string) => {
    setVideoModal({ isOpen: true, url, title });
  };

  const handleCloseVideo = () => {
    setVideoModal({ isOpen: false, url: '', title: '' });
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {activeView === 'admin' ? (
        <AdminDashboard
          database={database}
          onUpdateDatabase={handleUpdateDatabase}
          onReturnToClient={() => setActiveView('client')}
          onPlayVideo={handleOpenVideo}
        />
      ) : (
        <>
          {/* Header Navigation */}
          <Navbar
            clubInfo={database.clubInfo}
            activeView={activeView}
            onViewChange={setActiveView}
            onNavigateSection={handleNavigateSection}
          />

          {/* Main Fan Portal Content */}
          <main className="flex-1">
            {/* Hero Banner with Next Match Spotlight & Live Countdown */}
            <HeroBanner
              clubInfo={database.clubInfo}
              upcomingMatch={upcomingMatch}
              onSelectMatch={(m) => setSelectedMatch(m)}
              onExploreSquad={() => handleNavigateSection('squad')}
              onPlayHighlight={handleOpenVideo}
              onGoToAdmin={() => setActiveView('admin')}
            />

            {/* Match Center: Fixtures & Historic Derby Results */}
            <MatchCenter
              matches={database.matches}
              players={database.players}
              onSelectMatch={(m) => setSelectedMatch(m)}
              onPlayVideo={handleOpenVideo}
              onGoToAdmin={() => setActiveView('admin')}
            />

            {/* Tactical Pitch & Formation Lineup Section */}
            <LineupSection
              matches={database.matches}
              players={database.players}
              onSelectPlayer={(p) => setSelectedPlayer(p)}
              onGoToAdmin={() => setActiveView('admin')}
            />

            {/* First Team Squad & Detailed Profiles */}
            <SquadSection
              players={database.players}
              onSelectPlayer={(p) => setSelectedPlayer(p)}
              onGoToAdmin={() => setActiveView('admin')}
            />

            {/* Media & News Section (Firebase Storage support) */}
            <MediaAndNewsSection
              articles={database.articles}
              mediaItems={database.mediaItems}
              onPlayVideo={handleOpenVideo}
              onGoToAdmin={() => setActiveView('admin')}
            />

            {/* Club History, Trophies & Stadium */}
            <ClubHistorySection clubInfo={database.clubInfo} />
          </main>

          {/* Footer */}
          <Footer
            clubInfo={database.clubInfo}
            onNavigateSection={handleNavigateSection}
            onGoToAdmin={() => setActiveView('admin')}
          />
        </>
      )}

      {/* Global Modals */}
      <PlayerDetailModal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />

      <MatchDetailModal
        match={selectedMatch}
        players={database.players}
        onClose={() => setSelectedMatch(null)}
        onSelectPlayer={(p) => setSelectedPlayer(p)}
        onPlayVideo={handleOpenVideo}
      />

      <VideoPlayerModal
        isOpen={videoModal.isOpen}
        onClose={handleCloseVideo}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </div>
  );
}
