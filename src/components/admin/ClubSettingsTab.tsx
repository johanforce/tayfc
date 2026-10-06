import React, { useState } from 'react';
import { ClubInfo, Trophy } from '../../types';
import { Shield, Trophy as TrophyIcon, Plus, Trash2, Check, Save } from 'lucide-react';

interface ClubSettingsTabProps {
  clubInfo: ClubInfo;
  onUpdateClubInfo: (info: ClubInfo) => void;
}

export const ClubSettingsTab: React.FC<ClubSettingsTabProps> = ({
  clubInfo,
  onUpdateClubInfo
}) => {
  const [formData, setFormData] = useState<ClubInfo>(JSON.parse(JSON.stringify(clubInfo)));
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  // New trophy form state
  const [newTrophyTitle, setNewTrophyTitle] = useState('');
  const [newTrophySeason, setNewTrophySeason] = useState('');
  const [newTrophyDesc, setNewTrophyDesc] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClubInfo(formData);
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 3000);
  };

  const handleAddTrophy = () => {
    if (!newTrophyTitle.trim() || !newTrophySeason.trim()) return;
    const trophy: Trophy = {
      id: `t-${Date.now()}`,
      title: newTrophyTitle.trim(),
      season: newTrophySeason.trim(),
      description: newTrophyDesc.trim() || 'Danh hiệu chính thức',
      iconName: 'Trophy'
    };
    setFormData({
      ...formData,
      trophyCabinet: [...formData.trophyCabinet, trophy]
    });
    setNewTrophyTitle('');
    setNewTrophySeason('');
    setNewTrophyDesc('');
  };

  const handleRemoveTrophy = (id: string) => {
    setFormData({
      ...formData,
      trophyCabinet: formData.trophyCabinet.filter(t => t.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            Cài Đặt Thông Tin Câu Lạc Bộ
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chỉnh sửa tên đội bóng, khẩu hiệu, ban huấn luyện, sân vận động và bảng vàng thành tích.
          </p>
        </div>

        {showSavedAlert && (
          <div className="px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-1.5 font-medium animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Đã lưu cài đặt CLB thành công!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Club Info */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-heading font-bold text-sm text-amber-400 uppercase tracking-wider mb-4 font-mono">
            1. Tên gọi & Nhận diện thương hiệu
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tên chính thức CLB *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tên viết tắt</label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Năm thành lập</label>
              <input
                type="number"
                value={formData.foundedYear}
                onChange={(e) => setFormData({ ...formData, foundedYear: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs text-slate-400 mb-1">Khẩu hiệu / Slogan CLB</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 text-xs font-semibold focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">URL Logo Đội Bóng (Image / Firebase Storage)</label>
              <input
                type="text"
                value={formData.clubLogoUrl}
                onChange={(e) => setFormData({ ...formData, clubLogoUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">URL Ảnh Bìa Hero Banner</label>
              <input
                type="text"
                value={formData.heroBannerUrl}
                onChange={(e) => setFormData({ ...formData, heroBannerUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stadium & Leadership */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-heading font-bold text-sm text-emerald-400 uppercase tracking-wider mb-4 font-mono">
            2. Sân nhà & Ban huấn luyện
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Sân vận động chính *</label>
              <input
                type="text"
                required
                value={formData.homeStadium}
                onChange={(e) => setFormData({ ...formData, homeStadium: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Sức chứa khán đài</label>
              <input
                type="text"
                value={formData.stadiumCapacity}
                onChange={(e) => setFormData({ ...formData, stadiumCapacity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Huấn luyện viên trưởng *</label>
              <input
                type="text"
                required
                value={formData.headCoach}
                onChange={(e) => setFormData({ ...formData, headCoach: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Trợ lý HLV</label>
              <input
                type="text"
                value={formData.assistantCoach}
                onChange={(e) => setFormData({ ...formData, assistantCoach: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Trophy Cabinet Management */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-heading font-bold text-sm text-amber-400 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
            <TrophyIcon className="w-4 h-4" />
            3. Bảng Vàng Danh Hiệu (Trophy Cabinet)
          </h3>

          <div className="space-y-2 mb-4">
            {formData.trophyCabinet.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
              >
                <div>
                  <span className="font-bold text-white text-sm">{t.title}</span>
                  <span className="font-mono text-amber-400 ml-2 font-bold">({t.season})</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{t.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTrophy(t.id)}
                  className="p-1.5 bg-slate-950 text-rose-400 hover:text-rose-300 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add trophy form */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">Thêm danh hiệu mới:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Tên danh hiệu (e.g. Vô địch V.League)"
                value={newTrophyTitle}
                onChange={(e) => setNewTrophyTitle(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
              />
              <input
                type="text"
                placeholder="Mùa giải (e.g. 2025/2026)"
                value={newTrophySeason}
                onChange={(e) => setNewTrophySeason(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Mô tả chiến tích..."
                value={newTrophyDesc}
                onChange={(e) => setNewTrophyDesc(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
              />
            </div>
            <button
              type="button"
              onClick={handleAddTrophy}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm vào phòng truyền thống</span>
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-heading font-bold text-sm text-cyan-400 uppercase tracking-wider mb-4 font-mono">
            4. Thông tin liên hệ CLB
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email liên hệ</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Hotline / Điện thoại</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Địa chỉ trụ sở</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Toàn Bộ Cài Đặt CLB</span>
          </button>
        </div>
      </form>
    </div>
  );
};
