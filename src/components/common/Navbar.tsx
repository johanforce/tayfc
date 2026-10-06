import React from 'react';
import { ClubInfo } from '../../types';
import { Shield, Settings, Eye, Menu, X } from 'lucide-react';

interface NavbarProps {
  clubInfo: ClubInfo;
  activeView: 'client' | 'admin';
  onViewChange: (view: 'client' | 'admin') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  clubInfo,
  activeView,
  onViewChange,
  onNavigateSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'matches', label: 'Lịch & Kết quả' },
    { id: 'lineup', label: 'Đội hình & Sân cỏ' },
    { id: 'squad', label: 'Cầu thủ' },
    { id: 'media', label: 'Media & Tin tức' },
    { id: 'about', label: 'Về CLB' }
  ];

  const handleNavClick = (sectionId: string) => {
    if (activeView === 'admin') {
      onViewChange('client');
      // allow state switch before scrolling
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (onNavigateSection) {
      onNavigateSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text wordmark with club crest */}
        <div
          onClick={() => {
            if (activeView === 'admin') onViewChange('client');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-amber-500/40 p-0.5 shadow-md flex items-center justify-center shrink-0">
            {clubInfo.clubLogoUrl ? (
              <img
                src={clubInfo.clubLogoUrl}
                alt={clubInfo.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <Shield className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <span className="font-heading font-extrabold text-lg md:text-xl text-slate-100 tracking-tight group-hover:text-amber-400 transition-colors">
            {clubInfo.name}
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-amber-400 whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary action - View Switcher */}
        <div className="flex items-center gap-3">
          {activeView === 'client' ? (
            <button
              onClick={() => onViewChange('admin')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              title="Vào khu vực quản trị dữ liệu đội bóng"
            >
              <Settings className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => onViewChange('client')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Quay lại giao diện dành cho cổ động viên"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Xem trang Người Hâm Mộ</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-900 rounded"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onViewChange(activeView === 'client' ? 'admin' : 'client');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-2 text-sm font-semibold rounded bg-amber-400 text-slate-950"
            >
              {activeView === 'client' ? 'Chuyển sang Admin Dashboard' : 'Xem trang Fan'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
