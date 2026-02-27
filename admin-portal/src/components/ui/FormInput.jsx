import React from 'react';

const FormInput = ({
  label,
  name,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  placeholder,
  disabled = false,
  size = 'default', // 'default' | 'small'
}) => {
  const sizeClasses =
    size === 'small' ? 'py-2 pl-9 pr-3 text-sm rounded-md' : 'py-2.5 pl-10 pr-4 text-sm rounded-lg';

  const iconSize = size === 'small' ? 14 : 16;
  const iconPosition = size === 'small' ? 'left-3' : 'left-3.5';
  const labelPosition = size === 'small' ? 'left-2 text-[10px]' : 'left-3 text-xs';

  return (
    <div className="relative group">
      <label
        className={`absolute -top-2.5 ${labelPosition} bg-white px-1 font-medium text-slate-500 group-focus-within:text-slate-900:text-white transition-colors z-10`}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900:text-white transition-colors`}
            size={iconSize}
          />
        )}
        <input
          type={type}
          name={name}
          disabled={disabled}
          className={`w-full border border-slate-200 bg-white ${sizeClasses} font-medium text-slate-900 focus:outline-none focus:border-slate-400:border-slate-500 focus:ring-1 focus:ring-slate-400:ring-slate-500 transition-all shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''} ${!Icon ? 'pl-3' : ''} placeholder:text-slate-400:text-slate-500`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default FormInput;
