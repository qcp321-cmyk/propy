
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'aman2025#') {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('ACCESS_DENIED: Invalid Credentials');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative bg-black border border-slate-800 p-8 rounded-[2rem] w-full max-w-sm shadow-[0_0_50px_rgba(124,58,237,0.15)]"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                <X size={20} />
            </button>
            
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-violet-500 mb-4 shadow-inner shadow-black">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Core Access</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1">SECURE_GATEWAY_V4</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-500 transition-colors">
                        <KeyRound size={16} />
                    </div>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Identity"
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-violet-500 focus:outline-none transition-all placeholder:text-slate-700 font-mono"
                    />
                </div>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-violet-500 transition-colors">
                        <Lock size={16} />
                    </div>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Passkey"
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-violet-500 focus:outline-none transition-all placeholder:text-slate-700 font-mono"
                    />
                </div>

                {error && (
                    <div className="text-[10px] text-red-500 font-mono text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    className="w-full py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-violet-400 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                    Authenticate <ArrowRight size={14} />
                </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginModal;
