import React, { useState } from 'react';
import { Match, Player, TacticalPitchPosition } from '../../types';
import { TacticalPitch } from '../common/TacticalPitch';
import { Users, Check, RefreshCw, Save, Shield, Plus, X } from 'lucide-react';

interface LineupTacticsEditorTabProps {
  matches: Match[];
  players: Player[];
  onUpdateMatchLineup: (matchId: string, formation: string, lineup: TacticalPitchPosition[], substitutes: string[]) => void;
  onNavigateToMatches?: () => void;
}

// Preset formations with realistic (x, y) pitch percentages
const FORMATION_PRESETS: Record<string, { positionCode: string; x: number; y: number }[]> = {
  '4-3-3': [
    { positionCode: 'GK', x: 50, y: 88 },
    { positionCode: 'RB', x: 84, y: 72 },
    { positionCode: 'CB-R', x: 62, y: 74 },
    { positionCode: 'CB-L', x: 38, y: 74 },
    { positionCode: 'LB', x: 16, y: 72 },
    { positionCode: 'CDM', x: 50, y: 55 },
    { positionCode: 'CM', x: 32, y: 44 },
    { positionCode: 'CAM', x: 68, y: 44 },
    { positionCode: 'RW', x: 82, y: 22 },
    { positionCode: 'ST', x: 50, y: 16 },
    { positionCode: 'LW', x: 18, y: 22 }
  ],
  '4-2-3-1': [
    { positionCode: 'GK', x: 50, y: 88 },
    { positionCode: 'RB', x: 84, y: 72 },
    { positionCode: 'CB-R', x: 62, y: 74 },
    { positionCode: 'CB-L', x: 38, y: 74 },
    { positionCode: 'LB', x: 16, y: 72 },
    { positionCode: 'CDM-1', x: 36, y: 56 },
    { positionCode: 'CDM-2', x: 64, y: 56 },
    { positionCode: 'CAM', x: 50, y: 38 },
    { positionCode: 'RW', x: 82, y: 24 },
    { positionCode: 'ST', x: 50, y: 15 },
    { positionCode: 'LW', x: 18, y: 24 }
  ],
  '3-5-2': [
    { positionCode: 'GK', x: 50, y: 88 },
    { positionCode: 'CB-R', x: 74, y: 74 },
    { positionCode: 'CB-C', x: 50, y: 75 },
    { positionCode: 'CB-L', x: 26, y: 74 },
    { positionCode: 'RWB', x: 88, y: 52 },
    { positionCode: 'CM-1', x: 62, y: 50 },
    { positionCode: 'CM-2', x: 38, y: 50 },
    { positionCode: 'LWB', x: 12, y: 52 },
    { positionCode: 'CAM', x: 50, y: 34 },
    { positionCode: 'ST-R', x: 62, y: 16 },
    { positionCode: 'ST-L', x: 38, y: 16 }
  ],
  '4-4-2': [
    { positionCode: 'GK', x: 50, y: 88 },
    { positionCode: 'RB', x: 84, y: 72 },
    { positionCode: 'CB-R', x: 62, y: 74 },
    { positionCode: 'CB-L', x: 38, y: 74 },
    { positionCode: 'LB', x: 16, y: 72 },
    { positionCode: 'RM', x: 84, y: 46 },
    { positionCode: 'CM-1', x: 60, y: 48 },
    { positionCode: 'CM-2', x: 40, y: 48 },
    { positionCode: 'LM', x: 16, y: 46 },
    { positionCode: 'ST-R', x: 60, y: 18 },
    { positionCode: 'ST-L', x: 40, y: 18 }
  ]
};

