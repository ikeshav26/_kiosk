import React, { useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/Instance';
import {
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { authContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { user, setuser, navigate } = useContext(authContext);

  React.useEffect(() => {
    if (user) {
      if (user.role === 'superAdmin') navigate('/dashboard');
      else if (user.role === 'admin') navigate('/dashboard');
      else navigate('/dashboard');
    }
  }, [user]);

  const [bgIndex, setBgIndex] = useState(0);
  const images = [
    'https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1920',
    'https://media.istockphoto.com/id/171271182/photo/delhi-university-building-and-corridor.webp?s=2048x2048&w=is&k=20&c=63Su_Hgd1hMJ3kxaQNyXYdqXXThFhFZYENEakkFHgFs=',
  ];

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.password) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      setuser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
      toast.success(`Welcome back, ${response.data.user.role || 'Admin'}!`);
      console.log('Login Success:', response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid User ID or Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden font-sans bg-slate-900">
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-center bg-cover ${
              index === bgIndex ? 'opacity-40' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-[#001f3f] via-transparent to-[#001f3f]/50 z-1" />
      </div>

      <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-blue-500/20 rounded-full blur-[120px] z-2 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-blue-400/10 rounded-full blur-[100px] z-2 pointer-events-none" />

      <div className="w-full max-w-125 bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white relative z-10 overflow-hidden">
        <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 border border-white/20">
              <GraduationCap size={44} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Console</h1>
            <p className="text-blue-200/60 font-bold text-xs uppercase tracking-[0.3em] mt-2">
              Access Portal
            </p>
          </div>
          <ShieldCheck
            size={200}
            className="absolute -bottom-12.5 -right-12.5 text-white/5 rotate-12"
          />
        </div>

        <form onSubmit={handleLogin} className="p-10 lg:p-14 space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              <p className="text-sm font-bold text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                User Identifier
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <User size={22} />
                </div>
                <input
                  type="text"
                  name="userId"
                  autoComplete="username"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="Enter Admin ID"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Security Key
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <Lock size={22} />
                </div>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                Confirm Identity
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </form>
      </div>

      <footer className="absolute bottom-10 text-center pointer-events-none z-10 w-full">
        <p className="text-xs font-black text-white/50 uppercase tracking-[0.5em]">
          Smart Campus Management System
        </p>
      </footer>
    </div>
  );
};

export default Login;
