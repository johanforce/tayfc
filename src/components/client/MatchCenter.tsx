import React, { useState } from 'react';
import { Match, Player } from '../../types';
import { Calendar, MapPin, Play, Users, Trophy, CheckCircle, Clock, Plus } from 'lucide-react';

interface MatchCenterProps {
  matches: Match[];
  players: Player[];
  onSelectMatch: (match: Match) => void;
  onPlayVideo: (url: string, title: string) => void;
  onGoToAdmin?: () => void;
}

export const MatchCenter: React.FC<MatchCenterProps> = ({
  matches,
  players,
  onSelectMatch,
  onPlayVideo,
  onGoToAdmin
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'UPCOMING' | 'FINISHED'>('ALL');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('ALL');

  // Competitions list
  const competitions = React.useMemo(() => {
    const set = new Set<string>();
    matches.forEach(m => set.add(m.competition));
    return ['ALL', ...Array.from(set)];
  }, [matches]);

  const filteredMatches = matches.filter(m => {
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    const matchesComp = selectedCompetition === 'ALL' || m.competition === selectedCompetition;
    return matchesStatus && matchesComp;
  });

  return (
    <section id="matches" className="py-16 bg-slate-950 border-b border-slate-900 scroll-mt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-amber-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Trung Tâm Trận Đấu (Match Center)</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Lịch Thi Đấu & Lịch Sử Trận Đấu
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Cập nhật tỉ số, sơ đồ chiến thuật từng trận, cầu thủ ghi bàn và video bàn thắng của câu lạc bộ.
            </p>
          </div>

          {/* Interactive Filters (Functional Buttons) */}
          {matches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
                <button
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'ALL'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tất cả ({matches.length})
                </button>
                <button
                  onClick={() => setFilterStatus('UPCOMING')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'UPCOMING'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sắp đấu ({matches.filter(m => m.status === 'UPCOMING').length})
                </button>
                <button
                  onClick={() => setFilterStatus('FINISHED')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterStatus === 'FINISHED'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kết quả ({matches.filter(m => m.status === 'FINISHED').length})
                </button>
              </div>

              {/* Competition Filter */}
              {competitions.length > 2 && (
                <select
                  value={selectedCompetition}
                  onChange={(e) => setSelectedCompetition(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="ALL">Mọi giải đấu</option>
                  {competitions.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Matches Grid or Empty State */}
        {matches.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 text-slate-400 space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Chưa có lịch thi đấu hoặc kết quả</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dữ liệu mẫu đã được xóa sạch. Hãy vào Admin Dashboard để thêm các trận đấu sắp diễn ra hoặc kết quả các trận trước đó.
              </p>
            </div>
            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Trận Đấu Mới Trong Admin</span>
              </button>
            )}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
            Không tìm thấy trận đấu nào phù hợp với bộ lọc đã chọn.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMatches.map((match) => {
              const isFinished = match.status === 'FINISHED';
              const matchDate = new Date(match.datetime);

              return (
                <div
                  key={match.id}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-200 shadow-xl flex flex-col justify-between"
                >
                  {/* Top Bar of Card */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-amber-400 font-mono uppercase">
                          {match.competition}
                        </span>
                        <span>·</span>
                        <span className="text-slate-400">{match.round}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        {isFinished ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Kết thúc
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Sắp diễn ra
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Match Scoreboard Area */}
                    <div className="py-6 flex items-center justify-between">
                      {/* Home Team */}
                      <div className="flex-1 flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center mb-2 shadow-inner overflow-hidden">
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
                        <h4 className="font-heading font-bold text-sm text-slate-100 max-w-[130px] truncate">
                          {match.homeTeam.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {match.isHome ? 'Đội nhà' : 'Chủ nhà'}
                        </span>
                      </div>

                      {/* Middle Score or Kickoff */}
                      <div className="px-4 flex flex-col items-center">
                        {isFinished && match.score ? (
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-mono font-black text-amber-400 tabular-nums">
                              {match.score.home}
                            </span>
                            <span className="text-xl font-mono text-slate-600 font-bold">-</span>
                            <span className="text-3xl font-mono font-black text-white tabular-nums">
                              {match.score.away}
                            </span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                              {matchDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="block text-[11px] text-slate-400 mt-0.5">
                              {matchDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                            </span>
                          </div>
                        )}
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-full mt-2 font-semibold">
                          Sơ đồ {match.formation}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div className="flex-1 flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center mb-2 shadow-inner overflow-hidden">
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
                        <h4 className="font-heading font-bold text-sm text-slate-100 max-w-[130px] truncate">
                          {match.awayTeam.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {!match.isHome ? 'Đội nhà' : 'Đội khách'}
                        </span>
                      </div>
                    </div>

                    {/* Scorers Summary if available */}
                    {isFinished && match.scorers && match.scorers.length > 0 && (
                      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4 text-xs text-slate-300">
                        <div className="text-[11px] text-slate-500 uppercase font-mono font-semibold mb-1 flex items-center gap-1">
                          <span>⚽ Bàn thắng:</span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {match.scorers.map((s) => (
                            <span key={s.id} className="text-slate-300">
                              <strong className={s.isClubScorer ? 'text-amber-400' : 'text-slate-300'}>
                                {s.player}
                              </strong>{' '}
                              <span className="text-slate-500 font-mono">({s.minute}')</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Venue & Date info */}
                    <div className="text-xs text-slate-400 flex items-center justify-between pb-4">
                      <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{match.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{matchDate.toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                    <button
                      onClick={() => onSelectMatch(match)}
                      className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Xem Đội Hình & Sân Cỏ ({match.formation})</span>
                    </button>

                    {match.highlightsUrl && (
                      <button
                        onClick={() => onPlayVideo(match.highlightsUrl!, `Video Bàn Thắng: ${match.homeTeam.name} vs ${match.awayTeam.name}`)}
                        className="py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                        title="Xem video bàn thắng"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Highlights</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
