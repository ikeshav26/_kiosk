import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = ({ icon: Icon = Loader2, message = 'Loading...' }) => {
  return (
    <div className="lg:ml-64 mt-20 h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-slate-50/50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={20} className="text-slate-900" />
        </div>
      </div>
      <span className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">
        {message}
      </span>
    </div>
  );
};

export default PageLoader;
