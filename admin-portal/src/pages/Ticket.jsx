import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/Instance';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Trash2,
  Loader2,
  CheckCircle2,
  Settings,
  Cpu,
  Wifi,
  MoreHorizontal,
  ChevronDown,
  User,
  Phone,
  Tag,
} from 'lucide-react';

const Ticket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statusOptions = [
    { value: 'open', label: 'Open', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' },
    {
      value: 'in-progress',
      label: 'In-Progress',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      dot: 'bg-blue-500',
    },
    {
      value: 'resolved',
      label: 'Resolved',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      dot: 'bg-emerald-500',
    },
    {
      value: 'closed',
      label: 'Closed',
      color: 'text-slate-500',
      bg: 'bg-slate-100',
      dot: 'bg-slate-400',
    },
  ];

  const fetchTicketDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/api/help-ticket/${id}`);
      setData(res.data.ticket || res.data);
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('The incident record could not be retrieved from the central registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleUpdateStatus = async (newStatus) => {
    setStatusOpen(false);
    setActionLoading(true);
    try {
      await axiosInstance.put(`/api/help-ticket/update-status/${id}`, { status: newStatus });
      setData((prev) => ({ ...prev, status: newStatus }));
      toast.success('Status updated successfully');
    } catch (err) {
      toast.error('Administrative status update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Permanent Deletion: This action will expunge the record from the database. Proceed?'
      )
    )
      return;
    setActionLoading(true);
    try {
      await axiosInstance.delete(`/api/help-ticket/delete/${id}`);
      toast.success('Ticket deleted successfully');
      navigate('/help-requests');
    } catch (err) {
      toast.error('Deletion failed. System override required.');
    } finally {
      setActionLoading(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'software':
        return <Settings size={18} />;
      case 'hardware':
        return <Cpu size={18} />;
      case 'network':
        return <Wifi size={18} />;
      default:
        return <Tag size={18} />;
    }
  };

  if (loading)
    return (
      <div className="lg:ml-64 mt-20 h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-slate-50">
        <Loader2 size={32} className="text-slate-900 animate-spin mb-4" />
        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
          Syncing Data
        </span>
      </div>
    );

  if (!data) return null;

  const currentStatus = statusOptions.find((s) => s.value === data.status) || statusOptions[0];

  return (
    <div className="lg:ml-64 mt-40 min-h-[calc(100vh-5rem)] bg-slate-50 font-sans p-6 ">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all text-slate-500 hover:text-slate-700 shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Ticket #{data._id.slice(-6).toUpperCase()}
              </p>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Help Desk Ticket</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setStatusOpen((p) => !p)}
                disabled={actionLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all ${currentStatus.bg} ${currentStatus.color} border-current/20 shadow-sm`}
              >
                {actionLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
                )}
                {currentStatus.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${statusOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {statusOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden py-1">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleUpdateStatus(opt.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all hover:bg-slate-50 ${data.status === opt.value ? opt.color : 'text-slate-500'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                      {opt.label}
                      {data.status === opt.value && <CheckCircle2 size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-white hover:bg-red-50 rounded-xl transition-all font-bold text-xs border-2 border-red-100 shadow-sm"
            >
              {actionLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Delete
            </button>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <User size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">
                Reported By
              </p>
              <p className="text-sm font-bold text-slate-800">
                {data.helperName || 'Not Provided'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">
                Contact Number
              </p>
              <p className="text-sm font-bold text-slate-800">
                {data.helperContactNumber || 'Not Provided'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
              {getCategoryIcon(data.category)}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">
                Category
              </p>
              <p className="text-sm font-bold text-slate-800 capitalize">
                {data.category || 'Not Specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Date and Time Info */}
        <div className="flex items-center gap-6 px-2 text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-xs font-semibold">
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-slate-400" />
            <span className="text-xs font-semibold">
              {new Date(data.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Issue Details Box */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-black text-slate-900 mb-6">{data.subject}</h2>
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
