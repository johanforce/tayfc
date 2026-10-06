import React from 'react';
import { Player } from '../../types';
import { X, Shield, Award, Calendar, Activity, TrendingUp, Sparkles } from 'lucide-react';

interface PlayerDetailModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-full transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Player Banner */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6 md:p-8 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Player Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-400/80 shadow-xl shrink-0">
              <img
                src={player.avatarUrl}
                alt={player.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-xs font-black font-mono px-1.5 py-0.5 rounded shadow">
                #{player.number}
              </div>
            </div>

            {/* Info summary */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-amber-400 font-mono uppercase tracking-wider mb-1">
                <span>{player.position}</span>
                <span>·</span>
                <span>{player.subPosition}</span>
                {player.isCaptain && (
                  <>
                    <span>·</span>
                    <span className="text-amber-300 font-bold">Thủ quân (Captain)</span>
                  </>
                )}
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                {player.name}
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-lg">
                {player.bio}
              </p>

              {/* Quick tags */}
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="text-slate-500">Quốc tịch:</span> {player.nationality}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-500">Chân thuận:</span> {player.preferredFoot}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-500">Định giá:</span> <strong className="text-emerald-400 font-mono">{player.marketValue}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body: Stats and Physical Info */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Season Stats */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Thống kê mùa giải hiện tại
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                <span className="text-xs text-slate-400">Trận ra sân</span>
                <p className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                  {player.stats.appearances}
                </p>
                <span className="text-[11px] text-slate-500 font-mono">{player.stats.minutesPlayed} phút</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                <span className="text-xs text-slate-400">Bàn thắng</span>
                <p className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                  {player.stats.goals}
                </p>
                <span className="text-[11px] text-slate-500">Hiệu suất 0.{(player.stats.goals / (player.stats.appearances || 1)).toFixed(2).slice(2)}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                <span className="text-xs text-slate-400">Kiến tạo</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                  {player.stats.assists}
                </p>
                <span className="text-[11px] text-slate-500">Tạo cơ hội ghi bàn</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                <span className="text-xs text-slate-400">
                  {player.position === 'GK' || player.position === 'DF' ? 'Sạch lưới' : 'Tỉ lệ chuyền bóng'}
                </span>
                <p className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                  {player.position === 'GK' || player.position === 'DF'
                    ? player.stats.cleanSheets
                    : `${player.stats.passAccuracy}%`}
                </p>
                <span className="text-[11px] text-slate-500">
                  {player.position === 'GK' || player.position === 'DF' ? 'Clean sheets' : 'Độ chính xác'}
                </span>
              </div>
            </div>
          </div>

          {/* Physical & Contract Information Grid */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Thông tin thể chất & Hợp đồng
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-xs text-slate-500 block">Tuổi / Ngày sinh</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {player.age} tuổi ({player.dateOfBirth})
                </span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-xs text-slate-500 block">Thể hình</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {player.height} cm · {player.weight} kg
                </span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-xs text-slate-500 block">Kỷ luật (Thẻ phạt)</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {player.stats.yellowCards} Thẻ vàng · {player.stats.redCards} Thẻ đỏ
                </span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-xs text-slate-500 block">Năm gia nhập</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {player.joinedYear}
                </span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-xs text-slate-500 block">Hợp đồng đến</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {player.contractUntil}
                </span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-xs text-slate-500 block">Firebase Storage Ref</span>
                <span className="font-mono text-xs text-amber-300 truncate mt-0.5 block" title={player.firebaseStorageImageRef || 'Chưa liên kết'}>
                  {player.firebaseStorageImageRef || 'media/players/...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
