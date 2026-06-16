import React, { useState } from 'react';
import { LogIn, Key, User as UserIcon, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';
import { User, Role } from '../types';
import { Database, getLocalStorageData } from '../data';
import { QudsiyyahCrest } from './InstitutionHeader';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  // Mode switcher: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Register States
  const [regNama, setRegNama] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>(Role.Santri);
  const [regKelas, setRegKelas] = useState('');
  const [regKamar, setRegKamar] = useState('');
  const [regNis, setRegNis] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regNama.trim() || !regUsername.trim() || !regPassword.trim()) {
      setError('Nama lengkap, username, dan password wajib diisi!');
      return;
    }

    const formattedUsername = regUsername.toLowerCase().trim().replace(/\s+/g, '');

    // Validate username uniqueness
    const users = getLocalStorageData<User>('pesantren_users', []);
    const usernameTaken = users.some(
      (u) => u.username.toLowerCase() === formattedUsername
    );
    if (usernameTaken) {
      setError('Username sudah digunakan oleh santri/ustadz lain!');
      return;
    }

    // Validation for Santri details
    if (regRole === Role.Santri) {
      if (!regKelas.trim()) {
        setError('Kelas wajib diisi untuk pendaftaran santri!');
        return;
      }
      if (!regKamar.trim()) {
        setError('Kamar wajib diisi untuk pendaftaran santri!');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const newUserPayload: Omit<User, 'id'> = {
        nama: regNama.trim(),
        username: formattedUsername,
        password: regPassword,
        role: regRole,
        status: 'Aktif',
        ...(regRole === Role.Santri ? {
          kelas: regKelas.trim(),
          kamar: regKamar.trim(),
          nis: regNis.trim() || undefined
        } : {
          kelas: regRole === Role.Guru ? 'Bagian Akademik/Asatidz' : 'Pimpinan Ma\'had',
          kamar: 'Asrama Pengurus Utama'
        })
      };

      // Create configuration in localstorage first for immediate card config if custom setup
      const registrationNis = regNis.trim() || `NIS-${Math.floor(10000 + Math.random() * 90000)}`;
      const cardConfig = {
        profileData: {
          nama: regNama.trim(),
          role: regRole,
          nomorInduk: regRole === Role.Santri ? registrationNis : `NIP-${Math.floor(100000 + Math.random() * 900000)}`,
          kelas: regRole === Role.Santri ? regKelas.trim() : (regRole === Role.Guru ? 'Rumpun Keilmuan Mulok' : 'Kepengasuhan Utama'),
          kamar: regRole === Role.Santri ? regKamar.trim() : 'Ruang Pimpinan',
          tempatLahir: 'Kudus',
          tanggalLahir: '2100-01-01',
          asalKota: 'Kudus, Jawa Tengah',
          hp: '0812'
        },
        selectedThemeId: 'emerald-gold',
        selectedAvatarId: regNama.toLowerCase().includes('aminah') || regNama.toLowerCase().includes('syarifah') ? 'av-fatimah' : 'av-muhammad',
        photoUrl: ''
      };
      
      localStorage.setItem(`qudsiyyah_card_config_${formattedUsername}`, JSON.stringify(cardConfig));

      // Append user payload through database with support for online spreadsheets
      const createdUser = await Database.addUser({
        ...newUserPayload,
        // Ensure student has designated fields
        kelas: regRole === Role.Santri ? regKelas.trim() : undefined,
        kamar: regRole === Role.Santri ? regKamar.trim() : undefined,
        nis: regRole === Role.Santri ? registrationNis : undefined,
      });

      setRegSuccess(true);
      
      // Auto success login simulation after 1.5s
      setTimeout(() => {
        onLoginSuccess(createdUser);
      }, 1500);

    } catch (err) {
      console.error(err);
      setError('Gagal membuat akun. Koneksi spreadsheet terhambat.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-slate-50 to-slate-200 p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
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
            <p className="text-emerald-50 text-xs mt-3 leading-relaxed font-medium">
              Akses cepat dan terintegrasi untuk Jurnal Pembelajaran Guru, Kepengasuhan Perizinan Santri, dan Pemantauan Sarana Prasarana (SARPRAS) terhubung langsung ke Google Sheets.
            </p>
          </div>

          <div className="relative z-10 text-[10px] text-emerald-200 font-mono font-medium">
            &copy; 2026 SIPONTREN &bull; MA'HAD QUDSIYYAH KUDUS
          </div>
        </div>

        {/* Right Side: Form and Switchable Tabs */}
        <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            
            {/* Swapping Header Tabs */}
            <div className="flex border-b border-slate-100 mb-6">
              <button
                onClick={() => { setActiveTab('login'); setError(''); }}
                className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${activeTab === 'login' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Masuk Akun
              </button>
              <button
                onClick={() => { setActiveTab('register'); setError(''); }}
                className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${activeTab === 'register' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Buat Akun Baru
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {activeTab === 'login' ? 'Selamat Datang' : 'Mulai Pendaftaran Terpadu'}
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                {activeTab === 'login' 
                  ? 'Silakan masuk dengan akun pesantren Anda untuk mengelola sistem.' 
                  : 'Daftarkan nama, buat username, serta lengkapi data kelas & kamar jika Anda Santri.'}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {activeTab === 'login' ? (
              /* LOGIN TAB */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan username Anda..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-secondary focus:bg-white focus:outline-none rounded-xl text-slate-850 text-xs font-semibold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Key className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password Anda..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-secondary focus:bg-white focus:outline-none rounded-xl text-slate-850 text-xs font-semibold transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary active:bg-brand-secondary text-white font-bold py-3 px-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk ke Dasbor
                </button>
              </form>
            ) : (
              /* REGISTER TAB */
              regSuccess ? (
                <div className="py-6 text-center space-y-3.5 animate-fadeIn">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Akun Anda Berhasil Terdaftar!</h3>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                    Data otomatis disinkronasikan dengan <strong>Google Spreadsheet</strong>. Identitas kartu tanda anggota elektronik kini telah aktif. Mengalihkan Anda secara otomatis...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={regNama}
                      onChange={(e) => setRegNama(e.target.value)}
                      placeholder="Masukkan nama lengkap..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-secondary focus:bg-white focus:outline-none rounded-xl text-slate-850 text-xs font-semibold transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Username</label>
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="username"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-secondary focus:bg-white focus:outline-none rounded-xl text-slate-850 text-xs font-semibold font-mono transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sandi / Password</label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="password"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-secondary focus:bg-white focus:outline-none rounded-xl text-slate-850 text-xs font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Peran Pesantren (Role)</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as Role)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-secondary focus:bg-white focus:outline-none rounded-xl text-slate-850 text-xs font-bold cursor-pointer"
                    >
                      <option value={Role.Santri}>Santri (Siswa Ma'had)</option>
                      <option value={Role.Guru}>Guru / Asatidz</option>
                      <option value={Role.Musyrif}>Musyrif Pembimbing</option>
                      <option value={Role.Pengasuh}>Kepengasuhan</option>
                    </select>
                  </div>

                  {regRole === Role.Santri && (
                    <div className="p-3 bg-emerald-50/50 border border-emerald-150/60 rounded-xl space-y-3 animate-fadeIn">
                      <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest block font-mono">
                        Informasi Pembagian Kamar & Kelas (Wajib)
                      </span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 mb-1">Kelas Santri *</label>
                          <input
                            type="text"
                            required
                            value={regKelas}
                            onChange={(e) => setRegKelas(e.target.value)}
                            placeholder="Contoh: XI-A (Aliyah)"
                            className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-secondary focus:outline-none rounded-lg text-slate-850 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 mb-1">Kamar Santri *</label>
                          <input
                            type="text"
                            required
                            value={regKamar}
                            onChange={(e) => setRegKamar(e.target.value)}
                            placeholder="Contoh: Kamar Al-Iman 02"
                            className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-secondary focus:outline-none rounded-lg text-slate-850 text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 mb-1">No Induk Santri / NIS (Bebas)</label>
                        <input
                          type="text"
                          value={regNis}
                          onChange={(e) => setRegNis(e.target.value)}
                          placeholder="Masukkan nomor NIS jika tahu..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-secondary focus:outline-none rounded-lg text-slate-850 text-xs font-semibold font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-800 active:bg-emerald-905 text-white font-bold py-3 px-4 rounded-xl shadow-md cursor-pointer disabled:opacity-50 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    {isSubmitting ? 'Mendaftarkan ke Spreadsheet...' : 'Daftarkan Akun & Singkron ID Card'}
                  </button>
                </form>
              )
            )}


          </div>
        </div>

      </div>
    </div>
  );
}
