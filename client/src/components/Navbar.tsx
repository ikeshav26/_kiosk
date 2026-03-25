import { useState, useEffect, useRef } from 'react';
import {
  Globe,
  GraduationCap,
  ChevronDown,
  Check,
  BadgeInfo,
  X,
  Github,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLoginModal from './AdminLoginModal';

const LANGUAGES = [
  { code: 'en', label: 'ENGLISH', nativeLabel: 'English' },
  { code: 'hi', label: 'हिंदी', nativeLabel: 'Hindi' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', nativeLabel: 'Punjabi' },
];

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [badgeInfoModalOpen, setBadgeInfoModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { t, i18n } = useTranslation();

  const handleLogoClick = () => {
    setLogoClicks((prev) => prev + 1);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 1500);

    if (logoClicks >= 4) {
      setLogoClicks(0);
      setAdminModalOpen(true);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const rest = date
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      .toUpperCase();
    return { day, rest };
  };

  const { day, rest } = formatDate(currentTime);
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <>
      <nav className="w-full h-32 bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#001a33] px-10 flex items-center justify-between text-white shadow-2xl border-b border-white/10 select-none z-50">
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-4 group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
            <GraduationCap size={42} className="text-white fill-white/20" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight leading-none">
              {t('navbar.titleBold')}{' '}
              <span className="font-light opacity-90">{t('navbar.titleLight')}</span>
            </h1>
            <p className="text-[10px] tracking-[0.2em] opacity-50 font-bold uppercase mt-1">
              {t('navbar.ecosystem')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-5xl font-medium tracking-tighter tabular-nums">
            {formatTime(currentTime)}
          </div>
          <div className="h-12 w-[1px] bg-white/20" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-[0.1em] opacity-60">{day}</span>
            <span className="text-lg font-medium tracking-wide">{rest.replace(',', '')}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setBadgeInfoModalOpen(true)}
            className="flex items-center justify-center cursor-pointer hover:opacity-80 active:scale-95 transition-all"
            title="Info"
          >
            <BadgeInfo height={37} width={37} />
          </button>

          <div className="flex items-center gap-6" ref={dropdownRef}>
            <div className="relative">
              <button
                className="flex items-center gap-3 bg-white text-[#001f3f] px-6 py-3 rounded-full font-bold text-sm shadow-lg active:bg-gray-100 transition-colors touch-none"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <Globe size={20} strokeWidth={2.5} />
                <span>{currentLang.label}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-[#001f3f] text-white'
                          : 'text-[#001f3f] hover:bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {i18n.language === lang.code && <Check size={16} strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <AdminLoginModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />

      {badgeInfoModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setBadgeInfoModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-[90%] overflow-hidden relative border border-slate-200 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#002b5c] to-[#003d7a] p-10 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
                  Development Team
                </h2>
                <p className="text-sm text-blue-200 mt-2">Campus Kiosk Project</p>
              </div>
              <button
                onClick={() => setBadgeInfoModalOpen(false)}
                className="w-12 h-12 bg-white/10 hover:bg-red-500/30 border border-white/20 rounded-2xl text-white transition-all active:scale-90 flex items-center justify-center"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'Keshav Gilhotra',
                    handle: 'ikeshav26',
                    dept: 'CSE',
                    batch: '2024-2028',
                    avatar: 'https://avatars.githubusercontent.com/u/203427446?v=4',
                  },
                  {
                    name: 'Manpreet Singh',
                    handle: 'MannuVilasara',
                    dept: 'CSE',
                    batch: '2024-2028',
                    avatar: 'https://avatars.githubusercontent.com/u/117009138?s=130&v=4',
                  },
                  {
                    name: 'Bhavuk Ahuja',
                    handle: 'bhavukahuja',
                    dept: 'CSE',
                    batch: '2024-2028',
                    avatar: 'https://avatars.githubusercontent.com/u/219114795?v=4',
                  },
                  {
                    name: 'Krish Puri',
                    handle: 'KrishTrue',
                    dept: 'CSE',
                    batch: '2024-2028',
                    avatar: 'https://avatars.githubusercontent.com/u/215704039?v=4',
                  },
                ].map((dev, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg hover:border-[#002b5c]/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden border-3 border-[#002b5c]/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={dev.avatar}
                          alt={dev.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${dev.name}&background=002b5c&color=fff`;
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[#002b5c] truncate">
                          {dev.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mb-3 flex items-center gap-1.5">
                          <Github size={14} className="text-blue-500" />
                          {dev.handle}
                        </p>

                        <div className="flex gap-3 text-xs">
                          <div>
                            <span className="font-bold text-slate-600">{dev.dept}</span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <div>
                            <span className="font-bold text-slate-600">{dev.batch}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mentor Section */}
              <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Project Mentor</p>
                  <p className="text-lg font-bold text-[#002b5c]">Er. Charandeep Singh Bedi</p>
                </div>
                <div className="w-1 h-12 bg-gradient-to-b from-[#002b5c] to-transparent rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
