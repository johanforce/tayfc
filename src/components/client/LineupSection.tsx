import React, { useState } from 'react';
import { Match, Player } from '../../types';
import { TacticalPitch } from '../common/TacticalPitch';
import { Users, ChevronRight, Shield, Award, Calendar, Plus } from 'lucide-react';

interface LineupSectionProps {
  matches: Match[];
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onGoToAdmin?: () => void;
}

export const LineupSection: React.FC<LineupSectionProps> = ({
  matches,
  players,
  onSelectPlayer,
  onGoToAdmin
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const activeMatch = matches.find(m => m.id === selectedMatchId) || matches[0];

  const playerMap = React.useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach(p => map.set(p.id, p));
    return map;
  }, [players]);

  return (
    <section id="lineup" className="py-16 bg-slate-900/50 border-b border-slate-900 scroll-mt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-emerald-400 mb-1">
              <Users className="w-4 h-4" />
              <span>Sơ Đồ Chiến Thuật & Đội Hình Ra Sân</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Đội Hình Thi Đấu Từng Trận
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Khám phá cách bố trí chiến thuật, 11 cầu thủ đá chính trên sân cỏ thực tế và dàn dự bị chiến lược.
            </p>
          </div>

          {/* Match selector dropdown / buttons if matches exist */}
          {matches.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Chọn trận đấu:</span>
              <select
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.competition} - vs {m.isHome ? m.awayTeam.name : m.homeTeam.name} ({m.formation})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Empty state or Pitch Layout */}
        {!activeMatch ? (
          <div className="p-12 text-center bg-slate-950/80 rounded-3xl border border-slate-800 text-slate-400 space-y-4 max-w-xl mx-auto shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Chưa có trận đấu để thiết lập đội hình</h3>
              <p className="text-xs text-slate-400 mt-1">
                Khi bạn tạo trận đấu trong Admin Dashboard, bạn có thể tự do bố trí sơ đồ chiến thuật (4-3-3, 4-2-3-1, 3-5-2...) và 11 cầu thủ đá chính trên mặt sân cỏ.
              </p>
            </div>
            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Trận Đấu & Xếp Đội Hình Trong Admin</span>
              </button>
            )}
          </div>
        ) : (
          /* Pitch & Details Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Tactical Pitch Column */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  Đối đầu: <span className="text-amber-400">{activeMatch.homeTeam.name} vs {activeMatch.awayTeam.name}</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  Sơ đồ {activeMatch.formation}
                </span>
              </div>

              <TacticalPitch
                formation={activeMatch.formation}
                lineup={activeMatch.lineup}
                players={players}
                onPlayerClick={onSelectPlayer}
                className="w-full"
              />
              
              <p className="text-xs text-slate-500 mt-3 text-center">
                Nhấp trực tiếp vào cầu thủ trên sân cỏ để mở hồ sơ năng lực chi tiết.
              </p>
            </div>

            {/* Lineup Roster Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Starter XI list */}
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <h3 className="font-heading font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    11 Cầu Thủ Ra Sân
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Đá chính</span>
                </div>

                <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                  {activeMatch.lineup.map((slot, index) => {
                    const p = playerMap.get(slot.playerId);
                    return (
                      <div
                        key={index}
                        onClick={() => p && onSelectPlayer(p)}
                        className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center tabular-nums group-hover:border-amber-400 transition-colors">
                            {p ? p.number : '?'}
                          </span>
                          <div>
                            <span className="text-sm font-semibold text-slate-200 group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                              {p ? p.name : 'Vị trí trống'}
                              {p?.isCaptain && (
                                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1 rounded">
                                  C
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {p ? p.subPosition : 'Chưa phân bổ'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">
                            {slot.positionCode}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bench Substitutes */}
              {activeMatch.substitutes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <h3 className="font-heading font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      Dự Bị Chiến Lược (Substitutes)
                    </h3>
                    <span className="text-xs font-mono text-slate-500">{activeMatch.substitutes.length} cầu thủ</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeMatch.substitutes.map((id) => {
                      const p = playerMap.get(id);
                      if (!p) return null;
                      return (
                        <div
                          key={id}
                          onClick={() => onSelectPlayer(p)}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-slate-800/60 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded bg-slate-950 text-slate-400 font-mono text-xs flex items-center justify-center shrink-0">
                              {p.number}
                            </span>
                            <span className="text-xs font-medium text-slate-300 truncate">
                              {p.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {p.position}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
