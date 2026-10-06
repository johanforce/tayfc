import React from 'react';
import { ClubInfo } from '../../types';
import { Shield, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  clubInfo: ClubInfo;
  onNavigateSection?: (sectionId: string) => void;
  onGoToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  clubInfo,
  onNavigateSection,
  onGoToAdmin
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Club Wordmark & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-amber-400/40 p-0.5 overflow-hidden flex items-center justify-center">
                {clubInfo.clubLogoUrl ? (
                  <img
                    src={clubInfo.clubLogoUrl}
                    alt={clubInfo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Shield className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <span className="font-heading font-extrabold text-base text-white">
                {clubInfo.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "{clubInfo.tagline}"
            </p>
            <div className="text-xs text-slate-500">
              Thành lập năm {clubInfo.foundedYear} · {clubInfo.homeStadium}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
              Điều Hướng
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection?.('matches')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Lịch Thi Đấu & Kết Quả
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('lineup')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Sơ Đồ Chiến Thuật & Đội Hình
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('squad')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Danh Sách Cầu Thủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('media')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Tin Tức & Video Media
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('about')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Phòng Truyền Thống CLB
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
              Liên Hệ CLB
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{clubInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{clubInfo.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{clubInfo.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Admin Access & Storage Info */}
          <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
              Quản Trị Hệ Thống
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trang Admin Dashboard cho phép ban quản lý cập nhật đội hình từng trận, danh sách cầu thủ và kết nối Firebase Storage.
            </p>
            <button
              onClick={onGoToAdmin}
              className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center block"
            >
              Vào Admin Dashboard →
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {clubInfo.name}. Bản quyền thuộc về câu lạc bộ.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400">● Tích hợp Firebase Storage Media Manager</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
