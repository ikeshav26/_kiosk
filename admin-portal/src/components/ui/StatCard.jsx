import React from 'react';

const StatCard = ({ label, value, icon: Icon, color, bgColor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 group transition-all hover:shadow-md hover:border-slate-300:border-slate-600 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`w-12 h-12 ${bgColor} ${color} rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 border border-slate-100`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
