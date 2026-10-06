import React, { useState } from 'react';
import { Match, Player } from '../../types';
import { TacticalPitch } from '../common/TacticalPitch';
import { X, Calendar, MapPin, Play, Users, Trophy, Clock, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface MatchDetailModalProps {
  match: Match | null;
  players: Player[];
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  onPlayVideo: (url: string, title: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  players,
  onClose,
  onSelectPlayer,
  onPlayVideo
}) => {
  const [activeTab, setActiveTab] = useState<'lineup' | 'timeline' | 'report' | 'gallery'>('lineup');

  if (!match) return null;

  const playerMap = new Map<string, Player>();
  players.forEach(p => playerMap.set(p.id, p));

  const substitutePlayers = match.substitutes
    .map(id => playerMap.get(id))
    .filter((p): p is Player => Boolean(p));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Trophy className="w-4 h-4" />
            <span className="font-semibold uppercase">{match.competition}</span>
            <span>·</span>
            <span className="text-slate-400">{match.round}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match Scoreboard Summary */}
        <div className="p-6 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 text-center">
          <div className="flex items-center justify-center gap-4 sm:gap-12">
            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center max-w-[180px]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950 border border-slate-700 p-2 shadow-lg mb-2 flex items-center justify-center overflow-hidden">
                <img
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-100">
                {match.homeTeam.name}
              </h3>
              <span className="text-[11px] text-slate-400">
                {match.isHome ? 'Đội nhà (Home)' : 'Chủ nhà'}
              </span>
            </div>

            {/* Score / Status */}
            <div className="flex flex-col items-center">
              {match.status === 'FINISHED' && match.score ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl font-mono font-black text-amber-400 tabular-nums">
                    {match.score.home}
                  </span>
                  <span className="text-2xl font-mono text-slate-500 font-bold">-</span>
                  <span className="text-4xl sm:text-5xl font-mono font-black text-white tabular-nums">
                    {match.score.away}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-heading font-black text-amber-400 tracking-wider">
                    VS
                  </span>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    Chưa diễn ra
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                {match.status === 'FINISHED' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Kết thúc
                  </span>
                ) : (
                  <span className="text-amber-400">Sắp diễn ra</span>
                )}
                <span>·</span>
                <span>{match.venue}</span>
              </div>

              {/* Watch Highlights Button */}
              {match.highlightsUrl && (
                <button
                  onClick={() => onPlayVideo(match.highlightsUrl!, `Video Highlights: ${match.homeTeam.name} vs ${match.awayTeam.name}`)}
                  className="mt-3 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Xem Video Bàn Thắng</span>
                </button>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center max-w-[180px]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950 border border-slate-700 p-2 shadow-lg mb-2 flex items-center justify-center overflow-hidden">
                <img
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-100">
                {match.awayTeam.name}
              </h3>
              <span className="text-[11px] text-slate-400">
                {!match.isHome ? 'Đội nhà (Home)' : 'Đội khách'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('lineup')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'lineup'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Đội hình ra sân & Sân cỏ ({match.formation})</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Diễn biến & Bàn thắng</span>
          </button>
          {match.matchReport && (
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'report'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Tường thuật trận đấu</span>
            </button>
          )}
          {match.photoGalleryUrls && match.photoGalleryUrls.length > 0 && (
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Ảnh trận đấu ({match.photoGalleryUrls.length})</span>
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: LINEUP & TACTICAL PITCH */}
          {activeTab === 'lineup' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Tactical Pitch (Visual 11 Starter formation) */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <TacticalPitch
                  formation={match.formation}
                  lineup={match.lineup}
                  players={players}
                  onPlayerClick={onSelectPlayer}
                  className="w-full"
                />
                <p className="text-[11px] text-slate-400 mt-2 text-center">
                  💡 Nhấp vào cầu thủ trên sân để xem chi tiết tiểu sử & chỉ số mùa giải
                </p>
              </div>

              {/* Starting 11 List & Bench Substitutes */}
              <div className="lg:col-span-5 space-y-6">
                {/* Starting XI list */}
                <div>
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                    <span>Đội hình xuất phát (11)</span>
                    <span className="text-slate-400">{match.formation}</span>
                  </h4>
                  <div className="space-y-1.5">
                    {match.lineup.map((slot, idx) => {
                      const p = playerMap.get(slot.playerId);
                      return (
                        <div
                          key={idx}
                          onClick={() => p && onSelectPlayer(p)}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold text-xs flex items-center justify-center tabular-nums">
                              {p ? p.number : '?'}
                            </span>
                            <span className="text-sm font-medium text-slate-200">
                              {p ? p.name : 'Vị trí trống'}
                            </span>
                            {p?.isCaptain && (
                              <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1 py-0.5 rounded">
                                (C)
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-emerald-400 font-semibold">
                            {slot.positionCode}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Substitutes Bench */}
                {substitutePlayers.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                      Cầu thủ dự bị (Bench)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {substitutePlayers.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectPlayer(p)}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800/60 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded bg-slate-900 text-slate-300 font-mono text-xs flex items-center justify-center shrink-0">
                              {p.number}
                            </span>
                            <span className="text-xs font-medium text-slate-300 truncate">
                              {p.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {p.position}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE & EVENTS */}
          {activeTab === 'timeline' && (
            <div className="max-w-2xl mx-auto space-y-4">
              {match.scorers && match.scorers.length > 0 && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
                    Danh sách cầu thủ ghi bàn
                  </h4>
                  <div className="space-y-2">
                    {match.scorers.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">⚽</span>
                          <span className="font-semibold text-white">{s.player}</span>
                          {s.isPenalty && <span className="text-xs text-amber-400 font-mono">(Pen)</span>}
                        </div>
                        <span className="text-xs font-mono text-amber-400 font-bold tabular-nums">
                          {s.minute}'
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {match.events && match.events.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                    Diễn biến chi tiết theo thời gian
                  </h4>
                  {match.events.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-start gap-4 p-3 rounded-lg bg-slate-950/50 border border-slate-800"
                    >
                      <span className="w-10 text-center font-mono font-bold text-amber-400 text-sm tabular-nums">
                        {ev.minute}'
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {ev.type === 'GOAL' && <span className="text-base">⚽ Bàn thắng!</span>}
                          {ev.type === 'YELLOW' && <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/40 font-mono">Thẻ Vàng</span>}
                          {ev.type === 'RED' && <span className="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded border border-red-500/40 font-mono">Thẻ Đỏ</span>}
                          {ev.type === 'SUB' && <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/40 font-mono">Thay Người</span>}
                          <strong className="text-sm text-slate-100">{ev.player}</strong>
                          {ev.subIn && <span className="text-xs text-emerald-400">→ Vào: {ev.subIn}</span>}
                        </div>
                        {ev.detail && <p className="text-xs text-slate-400 mt-1">{ev.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Chưa có sự kiện diễn biến nào được ghi nhận cho trận đấu này.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MATCH REPORT */}
          {activeTab === 'report' && match.matchReport && (
            <div className="max-w-3xl mx-auto bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
              <h4 className="font-heading font-bold text-lg text-amber-400 mb-3">
                Báo cáo & Nhận định trận đấu
              </h4>
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                {match.matchReport}
              </p>
            </div>
          )}

          {/* TAB 4: PHOTO GALLERY */}
          {activeTab === 'gallery' && match.photoGalleryUrls && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {match.photoGalleryUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={url}
                    alt={`Ảnh trận đấu ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 text-[10px] bg-slate-950/80 px-2 py-0.5 rounded text-slate-300 font-mono">
                    Ảnh #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(match.datetime).toLocaleDateString('vi-VN')} lúc {new Date(match.datetime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
