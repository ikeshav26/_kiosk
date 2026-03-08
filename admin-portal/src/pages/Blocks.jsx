import React, { useState, useEffect, useContext, useRef } from 'react';
import axiosInstance from '../utils/Instance';
import {
  Building2,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Mail,
  Phone,
  Layers,
  Upload,
  X,
  Accessibility,
  ArrowUpCircle,
  Fingerprint,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authContext } from '../context/AuthContext';
import { Card, FormInput, Button, SearchInput } from '../components/ui';

const BUILDING_TYPES = [
  'block',
  'library',
  'canteen',
  'hostel',
  'admin',
  'lab',
  'auditorium',
  'medical',
  'other',
];

const TYPE_COLORS = {
  block: 'bg-blue-50 text-blue-700 border-blue-200',
  library: 'bg-amber-50 text-amber-700 border-amber-200',
  canteen: 'bg-orange-50 text-orange-700 border-orange-200',
  hostel: 'bg-purple-50 text-purple-700 border-purple-200',
  admin: 'bg-slate-100 text-slate-700 border-slate-300',
  lab: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  auditorium: 'bg-pink-50 text-pink-700 border-pink-200',
  medical: 'bg-red-50 text-red-700 border-red-200',
  other: 'bg-slate-50 text-slate-600 border-slate-200',
};

const initialFormState = {
  name: '',
  code: '',
  type: 'block',
  description: '',
  coordinates: { lat: '', lng: '' },
  totalFloors: 2,
  isAccessible: true,
  hasLift: false,
  departments: '',
  openTime: '09:00',
  closeTime: '16:00',
  isOpenWeekends: false,
  contactNumber: '',
  contactEmail: '',
  imageUrl: [],
};

