import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { VirtualKeyboard } from './VirtualKeyboard';
import { instance } from '../utils/instance';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const keyboardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  useEffect(() => {
    if (!isOpen) {
      setAdminId('');
      setPassword('');
      setLoading(false);
      setActiveInput(null);
    }
  }, [isOpen]);

  const handleVirtualKeyPress = (key: string) => {
    if (!activeInput) return;
    const setter = activeInput === 'Admin ID' ? setAdminId : setPassword;
    const current = activeInput === 'Admin ID' ? adminId : password;

    if (key === 'BKSP') {
      setter(current.slice(0, -1));
    } else if (key === 'SPACE') {
      setter(current + ' ');
    } else {
      setter(current + key);
    }
  };

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await instance.post('/api/auth/login', { userId: adminId, password });

      if (response.data && response.data.user) {
        toast.success(t('adminLogin.accessGranted'));
        onClose();
        navigate('/settings');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('adminLogin.loginFailed'));
    } finally {
      setLoading(false);
      setAdminId('');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-[#001f3f] to-[#003366] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Lock size={24} />
            <h2 className="text-xl font-bold">{t('adminLogin.adminAccess')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('adminLogin.adminId')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={adminId}
                onFocus={() => setActiveInput('Admin ID')}
                readOnly
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-900 cursor-pointer"
                placeholder={t('adminLogin.adminIdPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('adminLogin.password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onFocus={() => setActiveInput('Password')}
                readOnly
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-900 cursor-pointer"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              t('adminLogin.authenticate')
            )}
          </button>
        </form>
      </div>

      {activeInput && (
        <div className="fixed bottom-0 left-0 right-0 z-[110]">
          <VirtualKeyboard
            ref={keyboardRef}
            activeInputName={activeInput}
            onKeyPress={handleVirtualKeyPress}
            onClose={() => setActiveInput(null)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminLoginModal;
