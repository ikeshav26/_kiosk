import React, { useState, useEffect } from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { useContext } from 'react';
import { authContext } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const [time, setTime] = useState(new Date());
  const { user, navigate, setuser } = useContext(authContext);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="fixed top-0 left-72 right-0 h-24 bg-[#002b5c] px-10 grid grid-cols-3 items-center z-40 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-b border-white/5 font-sans">
      <div className="flex items-center gap-8 justify-self-start">
        <div className="flex flex-col min-w-fit">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
              System Live
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">
            Admin-Portal
          </h2>
        </div>

        <div className="hidden xl:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 w-72 group focus-within:bg-white/10 focus-within:border-white/20 transition-all">
          <Search size={16} className="text-white/30 group-focus-within:text-white" />
          <input
            type="text"
            placeholder="Search (⌘K)"
            className="bg-transparent text-sm font-bold text-white placeholder:text-white/20 focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-black text-white tabular-nums tracking-tighter leading-none">
          {time
            .toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
            .toUpperCase()}
        </div>
        <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] mt-2 whitespace-nowrap">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="flex items-center gap-6 justify-self-end">
        <div className="w-[1px] h-10 bg-white/10" />

        <button className="flex items-center gap-4 group active:scale-95 transition-all outline-none">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-black text-white tracking-tight leading-none mb-1 group-hover:text-blue-400 transition-colors">
              {user ? user.role : ''}
            </span>
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-none">
              Management
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-xl group-hover:border-white/40 transition-all overflow-hidden relative">
            <User size={24} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <ChevronDown
            size={14}
            className="text-white/20 group-hover:text-white transition-colors"
          />
        </button>
      </div>

      <style>{`
        /* Preventing text selection on interactive navbar elements */
        nav {
          user-select: none;
        }
        /* Tabular nums ensure the clock digits don't shift layout as they change */
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
