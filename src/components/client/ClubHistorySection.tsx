import React from 'react';
import { ClubInfo } from '../../types';
import { Trophy, Shield, MapPin, Award, Users } from 'lucide-react';

interface ClubHistorySectionProps {
  clubInfo: ClubInfo;
}

export const ClubHistorySection: React.FC<ClubHistorySectionProps> = ({ clubInfo }) => {
  return (
    <section id="about" className="py-16 bg-slate-950 border-b border-slate-900 scroll-mt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-amber-400 mb-2">
            <Trophy className="w-4 h-4" />
            <span>Phòng Truyền Thống & Bản Sắc CLB</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Về {clubInfo.name}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Đại diện cho niềm tự hào, tinh thần thể thao cao thượng và bản lĩnh thi đấu kiên cường.
          </p>
        </div>

        {/* Trophies Cabinet */}
        <div className="mb-14">
          <h3 className="font-heading font-bold text-lg text-amber-400 mb-6 flex items-center justify-center gap-2">
            <Award className="w-5 h-5" />
            Bảng Vàng Thành Tích & Danh Hiệu
          </h3>

          {clubInfo.trophyCabinet.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 max-w-md mx-auto text-xs">
              Chưa có danh hiệu nào được thêm vào phòng truyền thống. Bạn có thể cập nhật trong Admin &gt; Cài Đặt CLB.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clubInfo.trophyCabinet.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900/60 border border-slate-800 hover:border-amber-400/50 p-6 rounded-2xl relative overflow-hidden transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                      {t.season}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-lg text-white mb-2">
                      {t.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stadium and Management Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Ground */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Thánh Địa Sân Nhà</span>
              </div>
              <h4 className="font-heading font-bold text-xl text-white">
                {clubInfo.homeStadium}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Nơi hội tụ người hâm mộ trung thành mỗi dịp cuối tuần, tạo nên bầu không khí cổ vũ sôi động tiếp lửa cho các cầu thủ.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Sức chứa khán giả:</span>
              <strong className="text-white font-mono text-sm">{clubInfo.stadiumCapacity}</strong>
            </div>
          </div>

          {/* Coaching Staff */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                <Users className="w-4 h-4" />
                <span>Ban Huấn Luyện & Chỉ Đạo</span>
              </div>
              <h4 className="font-heading font-bold text-xl text-white">
                {clubInfo.headCoach}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Triết lý bóng đá hiện đại, kỷ luật chiến thuật cao và tinh thần đoàn kết đồng đội vững chắc.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Trợ lý HLV:</span>
                <span className="text-slate-200">{clubInfo.assistantCoach}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Chủ tịch CLB:</span>
                <span className="text-slate-200">{clubInfo.clubPresident}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
