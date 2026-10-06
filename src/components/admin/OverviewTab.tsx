import React, { useRef } from 'react';
import { AppDatabase, Player, Match } from '../../types';
import { storageService } from '../../services/storageService';
import { Users, Calendar, Trophy, Film, Download, Upload, Trash2, Plus, Activity, Cloud, Sparkles } from 'lucide-react';

interface OverviewTabProps {
  database: AppDatabase;
  onNavigateTab: (tab: string) => void;
  onUpdateDatabase: (db: AppDatabase) => void;
  onOpenNewPlayerModal: () => void;
  onOpenNewMatchModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  database,
  onNavigateTab,
  onUpdateDatabase,
  onOpenNewPlayerModal,
  onOpenNewMatchModal
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalGoals = database.players.reduce((sum, p) => sum + (p.stats.goals || 0), 0);
  const totalAssists = database.players.reduce((sum, p) => sum + (p.stats.assists || 0), 0);
  const upcomingCount = database.matches.filter(m => m.status === 'UPCOMING').length;
  const finishedCount = database.matches.filter(m => m.status === 'FINISHED').length;
  const isDataEmpty = database.players.length === 0 && database.matches.length === 0;

  const handleExport = () => {
    storageService.exportDatabaseJSON(database);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedDb = storageService.importDatabaseJSON(content);
        onUpdateDatabase(importedDb);
        alert('Đã nhập dữ liệu thành công từ tệp JSON!');
      } catch (err: any) {
        alert('Lỗi khi nhập tệp: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sạch toàn bộ dữ liệu trên web? Thao tác này sẽ làm trống danh sách cầu thủ, trận đấu và tin tức để bạn bắt đầu nhập lại.')) {
      const emptyDb = storageService.clearAllData();
      onUpdateDatabase(emptyDb);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
            Bảng Điều Khiển Quản Trị
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Quản Lý Dữ Liệu {database.clubInfo.name}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Cơ sở dữ liệu sạch, sẵn sàng để bạn thêm cầu thủ, trận đấu, chiến thuật và liên kết Firebase Storage.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenNewPlayerModal}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-md whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Cầu Thủ Mới</span>
          </button>
          <button
            onClick={onOpenNewMatchModal}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Thêm Trận Đấu Mới</span>
          </button>
        </div>
      </div>

      {/* Welcome Banner when data is empty */}
      {isDataEmpty && (
        <div className="p-5 bg-amber-950/30 border border-amber-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">
                Web đã được dọn sạch dữ liệu demo!
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Bắt đầu bằng cách thêm các cầu thủ trong biên chế CLB của bạn, sau đó tạo trận đấu sắp tới để hiển thị lịch thi đấu trên trang Fan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewPlayerModal}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg cursor-pointer whitespace-nowrap"
            >
              + Bắt đầu thêm cầu thủ
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('players')}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Tổng số cầu thủ</span>
            <Users className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-heading font-black text-white font-mono tabular-nums">
            {database.players.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {database.players.length === 0 ? 'Chưa có cầu thủ nào' : `${database.players.length} cầu thủ trong danh sách`}
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('matches')}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Trận đấu</span>
            <Calendar className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-heading font-black text-white font-mono tabular-nums">
            {database.matches.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {upcomingCount} trận sắp tới · {finishedCount} đã đấu
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('lineups')}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Bàn thắng toàn đội</span>
            <Activity className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-heading font-black text-white font-mono tabular-nums">
            {totalGoals}
          </div>
          <span className="text-[11px] text-cyan-400 mt-1 block">
            {totalAssists} đường kiến tạo thành bàn
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('media')}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Nội dung Firebase Media</span>
            <Film className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-heading font-black text-white font-mono tabular-nums">
            {database.mediaItems.length + database.articles.length}
          </div>
          <span className="text-[11px] text-purple-400 mt-1 block truncate">
            {database.mediaItems.length} media · {database.articles.length} bài viết
          </span>
        </div>
      </div>

      {/* Navigation Shortcuts Grid */}
      <div>
        <h3 className="font-heading font-bold text-base text-slate-200 mb-4">
          Lối Tắt Quản Lý Nhanh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigateTab('players')}
            className="p-5 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 rounded-xl cursor-pointer transition-colors"
          >
            <div className="text-amber-400 font-mono text-xs font-bold uppercase mb-1">
              Nhân sự & Chỉ số
            </div>
            <h4 className="font-heading font-bold text-white text-base">
              Thêm & Quản Lý Cầu Thủ →
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Nhập tên, số áo, vị trí, ảnh đại diện, số bàn thắng, kiến tạo, và tiểu sử cầu thủ.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('matches')}
            className="p-5 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 rounded-xl cursor-pointer transition-colors"
          >
            <div className="text-emerald-400 font-mono text-xs font-bold uppercase mb-1">
              Trận đấu
            </div>
            <h4 className="font-heading font-bold text-white text-base">
              Lịch Đấu & Kết Quả →
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Thêm đối thủ, thời gian thi đấu, tỉ số, cầu thủ ghi bàn và video highlights.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('media')}
            className="p-5 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 rounded-xl cursor-pointer transition-colors"
          >
            <div className="text-cyan-400 font-mono text-xs font-bold uppercase mb-1">
              Firebase Storage
            </div>
            <h4 className="font-heading font-bold text-white text-base">
              Cấu Hình Media & Video →
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Cấu hình bucket Firebase Storage, liên kết video MP4 và các bài viết tin tức.
            </p>
          </div>
        </div>
      </div>

      {/* Database Backup & Storage Management */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-400" />
              Lưu Trữ Dữ Liệu & Sao Lưu (Data Persistence)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Mọi dữ liệu bạn bơm vào sẽ tự động lưu trong trình duyệt. Bạn có thể xuất tệp JSON bất kỳ lúc nào để lưu trữ dự phòng.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Xuất Tệp JSON</span>
            </button>

            <button
              onClick={handleImportClick}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nhập Tệp JSON</span>
            </button>

            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900 text-rose-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              title="Xóa trắng mọi dữ liệu hiện tại"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Xóa Sạch Dữ Liệu</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
