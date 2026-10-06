import React, { useState } from 'react';
import { Match, MatchStatus, MatchScorer, ClubInfo } from '../../types';
import { Plus, Edit2, Trash2, Calendar, MapPin, Video, CheckCircle, Clock, X, Trophy } from 'lucide-react';

interface MatchesManagerTabProps {
  matches: Match[];
  clubInfo: ClubInfo;
  onSaveMatch: (match: Match) => void;
  onDeleteMatch: (matchId: string) => void;
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const MatchesManagerTab: React.FC<MatchesManagerTabProps> = ({
  matches,
  clubInfo,
  onSaveMatch,
  onDeleteMatch,
  isCreateModalOpen = false,
  onCloseCreateModal
}) => {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Match>>({});
  const [scorersList, setScorersList] = useState<MatchScorer[]>([]);
  const [newScorerName, setNewScorerName] = useState('');
  const [newScorerMinute, setNewScorerMinute] = useState<number>(45);
  const [newScorerIsClub, setNewScorerIsClub] = useState(true);

  const openCreateModal = () => {
    setEditingMatch(null);
    setFormData({
      id: `m-${Date.now()}`,
      competition: 'V.League 1 2025/26',
      round: 'Vòng 16',
      datetime: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      venue: clubInfo.homeStadium,
      isHome: true,
      homeTeam: {
        name: clubInfo.name,
        shortName: clubInfo.shortName,
        logo: clubInfo.clubLogoUrl,
        isClub: true
      },
      awayTeam: {
        name: 'Sông Lam Nghệ An',
        shortName: 'SLNA',
        logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=200&q=80',
        isClub: false
      },
      status: 'UPCOMING',
      formation: '4-3-3',
      lineup: [
        { positionCode: 'GK', playerId: 'p-1', x: 50, y: 88 },
        { positionCode: 'RB', playerId: 'p-6', x: 84, y: 72 },
        { positionCode: 'CB-R', playerId: 'p-3', x: 62, y: 74 },
        { positionCode: 'CB-L', playerId: 'p-4', x: 38, y: 74 },
        { positionCode: 'LB', playerId: 'p-5', x: 16, y: 72 },
        { positionCode: 'CDM', playerId: 'p-7', x: 50, y: 55 },
        { positionCode: 'CM', playerId: 'p-8', x: 32, y: 44 },
        { positionCode: 'CAM', playerId: 'p-9', x: 68, y: 44 },
        { positionCode: 'RW', playerId: 'p-10', x: 82, y: 22 },
        { positionCode: 'ST', playerId: 'p-11', x: 50, y: 16 },
        { positionCode: 'LW', playerId: 'p-12', x: 18, y: 22 }
      ],
      substitutes: ['p-2', 'p-13', 'p-14', 'p-15'],
      highlightsUrl: '',
      matchReport: ''
    });
    setScorersList([]);
    setIsModalOpen(true);
  };

  const openEditModal = (match: Match) => {
    setEditingMatch(match);
    setFormData(JSON.parse(JSON.stringify(match)));
    setScorersList(match.scorers ? JSON.parse(JSON.stringify(match.scorers)) : []);
    setIsModalOpen(true);
  };

  const addScorer = () => {
    if (!newScorerName.trim()) return;
    setScorersList([
      ...scorersList,
      {
        id: `sc-${Date.now()}`,
        player: newScorerName.trim(),
        minute: Number(newScorerMinute) || 1,
        isClubScorer: newScorerIsClub
      }
    ]);
    setNewScorerName('');
    setNewScorerMinute(45);
  };

  const removeScorer = (id: string) => {
    setScorersList(scorersList.filter(s => s.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.competition || !formData.homeTeam?.name || !formData.awayTeam?.name) {
      alert('Vui lòng điền đầy đủ tên giải đấu và hai đội bóng.');
      return;
    }

    const savedMatch: Match = {
      id: formData.id || `m-${Date.now()}`,
      competition: formData.competition,
      round: formData.round || 'Vòng đấu',
      datetime: formData.datetime || new Date().toISOString(),
      venue: formData.venue || clubInfo.homeStadium,
      isHome: Boolean(formData.isHome),
      homeTeam: {
        name: formData.homeTeam.name,
        shortName: formData.homeTeam.shortName || formData.homeTeam.name.slice(0, 3).toUpperCase(),
        logo: formData.homeTeam.logo || clubInfo.clubLogoUrl,
        isClub: Boolean(formData.isHome)
      },
      awayTeam: {
        name: formData.awayTeam.name,
        shortName: formData.awayTeam.shortName || formData.awayTeam.name.slice(0, 3).toUpperCase(),
        logo: formData.awayTeam.logo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=200&q=80',
        isClub: !formData.isHome
      },
      status: (formData.status as MatchStatus) || 'UPCOMING',
      score: formData.status === 'FINISHED'
        ? {
            home: Number(formData.score?.home) || 0,
            away: Number(formData.score?.away) || 0
          }
        : undefined,
      scorers: scorersList,
      formation: formData.formation || '4-3-3',
      lineup: formData.lineup || [],
      substitutes: formData.substitutes || [],
      highlightsUrl: formData.highlightsUrl || '',
      matchReport: formData.matchReport || '',
      ticketUrl: formData.ticketUrl || '',
      photoGalleryUrls: formData.photoGalleryUrls || []
    };

    onSaveMatch(savedMatch);
    setIsModalOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleDelete = (id: string, label: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa trận đấu "${label}"?`)) {
      onDeleteMatch(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Quản Lý Lịch Thi Đấu & Kết Quả
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tổng cộng: <strong className="text-amber-400">{matches.length}</strong> trận đấu trong lịch thi đấu & lịch sử.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Trận Đấu Mới</span>
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {matches.map((m) => {
          const isFinished = m.status === 'FINISHED';
          const matchDate = new Date(m.datetime);

          return (
            <div
              key={m.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Match Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-mono font-semibold text-amber-400 uppercase">
                    {m.competition}
                  </span>
                  <span>·</span>
                  <span>{m.round}</span>
                  <span>·</span>
                  <span className="font-mono">{m.venue}</span>
                </div>

                <div className="flex items-center gap-4 py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-base text-white">
                      {m.homeTeam.name}
                    </span>
                  </div>

                  <div className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 font-mono text-sm font-bold">
                    {isFinished && m.score ? (
                      <span className="text-amber-400 tabular-nums">
                        {m.score.home} - {m.score.away}
                      </span>
                    ) : (
                      <span className="text-slate-400">VS</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-base text-white">
                      {m.awayTeam.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {matchDate.toLocaleDateString('vi-VN')} {matchDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-emerald-400">Sơ đồ: {m.formation}</span>
                  {m.highlightsUrl && (
                    <>
                      <span>·</span>
                      <span className="text-cyan-400 flex items-center gap-1 truncate max-w-xs">
                        <Video className="w-3 h-3" /> Đã gắn video highlights
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg font-mono ${
                  isFinished
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-900/60'
                }`}>
                  {isFinished ? 'ĐÃ KẾT THÚC' : 'SẮP DIỄN RA'}
                </span>

                <button
                  onClick={() => openEditModal(m)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl transition-colors cursor-pointer"
                  title="Chỉnh sửa trận đấu"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(m.id, `${m.homeTeam.name} vs ${m.awayTeam.name}`)}
                  className="p-2 bg-slate-900 hover:bg-rose-950/60 text-rose-400 rounded-xl transition-colors cursor-pointer"
                  title="Xóa trận đấu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MATCH MODAL */}
      {(isModalOpen || isCreateModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                {editingMatch ? 'Chỉnh sửa thông tin trận đấu' : 'Tạo Trận Đấu Mới'}
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
              {/* Competition & Time */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 font-mono">
                  1. Thông tin giải đấu & Lịch trình
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Giải đấu *</label>
                    <input
                      type="text"
                      required
                      value={formData.competition || ''}
                      onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                      placeholder="e.g. V.League 1 2025/26"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Vòng đấu / Giai đoạn</label>
                    <input
                      type="text"
                      value={formData.round || ''}
                      onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                      placeholder="e.g. Vòng 15, Bán kết..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Thời gian bóng lăn (Ngày & Giờ) *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.datetime ? formData.datetime.slice(0, 16) : ''}
                      onChange={(e) => setFormData({ ...formData, datetime: new Date(e.target.value).toISOString() })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Sân vận động tổ chức *</label>
                    <input
                      type="text"
                      required
                      value={formData.venue || ''}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g. SVĐ Thống Nhất, TP.HCM"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Matchup Teams */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 font-mono">
                  2. Cặp đấu (Đội nhà & Đội khách)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Home Team */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">Đội Chủ Nhà (Home)</span>
                    <input
                      type="text"
                      placeholder="Tên đội nhà"
                      value={formData.homeTeam?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        homeTeam: { ...(formData.homeTeam as any), name: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="URL Logo đội nhà"
                      value={formData.homeTeam?.logo || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        homeTeam: { ...(formData.homeTeam as any), logo: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none font-mono text-[11px]"
                    />
                  </div>

                  {/* Away Team */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">Đội Khách (Away)</span>
                    <input
                      type="text"
                      placeholder="Tên đội khách"
                      value={formData.awayTeam?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        awayTeam: { ...(formData.awayTeam as any), name: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="URL Logo đội khách"
                      value={formData.awayTeam?.logo || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        awayTeam: { ...(formData.awayTeam as any), logo: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:border-amber-400 focus:outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isHome)}
                      onChange={(e) => setFormData({ ...formData, isHome: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>CLB Titans Saigon FC là đội chủ nhà trong trận này</span>
                  </label>
                </div>
              </div>

              {/* Status & Score */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 font-mono">
                  3. Trạng thái & Tỉ số
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Trạng thái trận đấu</label>
                    <select
                      value={formData.status || 'UPCOMING'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="UPCOMING">Sắp diễn ra (Upcoming)</option>
                      <option value="FINISHED">Đã kết thúc (Finished)</option>
                      <option value="LIVE">Đang thi đấu (Live)</option>
                      <option value="POSTPONED">Hoãn lại (Postponed)</option>
                    </select>
                  </div>

                  {formData.status === 'FINISHED' && (
                    <>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Bàn thắng Đội Nhà</label>
                        <input
                          type="number"
                          min={0}
                          value={formData.score?.home ?? 0}
                          onChange={(e) => setFormData({
                            ...formData,
                            score: { home: Number(e.target.value), away: formData.score?.away || 0 }
                          })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Bàn thắng Đội Khách</label>
                        <input
                          type="number"
                          min={0}
                          value={formData.score?.away ?? 0}
                          onChange={(e) => setFormData({
                            ...formData,
                            score: { home: formData.score?.home || 0, away: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold text-xs"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Goal Scorers list if finished */}
              {formData.status === 'FINISHED' && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
                    Danh sách cầu thủ ghi bàn (Scorers)
                  </h4>

                  {scorersList.length > 0 && (
                    <div className="space-y-1.5">
                      {scorersList.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-2 rounded bg-slate-900 text-xs">
                          <span className="text-slate-200">
                            ⚽ <strong>{s.player}</strong> ({s.minute}') {s.isClubScorer ? '(Titans FC)' : '(Đối phương)'}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeScorer(s.id)}
                            className="text-rose-400 hover:text-rose-300 cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Tên cầu thủ ghi bàn"
                      value={newScorerName}
                      onChange={(e) => setNewScorerName(e.target.value)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs flex-1 min-w-[140px]"
                    />
                    <input
                      type="number"
                      placeholder="Phút"
                      min={1}
                      max={120}
                      value={newScorerMinute}
                      onChange={(e) => setNewScorerMinute(Number(e.target.value))}
                      className="w-20 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs font-mono"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={newScorerIsClub}
                        onChange={(e) => setNewScorerIsClub(e.target.checked)}
                        className="w-3.5 h-3.5 rounded"
                      />
                      <span>Cầu thủ Titans FC</span>
                    </label>
                    <button
                      type="button"
                      onClick={addScorer}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      + Thêm bàn thắng
                    </button>
                  </div>
                </div>
              )}

              {/* Video Highlights URL & Match Report */}
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 font-mono">
                  4. Link Video Highlights & Báo cáo
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Link Video Highlights (YouTube / Firebase Storage MP4 URL)
                    </label>
                    <input
                      type="text"
                      value={formData.highlightsUrl || ''}
                      onChange={(e) => setFormData({ ...formData, highlightsUrl: e.target.value })}
                      placeholder="https://... hoặc Firebase Storage link"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tường thuật / Nhận định trận đấu</label>
                    <textarea
                      rows={3}
                      value={formData.matchReport || ''}
                      onChange={(e) => setFormData({ ...formData, matchReport: e.target.value })}
                      placeholder="Báo cáo diễn biến chính, đánh giá chiến thuật..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
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
                  Lưu Thông Tin Trận Đấu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
