import React from 'react';

const Card = ({
  children,
  className = '',
  header,
  headerIcon: HeaderIcon,
  headerTitle,
  headerSubtitle,
  headerAction,
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
    >
      {(header || headerTitle) && (
        <header className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            {HeaderIcon && (
              <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                <HeaderIcon size={16} />
              </div>
            )}
            <div>
              <h2 className="text-sm font-semibold text-slate-900">{headerTitle}</h2>
              {headerSubtitle && (
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
                  {headerSubtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && <div className="w-full sm:w-auto">{headerAction}</div>}
        </header>
      )}
      {children}
    </div>
  );
};

export default Card;
