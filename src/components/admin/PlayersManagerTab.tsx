import React, { useState } from 'react';
import { Player, PositionGroup } from '../../types';
import { Plus, Edit2, Trash2, Search, X, Check, Shield, User, Activity } from 'lucide-react';

interface PlayersManagerTabProps {
  players: Player[];
  onSavePlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const PlayersManagerTab: React.FC<PlayersManagerTabProps> = ({
  players,
  onSavePlayer,
  onDeletePlayer,
  isCreateModalOpen = false,
  onCloseCreateModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<PositionGroup | 'ALL'>('ALL');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Player>>({});

  const openCreateModal = () => {
    setEditingPlayer(null);
    setFormData({
      id: `p-${Date.now()}`,
      name: '',
      number: 10,
      position: 'FW',
      subPosition: 'Tiền đạo',
      nationality: 'Việt Nam',
      dateOfBirth: '2000-01-01',
      age: 26,
      height: 180,
      weight: 75,
      preferredFoot: 'Phải',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
      marketValue: '€300.000',
      joinedYear: new Date().getFullYear(),
      contractUntil: `${new Date().getFullYear() + 3}`,
      isCaptain: false,
      isViceCaptain: false,
      bio: 'Cầu thủ tài năng với tinh thần thi đấu nhiệt huyết.',
      stats: {
        appearances: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
        passAccuracy: 80
      }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setFormData(JSON.parse(JSON.stringify(player)));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Vui lòng nhập họ và tên cầu thủ.');
      return;
    }

    const savedPlayer: Player = {
      id: formData.id || `p-${Date.now()}`,
      name: formData.name.trim(),
      number: Number(formData.number) || 0,
      position: (formData.position as PositionGroup) || 'FW',
      subPosition: formData.subPosition || 'Cầu thủ',
      nationality: formData.nationality || 'Việt Nam',
      dateOfBirth: formData.dateOfBirth || '2000-01-01',
      age: Number(formData.age) || 24,
      height: Number(formData.height) || 180,
      weight: Number(formData.weight) || 75,
      preferredFoot: formData.preferredFoot as any || 'Phải',
      avatarUrl: formData.avatarUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
      marketValue: formData.marketValue || '€250.000',
      joinedYear: Number(formData.joinedYear) || 2024,
      contractUntil: formData.contractUntil || '2027',
      isCaptain: Boolean(formData.isCaptain),
      isViceCaptain: Boolean(formData.isViceCaptain),
      bio: formData.bio || '',
      stats: {
        appearances: Number(formData.stats?.appearances) || 0,
        goals: Number(formData.stats?.goals) || 0,
        assists: Number(formData.stats?.assists) || 0,
        cleanSheets: Number(formData.stats?.cleanSheets) || 0,
        yellowCards: Number(formData.stats?.yellowCards) || 0,
        redCards: Number(formData.stats?.redCards) || 0,
        minutesPlayed: Number(formData.stats?.minutesPlayed) || 0,
        passAccuracy: Number(formData.stats?.passAccuracy) || 80
      },
      firebaseStorageImageRef: formData.firebaseStorageImageRef
    };

    onSavePlayer(savedPlayer);
    setIsModalOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cầu thủ ${name} khỏi danh sách đội bóng?`)) {
      onDeletePlayer(id);
    }
  };

  const filteredPlayers = players
    .filter((p) => {
      const matchGroup = filterGroup === 'ALL' || p.position === filterGroup;
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.number).includes(searchQuery) ||
        p.subPosition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGroup && matchQuery;
    })
    .sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Quản Lý Danh Sách Cầu Thủ
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tổng cộng: <strong className="text-amber-400">{players.length}</strong> cầu thủ trong biên chế CLB.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Cầu Thủ Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterGroup('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filterGroup === 'ALL' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất cả ({players.length})
          </button>
          <button
            onClick={() => setFilterGroup('GK')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filterGroup === 'GK' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Thủ môn ({players.filter(p => p.position === 'GK').length})
          </button>
          <button
            onClick={() => setFilterGroup('DF')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filterGroup === 'DF' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hậu vệ ({players.filter(p => p.position === 'DF').length})
          </button>
          <button
            onClick={() => setFilterGroup('MF')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filterGroup === 'MF' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tiền vệ ({players.filter(p => p.position === 'MF').length})
          </button>
          <button
            onClick={() => setFilterGroup('FW')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filterGroup === 'FW' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tiền đạo ({players.filter(p => p.position === 'FW').length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, số áo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl focus:outline-none focus:border-amber-400 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Players List Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Số áo</th>
                <th className="py-3.5 px-4">Cầu thủ</th>
                <th className="py-3.5 px-4">Vị trí</th>
                <th className="py-3.5 px-4">Quốc tịch</th>
                <th className="py-3.5 px-4 text-center">Trận</th>
                <th className="py-3.5 px-4 text-center">Bàn</th>
                <th className="py-3.5 px-4 text-center">Kiến tạo</th>
                <th className="py-3.5 px-4">Định giá</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400 text-sm tabular-nums">
                    #{player.number}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img
                          src={player.avatarUrl}
                          alt={player.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                          {player.name}
                          {player.isCaptain && (
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1 rounded">
                              C
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {player.age} tuổi · {player.height} cm
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-emerald-400 font-semibold block">
                      {player.position}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {player.subPosition}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {player.nationality}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-slate-200 tabular-nums">
                    {player.stats.appearances}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-amber-400 tabular-nums">
                    {player.stats.goals}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400 tabular-nums">
                    {player.stats.assists}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {player.marketValue}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(player)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(player.id, player.name)}
                        className="p-1.5 bg-slate-900 hover:bg-rose-950/60 text-rose-400 rounded-lg transition-colors cursor-pointer"
                        title="Xóa cầu thủ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isModalOpen || isCreateModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                {editingPlayer ? `Chỉnh sửa cầu thủ #${editingPlayer.number} - ${editingPlayer.name}` : 'Thêm Cầu Thủ Mới'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseCreateModal) onCloseCreateModal();
                }}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
              {/* Section 1: Thông tin cơ bản */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 font-mono">
                  1. Thông tin định danh & Vai trò
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Họ và tên cầu thủ *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Nguyễn Văn A"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Số áo *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={99}
                      value={formData.number ?? ''}
                      onChange={(e) => setFormData({ ...formData, number: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tuyến thi đấu *</label>
                    <select
                      value={formData.position || 'FW'}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="GK">GK - Thủ môn</option>
                      <option value="DF">DF - Hậu vệ</option>
                      <option value="MF">MF - Tiền vệ</option>
                      <option value="FW">FW - Tiền đạo</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Vị trí chi tiết *</label>
                    <input
                      type="text"
                      value={formData.subPosition || ''}
                      onChange={(e) => setFormData({ ...formData, subPosition: e.target.value })}
                      placeholder="e.g. Tiền vệ công (CAM), Trung vệ lệch trái..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isCaptain)}
                      onChange={(e) => setFormData({ ...formData, isCaptain: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>Là Đội Trưởng (Captain)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isViceCaptain)}
                      onChange={(e) => setFormData({ ...formData, isViceCaptain: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>Là Đội Phó (Vice-captain)</span>
                  </label>
                </div>
              </div>

              {/* Section 2: Ảnh đại diện & Firebase Storage Link */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 font-mono">
                  2. Ảnh đại diện & Liên kết Firebase Storage
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">URL Ảnh Cầu Thủ (Image URL / Firebase Storage)</label>
                    <input
                      type="text"
                      value={formData.avatarUrl || ''}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      placeholder="https://... hoặc link Firebase Storage"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Firebase Path (Tùy chọn)</label>
                    <input
                      type="text"
                      value={formData.firebaseStorageImageRef || ''}
                      onChange={(e) => setFormData({ ...formData, firebaseStorageImageRef: e.target.value })}
                      placeholder="e.g. players/player_10.jpg"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Thể chất & Hợp đồng */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 font-mono">
                  3. Thể hình & Thông tin hợp đồng
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Quốc tịch</label>
                    <input
                      type="text"
                      value={formData.nationality || ''}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tuổi</label>
                    <input
                      type="number"
                      value={formData.age ?? ''}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Chiều cao (cm)</label>
                    <input
                      type="number"
                      value={formData.height ?? ''}
                      onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Cân nặng (kg)</label>
                    <input
                      type="number"
                      value={formData.weight ?? ''}
                      onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Chân thuận</label>
                    <select
                      value={formData.preferredFoot || 'Phải'}
                      onChange={(e) => setFormData({ ...formData, preferredFoot: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    >
                      <option value="Phải">Chân Phải</option>
                      <option value="Trái">Chân Trái</option>
                      <option value="Cả hai">Cả hai chân</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Định giá thị trường</label>
                    <input
                      type="text"
                      value={formData.marketValue || ''}
                      onChange={(e) => setFormData({ ...formData, marketValue: e.target.value })}
                      placeholder="e.g. €450.000"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Năm gia nhập</label>
                    <input
                      type="number"
                      value={formData.joinedYear ?? ''}
                      onChange={(e) => setFormData({ ...formData, joinedYear: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Hạn hợp đồng</label>
                    <input
                      type="text"
                      value={formData.contractUntil || ''}
                      onChange={(e) => setFormData({ ...formData, contractUntil: e.target.value })}
                      placeholder="e.g. 2028"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Thống kê mùa giải */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  4. Chỉ số thống kê mùa giải
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Số trận ra sân</label>
                    <input
                      type="number"
                      value={formData.stats?.appearances ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...(formData.stats as any), appearances: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Bàn thắng</label>
                    <input
                      type="number"
                      value={formData.stats?.goals ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...(formData.stats as any), goals: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Kiến tạo</label>
                    <input
                      type="number"
                      value={formData.stats?.assists ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...(formData.stats as any), assists: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Trận sạch lưới</label>
                    <input
                      type="number"
                      value={formData.stats?.cleanSheets ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...(formData.stats as any), cleanSheets: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Thẻ vàng</label>
                    <input
                      type="number"
                      value={formData.stats?.yellowCards ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...(formData.stats as any), yellowCards: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-yellow-400 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Thẻ đỏ</label>
                    <input
                      type="number"
                      value={formData.stats?.redCards ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...(formData.stats as any), redCards: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-rose-400 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Số phút thi đấu</label>
                    <input
                      type="number"
                      value={formData.stats?.minutesPlayed ?? 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...(formData.stats as any), minutesPlayed: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tỉ lệ chuyền bóng (%)</label>
                    <input
                      type="number"
                      value={formData.stats?.passAccuracy ?? 80}
                      onChange={(e) => setFormData({
                        ...formData,
                        stats: { ...(formData.stats as any), passAccuracy: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Tiểu sử tóm tắt */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tiểu sử & Nhận định năng lực</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Mô tả phong cách thi đấu, thành tích nổi bật của cầu thủ..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onCloseCreateModal) onCloseCreateModal();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Lưu Thông Tin Cầu Thủ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
