import React, { useState } from 'react';
import { Player, PositionGroup } from '../../types';
import { Users, Search, Shield, Award, ArrowUpDown, ChevronRight, Plus } from 'lucide-react';

interface SquadSectionProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onGoToAdmin?: () => void;
}

export const SquadSection: React.FC<SquadSectionProps> = ({
  players,
  onSelectPlayer,
  onGoToAdmin
}) => {
  const [selectedGroup, setSelectedGroup] = useState<PositionGroup | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'goals' | 'assists' | 'appearances'>('number');

  const filteredPlayers = players
    .filter((p) => {
      const matchGroup = selectedGroup === 'ALL' || p.position === selectedGroup;
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.number).includes(searchQuery) ||
        p.subPosition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGroup && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'goals') return b.stats.goals - a.stats.goals;
      if (sortBy === 'assists') return b.stats.assists - a.stats.assists;
      if (sortBy === 'appearances') return b.stats.appearances - a.stats.appearances;
      return a.number - b.number;
    });

  const getPositionTitle = (group: PositionGroup) => {
    switch (group) {
      case 'GK': return 'Thủ môn';
      case 'DF': return 'Hậu vệ';
      case 'MF': return 'Tiền vệ';
      case 'FW': return 'Tiền đạo';
    }
  };

  return (
    <section id="squad" className="py-16 bg-slate-950 border-b border-slate-900 scroll-mt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-amber-400 mb-1">
              <Users className="w-4 h-4" />
              <span>Danh Sách Đội Hình (First Team Squad)</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Thông Tin Chi Tiết Về Các Cầu Thủ
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Hồ sơ năng lực, chỉ số thi đấu cá nhân, thể hình và thành tích của toàn thể cầu thủ đội bóng.
            </p>
          </div>

          {/* Search Bar & Sorter if players exist */}
          {players.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tên, số áo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm rounded-xl focus:outline-none focus:border-amber-400 placeholder-slate-500 w-44 sm:w-56"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="number">Xếp theo: Số áo</option>
                <option value="goals">Xếp theo: Bàn thắng</option>
                <option value="assists">Xếp theo: Kiến tạo</option>
                <option value="appearances">Xếp theo: Số trận ra sân</option>
              </select>
            </div>
          )}
        </div>

        {/* Position Filter Buttons if players exist */}
        {players.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl mb-8 overflow-x-auto">
            <button
              onClick={() => setSelectedGroup('ALL')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedGroup === 'ALL'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất cả ({players.length})
            </button>
            {(['GK', 'DF', 'MF', 'FW'] as PositionGroup[]).map((pos) => {
              const count = players.filter((p) => p.position === pos).length;
              return (
                <button
                  key={pos}
                  onClick={() => setSelectedGroup(pos)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    selectedGroup === pos
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {getPositionTitle(pos)} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Empty State or Players Grid */}
        {players.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 text-slate-400 space-y-4 max-w-xl mx-auto shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Chưa có cầu thủ nào trong danh sách</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dữ liệu mẫu đã được xóa sạch. Hãy vào Admin Dashboard để thêm các cầu thủ chính thức, nhập chỉ số, số áo và liên kết ảnh đại diện.
              </p>
            </div>
            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Cầu Thủ Mới Trong Admin</span>
              </button>
            )}
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
            Không tìm thấy cầu thủ nào phù hợp với từ khóa tìm kiếm.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between"
              >
                {/* Card Top: Number & Captain Badges */}
                <div className="relative aspect-[4/3] bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent overflow-hidden">
                  <img
                    src={player.avatarUrl}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20 pointer-events-none" />

                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs border border-amber-400/40 text-amber-400 font-mono font-black text-sm px-2.5 py-1 rounded-lg shadow-md tabular-nums">
                    #{player.number}
                  </div>

                  {player.isCaptain && (
                    <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded shadow-md uppercase tracking-wider">
                      Thủ Quân
                    </div>
                  )}

                  <div className="absolute bottom-2 left-3 text-xs text-amber-400 font-mono font-semibold">
                    {player.subPosition}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                      {player.name}
                    </h3>
                    
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>{player.nationality}</span>
                      <span>·</span>
                      <span>{player.age} tuổi</span>
                      <span>·</span>
                      <span>{player.height} cm</span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {player.bio}
                    </p>
                  </div>

                  {/* Key Stats Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase block">Trận</span>
                        <span className="font-mono font-bold text-white tabular-nums">
                          {player.stats.appearances}
                        </span>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase block">Bàn</span>
                        <span className="font-mono font-bold text-amber-400 tabular-nums">
                          {player.stats.goals}
                        </span>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase block">Kiến tạo</span>
                        <span className="font-mono font-bold text-emerald-400 tabular-nums">
                          {player.stats.assists}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">
                      <span>Xem hồ sơ chi tiết</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
