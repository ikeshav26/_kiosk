import { ArrowUp, Delete, Keyboard as KeyboardIcon, X } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const VirtualKeyboard = forwardRef<
  HTMLDivElement,
  {
    onKeyPress: (key: string) => void;
    onClose: () => void;
    activeInputName: string;
    numericOnly?: boolean;
  }
>(({ onKeyPress, onClose, activeInputName, numericOnly }, ref) => {
  const [isShift, setIsShift] = useState(false);
  const { t } = useTranslation();

  const numericLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['BKSP', '0', 'DONE'],
  ];

  const layouts = {
    default: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'BKSP'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@'],
      ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '-'],
      ['SPACE', 'DONE'],
    ],
    shift: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'BKSP'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '_'],
      ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '!', '?'],
      ['SPACE', 'DONE'],
    ],
  };

  const currentLayout = numericOnly ? numericLayout : isShift ? layouts.shift : layouts.default;

  const handleKeyClick = (key: string) => {
    if (key === 'SHIFT') {
      setIsShift(!isShift);
    } else if (key === 'DONE') {
      onClose();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div
      ref={ref}
      className="absolute bottom-0 left-0 right-0 z-[60] bg-[#fdfdfd] border-t border-slate-200 p-8 shadow-[0_-30px_80px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-full duration-500 rounded-b-[60px]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#002b5c] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <KeyboardIcon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                {t('helpDesk.hardwareInterface')}
              </p>
              <p className="text-sm font-bold text-[#002b5c] tracking-tight uppercase italic">
                {t('helpDesk.activeInput', { name: activeInputName })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close keyboard"
            className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 transition-all active:scale-90 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {currentLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2.5">
              {row.map((key) => {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeyClick(key)}
                    className={`
                      h-16 flex items-center justify-center rounded-[20px] font-bold text-xl transition-all active:translate-y-1 shadow-sm border-b-4
                      ${key === 'SPACE' ? 'flex-[4]' : 'flex-1'}
                      ${key === 'DONE' ? 'bg-[#002b5c] text-white border-blue-900 flex-[1.4]' : 'bg-white text-[#002b5c] border-slate-200 hover:bg-slate-50'}
                      ${key === 'SHIFT' && isShift ? 'bg-blue-600 text-white border-blue-800' : ''}
                      ${key === 'BKSP' ? 'text-red-500' : ''}
                    `}
                  >
                    {key === 'BKSP' ? (
                      <Delete size={24} />
                    ) : key === 'SHIFT' ? (
                      <ArrowUp size={24} />
                    ) : key === 'DONE' ? (
                      t('keyboard.confirm')
                    ) : key === 'SPACE' ? (
                      t('keyboard.space')
                    ) : (
                      key
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
