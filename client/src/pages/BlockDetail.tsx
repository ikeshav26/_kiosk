import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ChevronLeft,
  BookOpen,
  GraduationCap,
  Layers,
  CheckCircle2,
  DoorOpen,
  Clock,
  Mail,
  Phone,
  Accessibility,
  ArrowUpCircle,
  FlaskConical,
  Bath,
  ArrowUpDown,
  MoreHorizontal,
  Briefcase,
  ChevronRight,
  ImageIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { instance } from '../utils/instance';

interface RoomDetail {
  roomNumber?: string;
  roomName?: string;
  floor?: number;
  type?: 'classroom' | 'lab' | 'office' | 'washroom' | 'staircase' | 'other';
  coordinates?: { lat?: number; lng?: number };
}

interface DepartmentInfo {
  about: string;
  coursesOffered: string[];
}

interface BuildingDetail {
  _id: string;
  name: string;
  code?: string;
  type: string;
  description?: string;
  totalFloors?: number;
  departments?: string[];
  departmentInfo?: DepartmentInfo;
  rooms?: RoomDetail[];
  imageUrl?: string[];
  isAccessible?: boolean;
  hasLift?: boolean;
  openTime?: string;
  closeTime?: string;
  isOpenWeekends?: boolean;
  contactNumber?: string;
  contactEmail?: string;
  coordinates?: { lat?: number; lng?: number };
}

