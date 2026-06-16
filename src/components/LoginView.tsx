import React, { useState } from 'react';
import { LogIn, Key, User as UserIcon, AlertCircle, Sparkles } from 'lucide-react';
import { User, Role } from '../types';
import { getLocalStorageData } from '../data';
import { QudsiyyahCrest } from './InstitutionHeader';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi!');
      return;
    }

    const users = getLocalStorageData<User>('pesantren_users', []);
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim()
    );

    if (!foundUser) {
      setError('Username tidak ditemukan!');
      return;
    }

    if (foundUser.password !== password) {
      setError('Password yang Anda masukkan salah!');
      return;
    }

    if (foundUser.status === 'Nonaktif') {
      setError('Akun Anda dinonaktifkan oleh administrator!');
      return;
    }

    onLoginSuccess(foundUser);
  };

  const handleQuickLogin = (user: { u: string; p: string }) => {
    setUsername(user.u);
    setPassword(user.p);
    
    // Auto submit
    const users = getLocalStorageData<User>('pesantren_users', []);
    const found = users.find(u => u.username === user.u);
    if (found) {
      onLoginSuccess(found);
    }
  };

  const accounts = [
    { label: 'Admin (K.H. Dahlan)', role: 'Admin', u: 'admin', p: 'admin123', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { label: 'Pengasuh (Ustadz Luqman)', role: 'Pengasuh', u: 'pengasuh', p: 'pengasuh123', bg: 'bg-teal-50 text-teal-800 border-teal-300' },
    { label: 'Musyrif (Ustadz Mansur)', role: 'Musyrif', u: 'musyrif', p: 'musyrif123', bg: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
    { label: 'Guru (Ustadzah Aminah)', role: 'Guru', u: 'guru', p: 'guru123', bg: 'bg-rose-50 text-rose-800 border-rose-300' },
    { label: 'Sarpras (Pak Joko)', role: 'Sarpras', u: 'sarpras', p: 'sarpras123', bg: 'bg-amber-50 text-amber-800 border-amber-300' },
    { label: 'Santri (Yusuf)', role: 'Santri', u: 'santri', p: 'santri123', bg: 'bg-sky-50 text-sky-800 border-sky-300' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-slate-50 to-slate-200 p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        
        {/* Left Side: Brand Visual */}
        <div className="md:col-span-5 bg-gradient-to-br from-brand-primary via-brand-secondary to-emerald-950 p-8 flex flex-col justify-between text-white relative">
          <div className="absolute inset-0 opacity-15 overflow-hidden">
            <svg className="w-full h-full text-white" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,100 M100,0 L0,100" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" fill="none" strokeWidth="1" />
              <polygon points="50,20 80,50 50,80 20,50" stroke="currentColor" fill="none" strokeWidth="1" />
            </svg>
          </div>
          
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="bg-white p-1.5 rounded-xl shadow-lg shrink-0 flex items-center justify-center">
              <QudsiyyahCrest className="w-10 h-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-amber-300 text-sm tracking-wider leading-none uppercase">MA'HAD QUDSIYYAH</span>
              <span className="text-[9px] text-emerald-250 font-bold uppercase tracking-wider mt-0.5">YPI QUDSIYYAH MENARA KUDUS</span>
            </div>
          </div>

          <div className="relative z-10 my-auto py-12">
            <h1 className="font-display font-black text-3.5xl leading-tight text-amber-300 uppercase tracking-tight">
              SISTEM TERPADU
              <br />
              MA'HAD QUDSIYYAH
            </h1>
            <p className="text-emerald-50 text-sm mt-3 leading-relaxed font-medium">
              Akses cepat dan terintegrasi untuk Jurnal Pembelajaran Guru, Kepengasuhan Perizinan Santri, dan Pemantauan Sarana Prasarana (SARPRAS) terhubung langsung ke Google Sheets.
            </p>
          </div>

          <div className="relative z-10 text-[10px] text-emerald-200 font-mono font-medium">
            &copy; 2026 SIPONTREN &bull; MA'HAD QUDSIYYAH KUDUS
          </div>
        </div>

        {/* Right Side: Form and Quick Switcher */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Selamat Datang</h2>
              <p className="text-slate-500 text-sm mt-1">Silakan masuk dengan akun pesantren Anda untuk mengelola sistem.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username Anda..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-secondary focus:bg-white focus:outline-none rounded-xl text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-secondary focus:bg-white focus:outline-none rounded-xl text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary active:bg-brand-secondary text-white font-semibold py-3.5 px-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Masuk ke Dasbor
              </button>
            </form>

            {/* Quick Demo Access Switcher */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Simulasi Login Cepat (Satu-Klik)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {accounts.map((acc) => (
                  <button
                    key={acc.u}
                    onClick={() => handleQuickLogin(acc)}
                    className={`p-2.5 text-left border rounded-xl hover:shadow-sm hover:scale-[1.02] cursor-pointer transition-all text-xs font-medium flex flex-col justify-between ${acc.bg}`}
                    title={`Masuk sebagai ${acc.role}`}
                  >
                    <span className="font-bold truncate">{acc.label}</span>
                    <span className="text-[10px] opacity-75 mt-0.5">Sandi: {acc.p}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
