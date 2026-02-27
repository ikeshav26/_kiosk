import React from 'react';
import { Mail, IdCard, BadgeCheck, User as UserIcon } from 'lucide-react';

const PageHeader = ({ user, roleLabel = 'Admin', badgeColor = 'bg-emerald-500' }) => {
  return (
    <header className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
            <UserIcon size={28} strokeWidth={1.5} />
          </div>
          <div className="text-slate-900">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span
                className={`${badgeColor} text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md`}
              >
                Active
              </span>
              <div className="flex items-center gap-1 text-slate-500">
                <BadgeCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{roleLabel}</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {user?.name || 'Administrator'}
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-slate-500 text-sm">
              <div className="flex items-center gap-1.5">
                <Mail size={14} />
                <span>{user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IdCard size={14} />
                <span className="uppercase text-xs font-medium">ID: {user?.userId || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-xl text-center w-full md:w-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            Role
          </p>
          <p className="text-sm font-bold text-slate-700 uppercase">{roleLabel}</p>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
