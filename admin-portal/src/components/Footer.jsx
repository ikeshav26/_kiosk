import React from 'react';
import { ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="lg:ml-64 p-6 border-t border-slate-100 flex items-center justify-center bg-slate-50 text-slate-400">
      <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
        <ShieldAlert size={14} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
          Admin Portal Interface
        </span>
      </div>
    </footer>
  );
};

export default Footer;
