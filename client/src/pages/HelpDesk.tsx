import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  LifeBuoy,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  Terminal,
  Layers,
  ShieldCheck,
  Zap,
  User,
  Phone,
} from 'lucide-react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';

const HelpDesk = () => {
  const [formData, setFormData] = useState({
    helperName: '',
    helperContactNumber: '',
    subject: '',
    description: '',
    category: 'fees',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const { t } = useTranslation();

  const keyboardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        activeInput &&
        keyboardRef.current &&
        !keyboardRef.current.contains(target) &&
        formRef.current &&
        !formRef.current.contains(target)
      ) {
        setActiveInput(null);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [activeInput]);

  const handleVirtualKeyPress = (key: string) => {
    if (!activeInput) return;
    const fieldMap: Record<string, string> = {
      Name: 'helperName',
      Contact: 'helperContactNumber',
      Heading: 'subject',
      Description: 'description',
    };
    const field = fieldMap[activeInput];
    if (!field) return;

    setFormData((prev) => {
      const current = prev[field as keyof typeof prev] as string;
      if (key === 'BKSP') return { ...prev, [field]: current.slice(0, -1) };
      if (key === 'SPACE') return { ...prev, [field]: current + ' ' };
      return { ...prev, [field]: current + key };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.helperName ||
      !formData.helperContactNumber ||
      !formData.subject ||
      !formData.description
    ) {
      setError(t('helpDesk.incompletePayload'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setActiveInput(null);

    try {
      await axios.post('/api/help-ticket/create', formData);
      setIsSuccess(true);
      setFormData({
        helperName: '',
        helperContactNumber: '',
        subject: '',
        description: '',
        category: 'fees',
      });
    } catch (err: any) {
      setError(t('helpDesk.diagnosticFailure'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#fff]/80 rounded-[60px] shadow-[inset_0_4px_20px_rgba(0,0,0,0.03)] border border-white flex flex-col font-sans relative overflow-hidden">
      <header className="p-10 pb-8 bg-white border-b border-slate-100 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#002b5c] rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-blue-900/30">
            <LifeBuoy size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Zap size={14} className="text-blue-500 fill-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                {t('helpDesk.serviceUplink')}
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#002b5c] tracking-tighter">
              {t('helpDesk.supportTerminal')}
            </h1>
          </div>
        </div>

        <div className="bg-slate-50/80 backdrop-blur-md px-6 py-4 rounded-[28px] border border-slate-200 flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-[#002b5c] uppercase tracking-widest leading-none">
                {t('helpDesk.diagnosticMode')}
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t('helpDesk.environment')}
            </p>
          </div>
          <ShieldCheck size={32} className="text-[#002b5c] opacity-20" />
        </div>
      </header>

      {/* 2. Main Operational Area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-12 py-10 custom-scrollbar transition-all duration-500 ${activeInput ? 'pb-[400px]' : 'pb-10'}`}
      >
        <div className="max-w-4xl mx-auto">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[50px] border border-slate-100 text-center animate-in zoom-in-95 duration-700 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-inner border border-emerald-100">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-[#002b5c] tracking-tight mb-3 uppercase italic">
                {t('helpDesk.transmissionConfirmed')}
              </h2>
              <p className="text-lg text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                {t('helpDesk.reportLogged')}
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-12 px-12 py-4 bg-[#002b5c] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all shadow-2xl shadow-blue-900/20"
              >
                {t('helpDesk.endSession')}
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
              {error && (
                <div className="flex items-center gap-4 p-6 bg-red-50 border border-red-100 rounded-[30px] animate-in slide-in-from-left-2">
                  <AlertCircle className="text-red-500 shrink-0" size={24} />
                  <p className="text-sm font-black text-red-900 uppercase tracking-wide">{error}</p>
                </div>
              )}

              {/* Complainant Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
                    <User size={13} className="text-blue-500" /> {t('helpDesk.yourName')}
                  </label>
                  <input
                    value={formData.helperName}
                    readOnly
                    onFocus={() => setActiveInput('Name')}
                    placeholder={t('helpDesk.yourNamePlaceholder')}
                    className={`w-full bg-white border border-slate-200 rounded-[24px] py-4 px-5 text-base font-bold text-[#002b5c] transition-all outline-none ${activeInput === 'Name' ? 'border-[#002b5c] shadow-2xl ring-8 ring-[#002b5c]/5' : 'hover:border-slate-300 shadow-sm'}`}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
                    <Phone size={13} className="text-blue-500" /> {t('helpDesk.contactNumber')}
                  </label>
                  <input
                    value={formData.helperContactNumber}
                    readOnly
                    onFocus={() => {
                      setActiveInput('Contact');
                      setTimeout(
                        () => scrollRef.current?.scrollBy({ top: 200, behavior: 'smooth' }),
                        100
                      );
                    }}
                    placeholder={t('helpDesk.contactNumberPlaceholder')}
                    className={`w-full bg-white border border-slate-200 rounded-[24px] py-4 px-5 text-base font-bold text-[#002b5c] transition-all outline-none ${activeInput === 'Contact' ? 'border-[#002b5c] shadow-2xl ring-8 ring-[#002b5c]/5' : 'hover:border-slate-300 shadow-sm'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Subject Heading */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
                    <Terminal size={13} className="text-blue-500" /> {t('helpDesk.incidentHeading')}
                  </label>
                  <input
                    value={formData.subject}
                    readOnly
                    onFocus={() => setActiveInput('Heading')}
                    placeholder={t('helpDesk.subjectPlaceholder')}
                    className={`w-full bg-white border border-slate-200 rounded-[24px] py-4 px-5 text-base font-bold text-[#002b5c] transition-all outline-none ${activeInput === 'Heading' ? 'border-[#002b5c] shadow-2xl ring-8 ring-[#002b5c]/5' : 'hover:border-slate-300 shadow-sm'}`}
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
                    <Layers size={13} className="text-blue-500" /> {t('helpDesk.systemCategory')}
                  </label>
                  <div className="relative group">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      title="Select system category for the support ticket"
                      className="w-full bg-white border border-slate-200 rounded-[24px] py-4 px-5 text-base font-bold text-[#002b5c] appearance-none focus:outline-none focus:border-[#002b5c] transition-all cursor-pointer shadow-sm group-hover:border-slate-300"
                    >
                      <option value="fees">{t('helpDesk.cat_fees')}</option>
                      <option value="admission">{t('helpDesk.cat_admission')}</option>
                      <option value="exam">{t('helpDesk.cat_exam')}</option>
                      <option value="scholarship">{t('helpDesk.cat_scholarship')}</option>
                      <option value="library">{t('helpDesk.cat_library')}</option>
                      <option value="hostel">{t('helpDesk.cat_hostel')}</option>
                      <option value="transport">{t('helpDesk.cat_transport')}</option>
                      <option value="attendance">{t('helpDesk.cat_attendance')}</option>
                      <option value="faculty">{t('helpDesk.cat_faculty')}</option>
                      <option value="infrastructure">{t('helpDesk.cat_infrastructure')}</option>
                      <option value="it">{t('helpDesk.cat_it')}</option>
                      <option value="bug">{t('helpDesk.cat_bug')}</option>
                      <option value="other">{t('helpDesk.cat_other')}</option>
                    </select>
                    <ChevronDown
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-[#002b5c] pointer-events-none transition-transform group-active:translate-y-0"
                      size={24}
                    />
                  </div>
                </div>
              </div>

              {/* Operational Description */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
                  <MessageSquare size={14} className="text-blue-500" />{' '}
                  {t('helpDesk.rootCauseAnalysis')}
                </label>
                <textarea
                  value={formData.description}
                  readOnly
                  onFocus={() => {
                    setActiveInput('Description');
                    setTimeout(
                      () => scrollRef.current?.scrollBy({ top: 300, behavior: 'smooth' }),
                      100
                    );
                  }}
                  rows={5}
                  placeholder={t('helpDesk.descriptionPlaceholder')}
                  className={`w-full bg-white border border-slate-200 rounded-[32px] py-5 px-6 text-base font-medium text-slate-600 transition-all outline-none leading-relaxed resize-none ${activeInput === 'Description' ? 'border-[#002b5c] shadow-2xl ring-8 ring-[#002b5c]/5' : 'hover:border-slate-300 shadow-sm'}`}
                />
              </div>

              {/* Submit Suite */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#002b5c] text-white py-6 rounded-[36px] font-black text-lg shadow-2xl shadow-blue-900/30 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-5 group mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={32} />
                ) : (
                  <>
                    <span className="tracking-[0.1em] uppercase italic">
                      {t('helpDesk.initiateBroadcast')}
                    </span>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <Send
                        size={24}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </div>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3. Scoped Virtual Keyboard Dock */}
      {activeInput && !isSuccess && (
        <VirtualKeyboard
          ref={keyboardRef}
          activeInputName={activeInput}
          onKeyPress={handleVirtualKeyPress}
          onClose={() => setActiveInput(null)}
          numericOnly={activeInput === 'Contact'}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 20px; 
          border: 2px solid white;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default HelpDesk;
