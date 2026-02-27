import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bell,
  Ticket,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Settings,
} from 'lucide-react';
import axios from 'axios';
import { authContext } from '../context/AuthContext';

const SideBar = () => {
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { label: 'Faculty', icon: Users, route: '/faculty' },
    { label: 'Notifications', icon: Bell, route: '/notifications' },
    { label: 'Help Tickets', icon: Ticket, route: '/help-requests' },
  ];
  const { user, setuser, navigate } = useContext(authContext);

  const getNavLinkClass = (isActive) => {
    const base =
      'group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 mb-2 relative overflow-hidden';
    const active = isActive
      ? 'bg-white text-[#002b5c] shadow-lg shadow-black/20 translate-x-2'
      : 'text-white/60 hover:text-white hover:bg-white/5';
    return `${base} ${active}`;
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/auth/logout');
      console.log(res.data);
      setuser(null);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#002b5c] flex flex-col z-50 shadow-[10px_0_40px_rgba(0,0,0,0.1)] border-r border-white/5 font-sans">
      <div className="p-10 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
            Admin Portal
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase italic">
          Smart <span className="text-white/50 font-medium">Console</span>
        </h1>
      </div>

      <nav className="flex-1 px-6 overflow-y-auto custom-scrollbar pt-4">
        <div className="mb-6">
          <p className="px-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
            Main Menu
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.route}
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={22}
                    className={isActive ? 'text-[#002b5c]' : 'text-white/40 group-hover:text-white'}
                  />
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto animate-in slide-in-from-left-2 duration-300">
                      <ChevronRight size={18} />
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-8">
          <p className="px-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
            System
          </p>
          <NavLink to="/settings" className={({ isActive }) => getNavLinkClass(isActive)}>
            <Settings size={22} className="opacity-40" />
            <span className="font-bold text-sm tracking-wide">Settings</span>
          </NavLink>
        </div>
      </nav>

      <div className="p-8 border-t border-white/5 bg-black/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white overflow-hidden">
            <Users size={24} className="opacity-30" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white tracking-tight truncate">Administrator</p>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
              Master Access
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Logout Session
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
};

export default SideBar;