const ROOM_TYPE_CONFIG: Record<string, { icon: typeof DoorOpen; color: string; bg: string }> = {
  classroom: { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  lab: { icon: FlaskConical, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' },
  office: { icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  washroom: { icon: Bath, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
  staircase: { icon: ArrowUpDown, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  other: { icon: MoreHorizontal, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-100' },
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop';

const BlockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState<BuildingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await instance.get(`/api/building/${id}`);
        setData(res.data.building || res.data);
      } catch (err) {
        console.error('Error fetching building detail:', err);
        setError(t('blockDetail.errorLoading'));
      } finally {
        setLoading(false);
      }
    };
    fetchBuilding();
  }, [id]);

  const images = Array.isArray(data?.imageUrl) && data.imageUrl.length > 0 ? data.imageUrl : [DEFAULT_IMAGE];

  const nextSlide = useCallback(() => {
    setActiveImg((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((idx: number) => {
    setActiveImg(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, 4000);
  }, [nextSlide]);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(nextSlide, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length, nextSlide]);

  useEffect(() => {
    setActiveImg(0);
  }, [data?._id]);

  if (loading)
    return (
      <div className="h-full bg-white rounded-[40px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-slate-100 border-t-[#002b5c] rounded-full animate-spin" />
          <span className="text-slate-300 font-bold tracking-[0.3em] text-[10px] uppercase">
            {t('blockDetail.loadingBlock')}
          </span>
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-[40px] p-20 text-center border border-slate-100">
        <AlertCircle size={40} className="text-red-300 mb-6" />
        <h3 className="text-xl font-bold text-[#002b5c] mb-8">
          {error || t('blockDetail.blockNotFound')}
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-[#002b5c] text-white rounded-xl font-bold active:scale-95 transition-all text-sm"
        >
          {t('common.returnToDirectory')}
        </button>
      </div>
    );

  const courses = data.departmentInfo?.coursesOffered ?? [];
  const about = data.departmentInfo?.about ?? '';
  const rooms = data.rooms ?? [];


  const roomsByFloor = rooms.reduce<Record<number, RoomDetail[]>>((acc, room) => {
    const floor = room.floor ?? 0;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {});
  const sortedFloors = Object.keys(roomsByFloor)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="h-full bg-white rounded-[28px] overflow-hidden flex flex-col font-sans">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col lg:flex-row">
          <div className="relative lg:w-[45%] h-64 lg:h-auto lg:min-h-[420px] overflow-hidden group shrink-0">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${data.name} ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  idx === activeImg ? 'opacity-100' : 'opacity-0'
                }`}
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
              />
            ))}

            <div className="hidden lg:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
            <button
              onClick={() => navigate(-1)}
              className="absolute top-5 left-5 z-20 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg shadow-sm active:scale-95 transition-all"
            >
              <ChevronLeft size={14} className="text-[#002b5c]" />
              <span className="text-[9px] font-bold text-[#002b5c] uppercase tracking-wider">
                {t('common.back')}
              </span>
            </button>

            {images.length > 1 && (
              <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-lg">
                <ImageIcon size={10} className="text-white/80" />
                <span className="text-[9px] font-bold text-white">{activeImg + 1}/{images.length}</span>
              </div>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`rounded-full transition-all duration-300 ${
                      idx === activeImg
                        ? 'w-5 h-1.5 bg-white shadow-sm'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => goToSlide((activeImg - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-[#002b5c] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => goToSlide((activeImg + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-[#002b5c] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          <div className="flex-1 px-8 py-8 lg:py-10 lg:px-10 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#002b5c] text-white rounded-md text-[9px] font-bold uppercase tracking-wider">
                {data.type}
              </span>
              {data.code && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[9px] font-bold tracking-wider">
                  {data.code}
                </span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#002b5c] leading-tight mb-3">
              {data.name}
            </h1>

            {data.description && (
              <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
                {data.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
              <div className="flex items-center gap-2.5">
                <Layers size={14} className="text-slate-400" />
                <span className="text-xs text-slate-600">{data.totalFloors || 0} {t('common.floors')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <DoorOpen size={14} className="text-slate-400" />
                <span className="text-xs text-slate-600">{rooms.length} {t('common.rooms')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="text-slate-400" />
                <span className="text-xs text-slate-600">{data.openTime || '09:00'} – {data.closeTime || '16:00'}</span>
              </div>
              {data.isAccessible && (
                <div className="flex items-center gap-2.5">
                  <Accessibility size={14} className="text-emerald-500" />
                  <span className="text-xs text-emerald-600">{t('common.accessible')}</span>
                </div>
              )}
              {data.hasLift && (
                <div className="flex items-center gap-2.5">
                  <ArrowUpCircle size={14} className="text-blue-500" />
                  <span className="text-xs text-blue-600">{t('common.lift')}</span>
                </div>
              )}
              {data.isOpenWeekends && (
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-xs text-emerald-600">{t('blockDetail.openWeekends')}</span>
                </div>
              )}
            </div>

            {data.departments && data.departments.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('common.departments')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.departments.map((dept, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-md text-[10px] font-semibold">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(data.contactEmail || data.contactNumber) && (
              <div className="mt-auto pt-5 border-t border-slate-100 flex flex-wrap gap-4">
                {data.contactEmail && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail size={13} className="text-slate-400" />
                    {data.contactEmail}
                  </div>
                )}
                {data.contactNumber && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone size={13} className="text-slate-400" />
                    {data.contactNumber}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {images.length > 1 && (
          <div className="px-8 lg:px-10 py-4 border-t border-slate-50">
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === activeImg
                      ? 'border-[#002b5c] opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {(about || courses.length > 0) && (
          <div className="px-8 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 border-t border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-[#002b5c] uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen size={14} />
                {t('blockDetail.aboutDepartment')}
              </h3>
              {about ? (
                <p className="text-sm text-slate-600 leading-relaxed">{about}</p>
              ) : (
                <p className="text-xs text-slate-300 italic">{t('common.noDescription')}</p>
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#002b5c] uppercase tracking-wider mb-4 flex items-center gap-2">
                <GraduationCap size={14} />
                {t('common.coursesOffered')}
              </h3>
              {courses.length > 0 ? (
                <ul className="space-y-1.5">
                  {courses.map((course, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      {course}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-300 italic">{t('common.noCourses')}</p>
              )}
            </div>
          </div>
        )}

        {rooms.length > 0 && (
          <div className="px-8 lg:px-10 py-8 border-t border-slate-100">
            <h3 className="text-xs font-bold text-[#002b5c] uppercase tracking-wider mb-6 flex items-center gap-2">
              <DoorOpen size={14} />
              {t('blockDetail.roomsDirectory')}
              <span className="text-slate-400 font-normal ml-1">({rooms.length})</span>
            </h3>

            <div className="space-y-8">
              {sortedFloors.map((floor) => (
                <div key={floor}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-7 h-7 bg-[#002b5c] text-white rounded-md flex items-center justify-center text-[10px] font-bold">
                      {floor === 0 ? 'G' : floor}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {floor === 0 ? t('blockDetail.groundFloor') : `${t('blockDetail.floor')} ${floor}`}
                    </span>
                    <span className="text-[10px] text-slate-300 ml-1">
                      {roomsByFloor[floor].length} {roomsByFloor[floor].length === 1 ? t('blockDetail.room') : t('common.rooms')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                    {roomsByFloor[floor].map((room, idx) => {
                      const config = ROOM_TYPE_CONFIG[room.type || 'other'] || ROOM_TYPE_CONFIG.other;
                      const IconComponent = config.icon;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors ${config.bg}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/70 ${config.color}`}>
                            <IconComponent size={15} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#002b5c] truncate leading-tight">
                              {room.roomNumber && room.roomName
                                ? `${room.roomNumber} — ${room.roomName}`
                                : room.roomName || room.roomNumber || '—'}
                            </p>
                            <span className="text-[9px] text-slate-400 capitalize">{t(`blockDetail.roomType.${room.type || 'other'}`)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default BlockDetail;
