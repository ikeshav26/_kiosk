import { useState, useEffect, useCallback } from 'react';
import { Bell, Clock, RefreshCw, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { instance } from '../utils/instance';


interface Announcement {
  _id: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const TimeAgo = ({ date }: { date: string }) => {
  const { t, i18n } = useTranslation();
  const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  if (isNaN(diff)) return null;
  let text = '';
  if (diff < 60) text = t('announcements.justNow', 'Just now');
  else if (diff < 3600)
    text = t('announcements.minutesAgo', {
      count: Math.floor(diff / 60),
      defaultValue: '{{count}}m ago',
    });
  else if (diff < 86400)
    text = t('announcements.hoursAgo', {
      count: Math.floor(diff / 3600),
      defaultValue: '{{count}}h ago',
    });
  else text = new Date(date).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });

  return (
    <div className="flex items-center gap-2 bg-slate-50 text-slate-500 px-3 py-1 rounded-full border border-slate-200">
      <Clock size={14} className="opacity-60" />
      <span className="text-[10px] font-black uppercase tracking-widest">{text}</span>
    </div>
  );
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const apiLang = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(`/api/announcement/all`, {
        params: { lang: apiLang, page, limit: 10 },
      });
      setAnnouncements(response.data.announcements || []);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      console.error('Kiosk Announcements Fetch Error:', err);
      setError(t('announcements.error', 'Unable to load latest notifications.'));
    } finally {
      setLoading(false);
    }
  }, [apiLang, page, t]);

  useEffect(() => {
    fetchAnnouncements();
    const autoRefresh = setInterval(fetchAnnouncements, 300000);
    return () => clearInterval(autoRefresh);
  }, [fetchAnnouncements]);

  return (
    <div className="flex flex-col h-full bg-[#fcfdfe] rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 font-sans relative">
      <div className="p-10 pb-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-1 bg-[#002b5c] rounded-full" />
            <span className="text-[#002b5c] font-black text-[10px] tracking-[0.4em] uppercase opacity-60">
              {t('announcements.campusUpdates', 'Campus Updates')}
            </span>
          </div>
          <h2 className="text-4xl font-black text-[#002b5c] tracking-tight">
            {t('announcements.bulletins', 'Bulletins')}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {totalPages > 1 && (
            <div className="flex items-center gap-4 mr-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-4 rounded-2xl font-bold bg-white text-[#002b5c] border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                {t('announcements.prevPage', 'Prev')}
              </button>
              <span className="font-black text-xl text-[#002b5c]">
                {page} <span className="text-slate-400 font-medium text-lg mx-1">/</span>{' '}
                {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-6 py-4 rounded-2xl font-bold bg-white text-[#002b5c] border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                {t('announcements.nextPage', 'Next')}
              </button>
            </div>
          )}
          <button
            onClick={fetchAnnouncements}
            disabled={loading}
            className="p-4 bg-white border border-slate-200 rounded-2xl text-[#002b5c] shadow-sm active:scale-90 active:bg-slate-50 transition-all group flex items-center justify-center"
          >
            <RefreshCw
              size={24}
              className={`${loading ? 'animate-spin text-blue-500' : 'group-hover:rotate-180 transition-transform duration-700'}`}
            />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-6 custom-scrollbar bg-slate-50/20">
        {loading && announcements.length === 0 ? (
          <div className="space-y-6 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 w-2 h-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="bg-red-50 p-8 rounded-full mb-6 border border-red-100">
              <Info size={48} className="text-red-400" />
            </div>
            <p className="text-xl font-bold text-slate-500 mb-8">{error}</p>
            <button
              onClick={fetchAnnouncements}
              className="px-10 py-4 bg-[#002b5c] text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
            >
              {t('announcements.retry', 'Retry')}
            </button>
          </div>
        ) : announcements.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale">
            <Bell size={120} strokeWidth={0.5} className="text-[#002b5c] mb-6" />
            <h3 className="text-3xl font-black text-[#002b5c]">
              {t('announcements.boardClear', 'Board Clear')}
            </h3>
            <p className="text-lg mt-2 font-medium">
              {t('announcements.noNew', 'No new announcements at this time')}
            </p>
          </div>
        ) : (
          <div className="space-y-6 pb-12">
            {announcements.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/announcement/${item._id}`)}
                className="group relative w-full bg-white p-8 rounded-[32px] flex items-center gap-8 shadow-sm border border-slate-100 hover:border-[#002b5c]/30 hover:shadow-xl transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-r-full bg-[#002b5c] opacity-20 group-hover:bg-[#002b5c] group-hover:opacity-100 transition-all" />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-[#002b5c] transition-colors truncate pr-4">
                      {item.subject}
                    </h3>
                    <div className="shrink-0">
                      <TimeAgo date={item.createdAt} />
                    </div>
                  </div>

                  <p className="text-slate-500 text-lg leading-relaxed font-medium line-clamp-2">
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center justify-center w-14 h-14 bg-slate-50 rounded-2xl group-hover:bg-[#002b5c] group-hover:text-white transition-all duration-300 shadow-inner">
                  <ChevronRight
                    size={28}
                    className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 rounded-xl font-bold bg-white text-[#002b5c] border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                >
                  {t('announcements.prevPage', 'Previous')}
                </button>
                <span className="font-bold text-slate-500">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-3 rounded-xl font-bold bg-white text-[#002b5c] border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                >
                  {t('announcements.nextPage', 'Next')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(0, 43, 92, 0.1); 
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Announcements;
