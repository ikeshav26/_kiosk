import { useState, useEffect, useRef } from 'react';
import { Globe, GraduationCap, ChevronDown, Check, BadgeInfo, Calendar, X, Cpu, Github } from 'lucide-react';
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

       
        <div className='flex items-center justify-center gap-6'>
           <button
            onClick={() => setBadgeInfoModalOpen(true)}
            className='flex items-center justify-center cursor-pointer hover:opacity-80 active:scale-95 transition-all'
            title='Info'
          >
            <BadgeInfo height={37} width={37}/>
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
    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001226]/70 backdrop-blur-xl animate-in fade-in duration-500"
    onClick={() => setBadgeInfoModalOpen(false)}
  >
    <div
      className="bg-white rounded-[60px] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.6)] max-w-5xl w-[95%] overflow-hidden relative border border-white/20 animate-in zoom-in-95 duration-400"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#002b5c] p-12 flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
        </div>
        
        <div className="relative z-10 flex items-center gap-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[32px] flex items-center justify-center border border-white/20 shadow-2xl">
            <Cpu className="text-blue-300" size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white  uppercase italic leading-none">Core Developers</h2>
          </div>
        </div>

        <button
          onClick={() => setBadgeInfoModalOpen(false)}
          className="relative z-10 w-16 h-16 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-[24px] text-white transition-all active:scale-90 group flex items-center justify-center"
        >
          <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <div className="p-12 lg:p-16 bg-[#f8fafc]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { 
              name: "Keshav Gilhotra", 
              handle: "ikeshav26", 
              dept: "CSE", 
              batch: "2024-2028", 
              avatar: "https://avatars.githubusercontent.com/u/203427446?v=4" 
            },
            { 
              name: "Manpreet Singh", 
              handle: "manpreetvilasara", 
              dept: "CSE", 
              batch: "2024-2028", 
              avatar: "https://avatars.githubusercontent.com/u/117009138?s=130&v=4" 
            },
            { 
              name: "Bhavuk Ahuja", 
              handle: "bhavukahuja", 
              dept: "CSE", 
              batch: "2024-2028", 
              avatar: "https://avatars.githubusercontent.com/u/219114795?v=4" 
            },
            { 
              name: "Krish Puri", 
              handle: "KrishTrue", 
              dept: "CSE", 
              batch: "2024-2028", 
              avatar: "https://avatars.githubusercontent.com/u/215704039?v=4" 
            }
          ].map((dev, idx) => (
            <div 
              key={idx}
              className="group bg-white border border-slate-200 rounded-[44px] p-6 flex items-center gap-8 hover:border-blue-500/40 hover:shadow-[0_40px_80px_-20px_rgba(0,43,92,0.1)] transition-all duration-500 relative overflow-hidden"
            >
              <span className="absolute -bottom-4 -right-4 text-7xl font-black text-slate-50 select-none pointer-events-none group-hover:text-blue-50 transition-colors">
                {idx + 1}
              </span>

              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-[#002b5c] rounded-[38px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                <div className="w-28 h-28 rounded-[36px] overflow-hidden border-[6px] border-slate-50 shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={dev.avatar} 
                    alt={dev.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${dev.name}&background=002b5c&color=fff`; }}
                  />
                </div>
             </div>

              <div className="flex-1 min-w-0 z-10">
                
                <h3 className="text-2xl font-black text-[#002b5c] tracking-tighter truncate mb-1 italic">
                  {dev.name}
                </h3>
                
                <p className="text-sm font-bold text-slate-400 mb-5 flex items-center gap-2">
                   <Github size={22} className="text-blue-400" />
                   {dev.handle}
                </p>

                <div className="flex items-center gap-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#002b5c] transition-colors">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Department</p>
                      <p className="text-xs font-bold text-[#002b5c]">{dev.dept}</p>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-100 " />
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#002b5c] transition-colors">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Batch</p>
                      <p className="text-xs font-bold text-[#002b5c]">{dev.batch}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Navbar;
