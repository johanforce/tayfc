import React, { useState } from 'react';
import { AppDatabase, Player, Match, FirebaseStorageConfig, MediaItem, Article, ClubInfo } from '../../types';
import { OverviewTab } from './OverviewTab';
import { PlayersManagerTab } from './PlayersManagerTab';
import { MatchesManagerTab } from './MatchesManagerTab';
import { LineupTacticsEditorTab } from './LineupTacticsEditorTab';
import { FirebaseMediaManagerTab } from './FirebaseMediaManagerTab';
import { ClubSettingsTab } from './ClubSettingsTab';
import { LayoutDashboard, Users, Calendar, Shield, Cloud, Settings, Eye, CheckCircle2 } from 'lucide-react';

interface AdminDashboardProps {
  database: AppDatabase;
  onUpdateDatabase: (db: AppDatabase) => void;
  onReturnToClient: () => void;
  onPlayVideo: (url: string, title: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  database,
  onUpdateDatabase,
  onReturnToClient,
  onPlayVideo
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lineups' | 'players' | 'matches' | 'media' | 'settings'>('overview');
  const [openPlayerModal, setOpenPlayerModal] = useState(false);
  const [openMatchModal, setOpenMatchModal] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Handlers for updating sub-entities
  const handleSavePlayer = (player: Player) => {
    const existingIndex = database.players.findIndex(p => p.id === player.id);
    let updatedPlayers: Player[];
    if (existingIndex >= 0) {
      updatedPlayers = [...database.players];
      updatedPlayers[existingIndex] = player;
    } else {
      updatedPlayers = [...database.players, player];
    }
    const updatedDb: AppDatabase = { ...database, players: updatedPlayers };
    onUpdateDatabase(updatedDb);
    triggerToast(`Đã lưu cầu thủ ${player.name} thành công!`);
  };

  const handleDeletePlayer = (playerId: string) => {
    const updatedPlayers = database.players.filter(p => p.id !== playerId);
    const updatedDb: AppDatabase = { ...database, players: updatedPlayers };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã xóa cầu thủ khỏi danh sách.');
  };

  const handleSaveMatch = (match: Match) => {
    const existingIndex = database.matches.findIndex(m => m.id === match.id);
    let updatedMatches: Match[];
    if (existingIndex >= 0) {
      updatedMatches = [...database.matches];
      updatedMatches[existingIndex] = match;
    } else {
      updatedMatches = [match, ...database.matches];
    }
    const updatedDb: AppDatabase = { ...database, matches: updatedMatches };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã lưu thông tin trận đấu thành công!');
  };

  const handleDeleteMatch = (matchId: string) => {
    const updatedMatches = database.matches.filter(m => m.id !== matchId);
    const updatedDb: AppDatabase = { ...database, matches: updatedMatches };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã xóa trận đấu thành công.');
  };

  const handleUpdateMatchLineup = (
    matchId: string,
    formation: string,
    lineup: any[],
    substitutes: string[]
  ) => {
    const updatedMatches = database.matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          formation,
          lineup,
          substitutes
        };
      }
      return m;
    });
    const updatedDb: AppDatabase = { ...database, matches: updatedMatches };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã cập nhật chiến thuật và đội hình trận đấu!');
  };

  const handleUpdateFirebaseConfig = (config: FirebaseStorageConfig) => {
    const updatedDb: AppDatabase = { ...database, firebaseConfig: config };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã lưu cấu hình Firebase Storage!');
  };

  const handleSaveMediaItem = (item: MediaItem) => {
    const existingIdx = database.mediaItems.findIndex(m => m.id === item.id);
    let updatedMedia: MediaItem[];
    if (existingIdx >= 0) {
      updatedMedia = [...database.mediaItems];
      updatedMedia[existingIdx] = item;
    } else {
      updatedMedia = [item, ...database.mediaItems];
    }
    const updatedDb: AppDatabase = { ...database, mediaItems: updatedMedia };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã lưu file media!');
  };

  const handleDeleteMediaItem = (itemId: string) => {
    const updatedMedia = database.mediaItems.filter(m => m.id !== itemId);
    const updatedDb: AppDatabase = { ...database, mediaItems: updatedMedia };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã xóa tệp media.');
  };

  const handleSaveArticle = (article: Article) => {
    const existingIdx = database.articles.findIndex(a => a.id === article.id);
    let updatedArticles: Article[];
    if (existingIdx >= 0) {
      updatedArticles = [...database.articles];
      updatedArticles[existingIdx] = article;
    } else {
      updatedArticles = [article, ...database.articles];
    }
    const updatedDb: AppDatabase = { ...database, articles: updatedArticles };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã lưu bài viết!');
  };

  const handleDeleteArticle = (articleId: string) => {
    const updatedArticles = database.articles.filter(a => a.id !== articleId);
    const updatedDb: AppDatabase = { ...database, articles: updatedArticles };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã xóa bài viết.');
  };

  const handleUpdateClubInfo = (info: ClubInfo) => {
    const updatedDb: AppDatabase = { ...database, clubInfo: info };
    onUpdateDatabase(updatedDb);
    triggerToast('Đã cập nhật thông tin câu lạc bộ!');
  };

  const navItems = [
    { id: 'overview', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'lineups', label: 'Đội Hình Từng Trận', icon: Shield },
    { id: 'players', label: 'Cầu Thủ & Chỉ Số', icon: Users },
    { id: 'matches', label: 'Lịch Đấu & Kết Quả', icon: Calendar },
    { id: 'media', label: 'Firebase Media & Tin', icon: Cloud },
    { id: 'settings', label: 'Cài Đặt CLB', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center font-mono text-xs">
              AD
            </span>
            <div>
              <span className="font-heading font-extrabold text-sm sm:text-base text-white">
                Admin Dashboard
              </span>
              <span className="text-[11px] text-amber-400 block font-mono">
                {database.clubInfo.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToClient}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xem Trang Cổ Động Viên</span>
            </button>
          </div>
        </div>

        {/* Admin Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-slate-800/80 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            database={database}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            onUpdateDatabase={onUpdateDatabase}
            onOpenNewPlayerModal={() => {
              setActiveTab('players');
              setOpenPlayerModal(true);
            }}
            onOpenNewMatchModal={() => {
              setActiveTab('matches');
              setOpenMatchModal(true);
            }}
          />
        )}

        {activeTab === 'lineups' && (
          <LineupTacticsEditorTab
            matches={database.matches}
            players={database.players}
            onUpdateMatchLineup={handleUpdateMatchLineup}
            onNavigateToMatches={() => setActiveTab('matches')}
          />
        )}

        {activeTab === 'players' && (
          <PlayersManagerTab
            players={database.players}
            onSavePlayer={handleSavePlayer}
            onDeletePlayer={handleDeletePlayer}
            isCreateModalOpen={openPlayerModal}
            onCloseCreateModal={() => setOpenPlayerModal(false)}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesManagerTab
            matches={database.matches}
            clubInfo={database.clubInfo}
            onSaveMatch={handleSaveMatch}
            onDeleteMatch={handleDeleteMatch}
            isCreateModalOpen={openMatchModal}
            onCloseCreateModal={() => setOpenMatchModal(false)}
          />
        )}

        {activeTab === 'media' && (
          <FirebaseMediaManagerTab
            firebaseConfig={database.firebaseConfig}
            mediaItems={database.mediaItems}
            articles={database.articles}
            onUpdateFirebaseConfig={handleUpdateFirebaseConfig}
            onSaveMediaItem={handleSaveMediaItem}
            onDeleteMediaItem={handleDeleteMediaItem}
            onSaveArticle={handleSaveArticle}
            onDeleteArticle={handleDeleteArticle}
            onPlayVideo={onPlayVideo}
          />
        )}

        {activeTab === 'settings' && (
          <ClubSettingsTab
            clubInfo={database.clubInfo}
            onUpdateClubInfo={handleUpdateClubInfo}
          />
        )}
      </main>
    </div>
  );
};
