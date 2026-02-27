import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Terminal,
  Layers,
  Type,
  AlignLeft,
} from 'lucide-react';

const CreateNotifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      setError('Broadcast rejected: Subject and Message body required.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/announcement/add', formData);
      setSuccess(true);
      setTimeout(() => navigate('/notifications'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Uplink Error: Failed to transmit notice to network.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-72 mt-24 h-[calc(100vh-6rem)] flex flex-col font-sans bg-[#f8fafc] overflow-hidden relative">
      <header className="px-10 py-8 flex justify-between items-center shrink-0 z-10 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="group p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-[#002b5c] hover:border-[#002b5c] transition-all active:scale-95"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Terminal className="text-[#002b5c]" size={14} />
              <span className="text-[10px] font-black text-[#002b5c]/60 uppercase tracking-[0.4em]">
                Bulletin Management
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#002b5c] tracking-tight">
              Compose Announcement
            </h1>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 rounded-2xl flex items-center gap-4 border border-slate-200">
          <div className="w-8 h-8 bg-[#002b5c] rounded-lg flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Network Status
            </p>
            <p className="text-xs font-bold tracking-tight text-[#002b5c]">Direct Kiosk Uplink</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-10 py-10 z-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="flex items-center gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl mb-8 animate-in slide-in-from-top-4">
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              <p className="text-sm font-bold text-red-900 leading-tight">{error}</p>
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white border border-slate-100 rounded-[40px] shadow-2xl text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-100">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-[#002b5c] tracking-tight mb-2">
                Notice Transmitted
              </h2>
              <p className="text-slate-400 font-medium">Synchronizing with campus terminals...</p>
              <div className="mt-8 w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/2 animate-[loading_2s_ease-in-out_infinite]" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-10 space-y-10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[11px] font-black text-[#002b5c] uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} className="text-blue-500" />
                        Notice Subject
                      </label>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        {formData.subject.length}/100
                      </span>
                    </div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Mid-term examinations rescheduled"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-[#002b5c] focus:bg-white rounded-2xl py-4 px-6 text-xl font-bold text-[#002b5c] transition-all outline-none placeholder:text-slate-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[11px] font-black text-[#002b5c] uppercase tracking-widest flex items-center gap-2">
                        <AlignLeft size={14} className="text-blue-500" />
                        Full Broadcast Message
                      </label>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                          {formData.message.length} Characters
                        </span>
                      </div>
                    </div>
                    <textarea
                      name="message"
                      rows={8}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter the detailed announcement text here..."
                      className="w-full bg-slate-50 border border-slate-100 focus:border-[#002b5c] focus:bg-white rounded-2xl py-5 px-6 text-base font-medium text-slate-600 transition-all outline-none placeholder:text-slate-200 leading-relaxed resize-none"
                    />
                  </div>
                </div>
                <div className="bg-slate-50/50 border-t border-slate-100 p-8 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all active:scale-95"
                  >
                    Cancel Draft
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#002b5c] text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/10 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <span className="tracking-widest uppercase">Publish to Network</span>
                        <Send
                          size={18}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 opacity-30">
                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  Administrative Security Protocol Active
                </p>
                <div className="w-1 h-1 bg-slate-400 rounded-full" />
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 20px; 
          border: 2px solid #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default CreateNotifications;
