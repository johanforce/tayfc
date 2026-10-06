import React, { useEffect, useState } from 'react';
import { ClubInfo, Match } from '../../types';
import { Calendar, MapPin, Play, Users, Trophy, Plus, Settings } from 'lucide-react';

interface HeroBannerProps {
  clubInfo: ClubInfo;
  upcomingMatch?: Match;
  onSelectMatch: (match: Match) => void;
  onExploreSquad: () => void;
  onPlayHighlight?: (url: string, title: string) => void;
  onGoToAdmin?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  clubInfo,
  upcomingMatch,
  onSelectMatch,
  onExploreSquad,
  onGoToAdmin
}) => {
  // Countdown calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!upcomingMatch) return;

    const targetDate = new Date(upcomingMatch.datetime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [upcomingMatch]);

  return (
    <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={clubInfo.heroBannerUrl}
          alt={clubInfo.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-10000"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
        <div className="absolute inset-0 bg-radial-at-t from-transparent via-slate-950/70 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Club Identity & Slogan */}
          <div className={`${upcomingMatch ? 'lg:col-span-7' : 'lg:col-span-7'} space-y-6`}>
            <div className="flex items-center gap-3 text-amber-400 font-semibold text-xs tracking-wider uppercase font-mono">
              <Trophy className="w-4 h-4" />
              <span>Câu Lạc Bộ Bóng Đá Chuyên Nghiệp</span>
              <span>·</span>
              <span>Thành Lập {clubInfo.foundedYear}</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance">
              {clubInfo.name}
            </h1>

            <p className="text-lg sm:text-xl text-amber-400/90 font-medium italic">
              "{clubInfo.tagline}"
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Trang web chính thức kết nối người hâm mộ với đội bóng. Dữ liệu lịch thi đấu, kết quả, đội hình chiến thuật và hồ sơ cầu thủ được quản lý tập trung từ hệ thống Admin.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {upcomingMatch ? (
                <button
                  onClick={() => onSelectMatch(upcomingMatch)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Xem Đội Hình Trận Sắp Tới</span>
                </button>
              ) : (
                <button
                  onClick={onGoToAdmin}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Trận Đấu Vào Lịch</span>
                </button>
              )}
              <button
                onClick={onExploreSquad}
                className="px-6 py-3 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>Danh Sách Cầu Thủ</span>
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            {upcomingMatch ? (
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400" />

                <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800">
                  <span className="font-semibold text-amber-400 uppercase tracking-wider font-mono">
                    {upcomingMatch.competition}
                  </span>
                  <span>{upcomingMatch.round}</span>
                </div>

                <div className="py-6 flex items-center justify-between text-center">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-700 p-1 flex items-center justify-center shadow-md mb-2 overflow-hidden">
                      <img
                        src={upcomingMatch.homeTeam.logo}
                        alt={upcomingMatch.homeTeam.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="font-heading font-bold text-sm sm:text-base text-slate-100 max-w-[120px] truncate">
                      {upcomingMatch.homeTeam.name}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Sân nhà</span>
                  </div>

                  <div className="px-3 flex flex-col items-center">
                    <span className="text-xl font-heading font-black text-amber-400 tracking-wider">
                      VS
                    </span>
                    <span className="text-[10px] uppercase font-mono text-slate-500 mt-1">
                      {upcomingMatch.formation}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-700 p-1 flex items-center justify-center shadow-md mb-2 overflow-hidden">
                      <img
                        src={upcomingMatch.awayTeam.logo}
                        alt={upcomingMatch.awayTeam.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="font-heading font-bold text-sm sm:text-base text-slate-100 max-w-[120px] truncate">
                      {upcomingMatch.awayTeam.name}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Sân khách</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-xs text-slate-300 space-y-1.5 mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      {new Date(upcomingMatch.datetime).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} - {new Date(upcomingMatch.datetime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{upcomingMatch.venue}</span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-2">
                    Đếm ngược đến giờ bóng lăn
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
                        {timeLeft.days}
                      </span>
                      <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Ngày</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <span className="text-xl font-mono font-bold text-white tabular-nums">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                      <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Giờ</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <span className="text-xl font-mono font-bold text-white tabular-nums">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                      <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Phút</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                      <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                      <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Giây</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectMatch(upcomingMatch)}
                  className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center block"
                >
                  Xem sơ đồ chiến thuật & Chi tiết trận đấu →
                </button>
              </div>
            ) : (
              /* Ready for data state card */
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
                  <Settings className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Hệ Thống Đã Sẵn Sàng Nhập Dữ Liệu
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Dữ liệu mẫu đã được xóa sạch. Bạn có thể sử dụng trang Admin Dashboard để thêm cầu thủ, trận đấu, tin tức và liên kết Firebase Storage theo nhu cầu.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={onGoToAdmin}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Mở Bảng Điều Khiển Admin Để Nhập Dữ Liệu</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
