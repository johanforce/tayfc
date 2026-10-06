import React from 'react';
import { Player, TacticalPitchPosition } from '../../types';

interface TacticalPitchProps {
  formation: string;
  lineup: TacticalPitchPosition[];
  players: Player[];
  onPlayerClick?: (player: Player) => void;
  selectedPlayerId?: string | null;
  className?: string;
  isEditable?: boolean;
  onSlotClick?: (positionCode: string, slotIndex: number) => void;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  formation,
  lineup,
  players,
  onPlayerClick,
  selectedPlayerId,
  className = '',
  isEditable = false,
  onSlotClick
}) => {
  const playerMap = React.useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach(p => map.set(p.id, p));
    return map;
  }, [players]);

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Formation label & pitch header */}
      <div className="w-full flex items-center justify-between pb-3 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Sơ đồ chiến thuật: <strong className="text-amber-400 font-mono text-sm">{formation}</strong></span>
        <span>11 cầu thủ xuất phát</span>
      </div>

      {/* The Football Pitch Container (Vertical view) */}
      <div className="relative w-full aspect-[3/4] max-w-[500px] football-pitch-bg rounded-xl border-4 border-emerald-950/80 shadow-2xl overflow-hidden select-none">
        {/* Subtle Pitch Vignette / Floodlight Glow */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/15 to-black/40 pointer-events-none" />

        {/* Pitch Lines (SVG overlay for crisp rendering) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85" viewBox="0 0 300 400" preserveAspectRatio="none">
          {/* Outer Boundary */}
          <rect x="12" y="12" width="276" height="376" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          
          {/* Halfway Line */}
          <line x1="12" y1="200" x2="288" y2="200" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          
          {/* Center Circle & Spot */}
          <circle cx="150" cy="200" r="38" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          <circle cx="150" cy="200" r="2.5" fill="rgba(255,255,255,0.9)" />

          {/* Top Penalty Area (Opponent side) */}
          <rect x="68" y="12" width="164" height="64" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          <rect x="105" y="12" width="90" height="24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          <circle cx="150" cy="48" r="2" fill="rgba(255,255,255,0.9)" />
          {/* Top Penalty Arc */}
          <path d="M 120 76 A 38 38 0 0 0 180 76" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          {/* Top Goal Box */}
          <rect x="120" y="4" width="60" height="8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />

          {/* Bottom Penalty Area (Our Goal side) */}
          <rect x="68" y="324" width="164" height="64" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          <rect x="105" y="364" width="90" height="24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          <circle cx="150" cy="352" r="2" fill="rgba(255,255,255,0.9)" />
          {/* Bottom Penalty Arc */}
          <path d="M 120 324 A 38 38 0 0 1 180 324" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          {/* Bottom Goal Box */}
          <rect x="120" y="388" width="60" height="8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />

          {/* Corner Arcs */}
          <path d="M 12 24 A 12 12 0 0 0 24 12" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          <path d="M 276 12 A 12 12 0 0 0 288 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          <path d="M 12 376 A 12 12 0 0 1 24 388" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          <path d="M 276 388 A 12 12 0 0 1 288 376" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        </svg>

        {/* Direction indicators */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] uppercase font-mono tracking-widest text-emerald-300/40 font-semibold pointer-events-none">
          ▲ Hướng tấn công ▲
        </div>

        {/* Players on Pitch */}
        {lineup.map((slot, index) => {
          const player = playerMap.get(slot.playerId);
          const isSelected = selectedPlayerId === slot.playerId;
          const isGK = slot.positionCode.includes('GK');

          return (
            <div
              key={`${slot.positionCode}-${index}`}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => {
                if (isEditable && onSlotClick) {
                  onSlotClick(slot.positionCode, index);
                } else if (player && onPlayerClick) {
                  onPlayerClick(player);
                }
              }}
              className={`absolute group flex flex-col items-center cursor-pointer transition-all duration-200 z-10 ${
                isSelected ? 'scale-115 z-20' : 'hover:scale-110'
              }`}
              title={player ? `${player.number}. ${player.name} (${slot.positionCode})` : `Vị trí ${slot.positionCode} (Trống)`}
            >
              {/* Kit Jersey Circle */}
              <div
                className={`relative w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-lg transition-transform border-2 ${
                  isSelected
                    ? 'ring-4 ring-amber-400 border-white text-slate-900 bg-amber-400'
                    : isGK
                    ? 'bg-emerald-600 text-white border-emerald-300 shadow-emerald-900/50'
                    : 'bg-slate-900 text-amber-400 border-amber-400/80 shadow-black/80'
                }`}
              >
                {/* Number */}
                <span className="font-mono tabular-nums">
                  {player ? player.number : '?'}
                </span>

                {/* Captain armlet indicator */}
                {player?.isCaptain && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                    C
                  </span>
                )}
              </div>

              {/* Player Name Tag */}
              <div className="mt-1 px-1.5 py-0.5 bg-slate-950/85 backdrop-blur-xs rounded text-[10px] md:text-xs font-semibold text-slate-100 shadow-sm border border-slate-700/60 whitespace-nowrap max-w-[80px] md:max-w-[100px] truncate text-center">
                {player ? player.name.split(' ').slice(-1)[0] : 'Trống'}
              </div>

              {/* Role badge */}
              <div className="text-[9px] font-mono text-emerald-300/90 font-medium">
                {slot.positionCode}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