const Blocks = () => {
  const { user } = useContext(authContext);
  const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin';
  const fileInputRef = useRef(null);

  const [buildings, setBuildings] = useState([]);
  const [stats, setStats] = useState({ total: 0, block: 0, library: 0, lab: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState(initialFormState);

  // --- Fetch ---
  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/building/all', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          type: typeFilter,
        },
      });
      setBuildings(res.data.buildings || []);
      setStats(res.data.stats || { total: 0, block: 0, library: 0, lab: 0 });
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.total || 0);
    } catch {
      toast.error('Failed to load buildings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [currentPage, searchQuery, typeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter]);

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          if (file.size > 5 * 1024 * 1024) return reject('File exceeds 5MB');
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    try {
      const images = await Promise.all(promises);
      setFormData((prev) => ({ ...prev, imageUrl: [...prev.imageUrl, ...images] }));
    } catch {
      toast.error('Error processing images.');
    }
  };

  const removeImage = (idx) => {
    setFormData((prev) => ({ ...prev, imageUrl: prev.imageUrl.filter((_, i) => i !== idx) }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setActionLoading(true);
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        departments: formData.departments
          ? formData.departments.split(',').map((d) => d.trim())
          : [],
      };
      await axiosInstance.post('/api/building/add', payload);
      toast.success('Building added successfully!');
      setFormData(initialFormState);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchBuildings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add building.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this building?')) return;
    setActionLoading(true);
    try {
      await axiosInstance.delete(`/api/building/delete/${id}`);
      setBuildings((prev) => prev.filter((b) => b._id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      setTotalCount((prev) => prev - 1);
      toast.success('Building removed.');
    } catch {
      toast.error('Failed to delete building.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} building(s)?`)) return;
    setActionLoading(true);
    try {
      await axiosInstance.post('/api/building/bulk-delete', { ids: selectedIds });
      toast.success(`${selectedIds.length} buildings deleted!`);
      setBuildings((prev) => prev.filter((b) => !selectedIds.includes(b._id)));
      setTotalCount((prev) => prev - selectedIds.length);
      setSelectedIds([]);
    } catch (err) {
      toast.error('Failed to delete some buildings.');
    } finally {
      setActionLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="lg:ml-64 mt-20 min-h-[calc(100vh-5rem)] p-4 sm:p-8">
      {/* Stats Row */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-slate-100">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
              Total
            </p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
        </div>
        {['block', 'library', 'lab'].map((t) => (
          <div
            key={t}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center border border-slate-100 ${t === 'block' ? 'bg-purple-50 text-purple-600' : t === 'library' ? 'bg-amber-50 text-amber-600' : 'bg-cyan-50 text-cyan-600'}`}
            >
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 capitalize">
                {t}s
              </p>
              <p className="text-2xl font-bold text-slate-900">{stats[t] || 0}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Content — Two Panel Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Add Building Form */}
        {isAdmin && (
          <Card
            headerIcon={Plus}
            headerTitle="Add Building"
            headerSubtitle="Register new infrastructure"
            className="h-fit"
          >
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <FormInput
                label="Building Name"
                name="name"
                icon={Building2}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Science Block"
                size="small"
              />
              <FormInput
                label="Building Code"
                name="code"
                icon={Fingerprint}
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g. SC-BLK"
                size="small"
              />

              {/* Type Select */}
              <div className="relative group">
                <label className="absolute -top-2.5 left-2 text-[10px] bg-white px-1 font-medium text-slate-500 z-10">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 bg-white py-2 pl-3 pr-3 text-sm rounded-md font-medium text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-sm capitalize"
                >
                  {BUILDING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="relative group">
                <label className="absolute -top-2.5 left-2 text-[10px] bg-white px-1 font-medium text-slate-500 z-10">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-slate-200 bg-white py-2 pl-3 pr-3 text-sm rounded-md font-medium text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-sm resize-none"
                  placeholder="Brief description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Latitude"
                  name="coordinates.lat"
                  type="number"
                  value={formData.coordinates.lat}
                  onChange={handleInputChange}
                  placeholder="30.25"
                  size="small"
                />
                <FormInput
                  label="Longitude"
                  name="coordinates.lng"
                  type="number"
                  value={formData.coordinates.lng}
                  onChange={handleInputChange}
                  placeholder="74.84"
                  size="small"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Floors"
                  name="totalFloors"
                  type="number"
                  value={formData.totalFloors}
                  onChange={handleInputChange}
                  size="small"
                />
                <FormInput
                  label="Departments"
                  name="departments"
                  value={formData.departments}
                  onChange={handleInputChange}
                  placeholder="CSE, ECE"
                  size="small"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Open Time"
                  name="openTime"
                  type="time"
                  value={formData.openTime}
                  onChange={handleInputChange}
                  size="small"
                />
                <FormInput
                  label="Close Time"
                  name="closeTime"
                  type="time"
                  value={formData.closeTime}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>

              <FormInput
                label="Contact Email"
                name="contactEmail"
                type="email"
                icon={Mail}
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="admin@campus.edu"
                size="small"
              />
              <FormInput
                label="Contact Number"
                name="contactNumber"
                icon={Phone}
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="9123456780"
                size="small"
              />

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                {[
                  { name: 'isAccessible', label: 'Accessible' },
                  { name: 'hasLift', label: 'Has Lift' },
                  { name: 'isOpenWeekends', label: 'Weekends' },
                ].map(({ name, label }) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 cursor-pointer text-sm text-slate-600"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name]}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    {label}
                  </label>
                ))}
              </div>

              {/* Images */}
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  Images
                </p>
                <div className="flex flex-wrap gap-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-700"
                  >
                    <Upload size={16} />
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  {formData.imageUrl.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" loading={actionLoading} icon={Plus} fullWidth>
                Add Building
              </Button>
            </form>
          </Card>
        )}

        {/* Right: Buildings List */}
        <Card
          className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'} flex flex-col h-full`}
          headerIcon={Building2}
          headerTitle="Buildings Directory"
          headerSubtitle={`${totalCount} records`}
          headerAction={
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isAdmin && selectedIds.length > 0 && (
                <Button
                  onClick={handleBulkDelete}
                  loading={actionLoading}
                  icon={Trash2}
                  size="small"
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 border-0"
                >
                  Delete ({selectedIds.length})
                </Button>
              )}
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search buildings..."
                className="w-full sm:w-48"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-slate-400 capitalize"
              >
                <option value="all">All</option>
                {BUILDING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          }
        >
          <div className="flex-1">
            {loading ? (
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(itemsPerPage)].map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden min-h-[300px] animate-pulse"
                  >
                    <div className="h-36 bg-slate-200 w-full"></div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <div className="h-5 w-1/2 bg-slate-200 rounded"></div>
                        <div className="h-6 w-6 bg-slate-200 rounded-lg"></div>
                      </div>
                      <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
                      <div className="h-3 w-4/6 bg-slate-200 rounded mb-4"></div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="h-4 w-16 bg-slate-200 rounded"></div>
                        <div className="h-4 w-20 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : buildings.length > 0 ? (
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {buildings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all group relative"
                  >
                    {isAdmin && (
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500 bg-white/80 cursor-pointer"
                          checked={selectedIds.includes(b._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds((prev) => [...prev, b._id]);
                            } else {
                              setSelectedIds((prev) => prev.filter((id) => id !== b._id));
                            }
                          }}
                        />
                      </div>
                    )}
                    {/* Image / Placeholder */}
                    <div className="h-36 bg-slate-100 relative overflow-hidden">
                      {b.imageUrl?.length > 0 ? (
                        <img
                          src={b.imageUrl[0]}
                          alt={b.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Building2 size={40} strokeWidth={1} />
                        </div>
                      )}
                      <span
                        className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${TYPE_COLORS[b.type] || TYPE_COLORS.other}`}
                      >
                        {b.type}
                      </span>
                      {b.code && (
                        <span className="absolute bottom-3 left-3 bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide shadow">
                          {b.code}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                          {b.name}
                        </h3>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {b.description || 'No description available.'}
                      </p>

                      {/* Quick Info Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Layers size={12} className="text-slate-400" />
                          <span className="text-[10px] font-medium">
                            {b.totalFloors || 0} Floors
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock size={12} className="text-slate-400" />
                          <span className="text-[10px] font-medium">
                            {b.openTime || '09:00'} - {b.closeTime || '16:00'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Accessibility
                            size={12}
                            className={b.isAccessible ? 'text-emerald-500' : 'text-slate-300'}
                          />
                          <span className="text-[10px] font-medium text-slate-500">Accessible</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ArrowUpCircle
                            size={12}
                            className={b.hasLift ? 'text-blue-500' : 'text-slate-300'}
                          />
                          <span className="text-[10px] font-medium text-slate-500">Elevator</span>
                        </div>
                      </div>

                      {/* Departments */}
                      {b.departments?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {b.departments.map((dept, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase rounded border border-slate-200"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin size={11} className="text-red-400" />
                          <span className="text-[10px] font-medium">
                            {b.coordinates?.lat?.toFixed(4) || '—'},{' '}
                            {b.coordinates?.lng?.toFixed(4) || '—'}
                          </span>
                        </div>
                        {b.contactEmail && (
                          <div className="flex items-center gap-1">
                            <Mail size={11} />
                            <span className="text-[10px] font-medium truncate max-w-[100px]">
                              {b.contactEmail}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Building2 size={40} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-400">
                  {searchQuery || typeFilter !== 'all'
                    ? 'No buildings match your filters'
                    : 'No buildings registered yet'}
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-auto flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-[20px]">
              <p className="text-xs text-slate-500 font-medium">
                Showing{' '}
                <span className="font-bold text-slate-700">
                  {totalCount === 0 ? 0 : indexOfFirstItem + 1}
                </span>{' '}
                to{' '}
                <span className="font-bold text-slate-700">
                  {Math.min(indexOfLastItem, totalCount)}
                </span>{' '}
                of <span className="font-bold text-slate-700">{totalCount}</span> buildings
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-all ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Blocks;