export const LineupTacticsEditorTab: React.FC<LineupTacticsEditorTabProps> = ({
  matches,
  players,
  onUpdateMatchLineup,
  onNavigateToMatches
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const activeMatch = matches.find(m => m.id === selectedMatchId) || matches[0];

  // Local draft state for editing
  const [currentFormation, setCurrentFormation] = useState<string>(activeMatch?.formation || '4-3-3');
  const [currentLineup, setCurrentLineup] = useState<TacticalPitchPosition[]>(
    activeMatch?.lineup ? JSON.parse(JSON.stringify(activeMatch.lineup)) : []
  );
  const [currentSubstitutes, setCurrentSubstitutes] = useState<string[]>(
    activeMatch?.substitutes ? [...activeMatch.substitutes] : []
  );

  // Slot being assigned
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Sync when activeMatch changes
  const handleMatchSelect = (matchId: string) => {
    setSelectedMatchId(matchId);
    const m = matches.find(item => item.id === matchId);
    if (m) {
      setCurrentFormation(m.formation || '4-3-3');
      setCurrentLineup(m.lineup ? JSON.parse(JSON.stringify(m.lineup)) : []);
      setCurrentSubstitutes(m.substitutes ? [...m.substitutes] : []);
      setActiveSlotIndex(null);
    }
  };

  // Change formation preset
  const handleFormationChange = (newFormation: string) => {
    setCurrentFormation(newFormation);
    const preset = FORMATION_PRESETS[newFormation] || FORMATION_PRESETS['4-3-3'];
    
    // Map existing assigned players as best as possible
    const updatedLineup: TacticalPitchPosition[] = preset.map((slot, index) => {
      const existingSlot = currentLineup[index];
      return {
        positionCode: slot.positionCode,
        playerId: existingSlot ? existingSlot.playerId : (players[index]?.id || ''),
        x: slot.x,
        y: slot.y
      };
    });

    setCurrentLineup(updatedLineup);
  };

  // Assign player to slot
  const handleAssignPlayerToSlot = (playerId: string) => {
    if (activeSlotIndex === null) return;
    const updated = [...currentLineup];
    updated[activeSlotIndex] = {
      ...updated[activeSlotIndex],
      playerId
    };
    setCurrentLineup(updated);
    // If was on bench, remove from bench
    setCurrentSubstitutes(currentSubstitutes.filter(id => id !== playerId));
    setActiveSlotIndex(null);
  };

  // Toggle bench substitute
  const toggleSubstitute = (playerId: string) => {
    if (currentSubstitutes.includes(playerId)) {
      setCurrentSubstitutes(currentSubstitutes.filter(id => id !== playerId));
    } else {
      // If currently starter, remove from starter
      const starterIndex = currentLineup.findIndex(s => s.playerId === playerId);
      if (starterIndex !== -1) {
        const updated = [...currentLineup];
        updated[starterIndex] = { ...updated[starterIndex], playerId: '' };
        setCurrentLineup(updated);
      }
      setCurrentSubstitutes([...currentSubstitutes, playerId]);
    }
  };

  // Save changes
  const handleSave = () => {
    if (!activeMatch) return;
    onUpdateMatchLineup(activeMatch.id, currentFormation, currentLineup, currentSubstitutes);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const playerMap = React.useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach(p => map.set(p.id, p));
    return map;
  }, [players]);

  if (!activeMatch) {
    return (
      <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 space-y-4 max-w-md mx-auto shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Chưa có trận đấu nào</h3>
          <p className="text-xs text-slate-400 mt-1">
            Để sắp xếp sơ đồ chiến thuật (4-3-3, 4-2-3-1, 3-5-2...) và chỉ định 11 vị trí đá chính trên sân cỏ, bạn cần tạo ít nhất một trận đấu trong mục Lịch Đấu & Kết Quả.
          </p>
        </div>
        {onNavigateToMatches && (
          <button
            onClick={onNavigateToMatches}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Trận Đấu Đầu Tiên</span>
          </button>
        )}
      </div>
    );
  }

  const assignedPlayerIds = new Set(currentLineup.map(s => s.playerId).filter(Boolean));

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <div>
          <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
            Chiến Thuật & Đội Hình Ra Sân
          </span>
          <h2 className="font-heading text-2xl font-bold text-white mt-1">
            Thiết Lập Đội Hình Thi Đấu Từng Trận
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chọn trận đấu, sơ đồ chiến thuật và nhấp vào từng vị trí trên sân cỏ để chỉ định cầu thủ đá chính.
          </p>
        </div>

        {/* Match and Formation Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Trận đấu:</label>
            <select
              value={selectedMatchId}
              onChange={(e) => handleMatchSelect(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:border-amber-400 cursor-pointer"
            >
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  {m.competition} - {m.homeTeam.name} vs {m.awayTeam.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Sơ đồ đội hình:</label>
            <select
              value={currentFormation}
              onChange={(e) => handleFormationChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-amber-400 text-xs rounded-xl px-3 py-2 font-mono font-bold focus:border-amber-400 cursor-pointer"
            >
              <option value="4-3-3">4-3-3 (Tấn công)</option>
              <option value="4-2-3-1">4-2-3-1 (Cân bằng)</option>
              <option value="3-5-2">3-5-2 (Kiểm soát)</option>
              <option value="4-4-2">4-4-2 (Truyền thống)</option>
            </select>
          </div>

          <div className="self-end">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Đội Hình Trận</span>
            </button>
          </div>
        </div>
      </div>

      {showSaveSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in font-medium">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Đã lưu thành công đội hình và sơ đồ chiến thuật cho trận đấu này!</span>
        </div>
      )}

      {/* Main Pitch & Selector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Pitch */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80 text-xs">
            <span className="text-slate-300 font-semibold">
              Sân Cỏ Chiến Thuật: <strong className="text-amber-400">{currentFormation}</strong>
            </span>
            <span className="text-slate-500">Nhấp vị trí trên sân để đổi cầu thủ</span>
          </div>

          <TacticalPitch
            formation={currentFormation}
            lineup={currentLineup}
            players={players}
            isEditable={true}
            onSlotClick={(posCode, index) => setActiveSlotIndex(index)}
            className="w-full"
          />

          {activeSlotIndex !== null && (
            <div className="mt-4 p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-amber-300 text-xs text-center w-full">
              Đang chọn cầu thủ cho vị trí: <strong className="font-mono text-white text-sm">{currentLineup[activeSlotIndex]?.positionCode}</strong>. Hãy chọn cầu thủ ở cột bên phải.
            </div>
          )}
        </div>

        {/* Right: Lineup Assignment List & Substitutes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Slots list */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h3 className="font-heading font-bold text-sm text-amber-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>11 Vị Trí Xuất Phát</span>
              <span className="text-xs font-mono text-slate-500">{currentLineup.length} cầu thủ</span>
            </h3>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {currentLineup.map((slot, index) => {
                const assignedPlayer = playerMap.get(slot.playerId);
                const isCurrentActive = activeSlotIndex === index;

                return (
                  <div
                    key={index}
                    onClick={() => setActiveSlotIndex(index)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isCurrentActive
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-slate-950 border border-slate-800 font-mono font-bold text-amber-400 flex items-center justify-center tabular-nums">
                        {assignedPlayer ? assignedPlayer.number : '?'}
                      </span>
                      <div>
                        <span className="font-semibold block">
                          {assignedPlayer ? assignedPlayer.name : 'Chưa chỉ định'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {assignedPlayer?.subPosition || 'Nhấp để chọn'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
                        {slot.positionCode}
                      </span>
                      <button
                        type="button"
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-semibold text-slate-300"
                      >
                        Đổi
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bench Substitutes Selector */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h3 className="font-heading font-bold text-sm text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Băng Ghế Dự Bị (Substitutes)</span>
              <span className="text-xs font-mono text-emerald-400">{currentSubstitutes.length} cầu thủ</span>
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Tích chọn cầu thủ đăng ký dự bị cho trận đấu:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {players.map((p) => {
                const isStarter = assignedPlayerIds.has(p.id);
                const isSub = currentSubstitutes.includes(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => !isStarter && toggleSubstitute(p.id)}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isStarter
                        ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed'
                        : isSub
                        ? 'bg-amber-400/10 border-amber-400/60 text-amber-300'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-bold text-slate-400 w-5">
                        #{p.number}
                      </span>
                      <span className="truncate font-medium">
                        {p.name}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-semibold">
                      {isStarter ? 'Đá chính' : isSub ? '✓ Dự bị' : '+'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP PLAYER PICKER WHEN A SLOT IS CLICKED */}
      {activeSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div>
                <h4 className="font-heading font-bold text-base text-white">
                  Chỉ định cầu thủ cho vị trí {currentLineup[activeSlotIndex]?.positionCode}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chọn cầu thủ từ danh sách biên chế đội bóng
                </p>
              </div>
              <button
                onClick={() => setActiveSlotIndex(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-2">
              {players.map((p) => {
                const isCurrentlyAssigned = currentLineup.some(
                  (s, idx) => s.playerId === p.id && idx !== activeSlotIndex
                );

                return (
                  <div
                    key={p.id}
                    onClick={() => handleAssignPlayerToSlot(p.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                      currentLineup[activeSlotIndex]?.playerId === p.id
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : isCurrentlyAssigned
                        ? 'bg-slate-950/40 border-slate-900 text-slate-500 hover:bg-slate-950'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-xs">
                            #{p.number}
                          </span>
                          <span className="font-semibold text-sm">
                            {p.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {p.subPosition} ({p.position}) · {p.stats.appearances} trận · {p.stats.goals} bàn
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {isCurrentlyAssigned && (
                        <span className="text-[10px] text-slate-500 block">
                          Đã ở vị trí khác
                        </span>
                      )}
                      <button
                        type="button"
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Chọn
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveSlotIndex(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
