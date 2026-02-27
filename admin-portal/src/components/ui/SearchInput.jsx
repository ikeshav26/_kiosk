import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div
      className={`flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 focus-within:border-slate-900:border-slate-500 focus-within:bg-white:bg-slate-900 transition-all ${className}`}
    >
      <Search size={18} className="text-slate-400" />
      <input
        className="bg-transparent border-none focus:outline-none text-sm font-medium text-slate-900 w-full placeholder:text-slate-400:text-slate-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
