import React, { useState } from 'react';
import { Users, UserPlus, Shield, Badge, CheckCircle, XCircle, Trash2, Key, ToggleLeft, ToggleRight } from 'lucide-react';
import { User, Role } from '../types';

interface UserViewProps {
  currentUser: User;
  usersList: User[];
  onAddUser: (user: Omit<User, 'id'>) => Promise<any>;
  onUpdateUserStatus: (id: string, status: User['status']) => void;
}

export default function UserView({
  currentUser,
  usersList,
  onAddUser,
  onUpdateUserStatus
}: UserViewProps) {
  
  // Form states
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.Santri);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !username || !password) {
      alert('Mohon isi seluruh data akun!');
      return;
    }

    const existing = usersList.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
    if (existing) {
      alert('Username sudah terdaftar! Gunakan username unik lain.');
      return;
    }

    await onAddUser({
      nama,
      username: username.toLowerCase().trim(),
      password,
      role,
      status: 'Aktif'
    });

    setNama('');
    setUsername('');
    setPassword('');
    setRole(Role.Santri);
    setShowAddForm(false);
  };

  const toggleStatus = (user: User) => {
    if (user.id === currentUser.id) {
      alert('Anda tidak bisa menonaktifkan akun Admin yang sedang Anda gunakan!');
      return;
    }
    const newStatus = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    onUpdateUserStatus(user.id, newStatus);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">Manajemen Pengguna & Hak Akses</h2>
          <p className="text-xs text-slate-450">Pengaturan otorisasi login ustadz, pengamat kepengasuhan, penanggungjawab sarana, dan santri</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-brand-primary active:bg-brand-secondary text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Akun Pengguna
        </button>
      </div>

      {/* Google Sheets - Dynamic Admin & Default Accounts Registration Panel */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="space-y-1">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-500">🛠️ Sinkronisasi Akun Sistem ke Google Sheets</h3>
            <p className="text-xs text-slate-600">
              Registrasikan akun otorisasi bawaan pesantren langsung ke lembar online Google Spreadsheet Anda agar siap digunakan.
            </p>
          </div>
          <button
            onClick={async () => {
              const defaultUsers = [
                { nama: "K.H. Ahmad Dahlan", username: "admin", password: "admin123", role: Role.Admin, status: "Aktif" as const },
                { nama: "Ustadz H. M. Syafi'i (Admin 2)", username: "admin2", password: "admin123", role: Role.Admin, status: "Aktif" as const },
                { nama: "Ustadz Luqman Hakim", username: "pengasuh", password: "pengasuh123", role: Role.Pengasuh, status: "Aktif" as const },
                { nama: "Ustadz Mansur (Musyrif)", username: "musyrif", password: "musyrif123", role: Role.Musyrif, status: "Aktif" as const },
                { nama: "Ustadzah Aminah Solihah", username: "guru", password: "guru123", role: Role.Guru, status: "Aktif" as const },
                { nama: "Pak Joko Sarpras", username: "sarpras", password: "sarpras123", role: Role.PetugasSarpras, status: "Aktif" as const },
                { nama: "Muhammad Yusuf", username: "santri", password: "santri123", role: Role.Santri, status: "Aktif" as const },
              ];

              const missing = defaultUsers.filter(du => !usersList.some(u => u.username.toLowerCase() === du.username.toLowerCase()));
              if (missing.length === 0) {
                alert("Semua akun bawaan sudah sukses terdaftar di Google Sheet Anda!");
                return;
              }

              let count = 0;
              for (const u of missing) {
                try {
                  await onAddUser({
                    nama: u.nama,
                    username: u.username,
                    password: u.password,
                    role: u.role,
                    status: u.status
                  });
                  count++;
                } catch (err) {
                  console.error("Gagal mendaftarkan", u.username, err);
                }
              }
              alert(`Selesai! Berhasil mendaftarkan ${count} akun bawaan ke Google Spreadsheet Anda.`);
            }}
            className="shrink-0 text-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            🚀 Daftarkan Semua Akun Bawaan ke Sheet
          </button>
        </div>

        {/* Roles status boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Admin 1", username: "admin" },
            { label: "Admin 2", username: "admin2" },
            { label: "Pengasuh", username: "pengasuh" },
            { label: "Musyrif", username: "musyrif" },
            { label: "Guru", username: "guru" },
            { label: "Sarpras", username: "sarpras" },
            { label: "Santri", username: "santri" },
          ].map((item) => {
            const isRegistered = usersList.some(u => u.username.toLowerCase() === item.username.toLowerCase());
            return (
              <div
                key={item.username}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isRegistered
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
                    : "bg-amber-50/40 border-amber-200 text-amber-800"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{item.label}</div>
                <div className="font-mono text-xs font-bold font-semibold block truncate bg-white/60 py-0.5 rounded border border-black/5 mb-1.5">{item.username}</div>
                <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold uppercase">
                  {isRegistered ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span className="text-emerald-700">✓ Terdaftar</span>
                    </>
                  ) : (
                    <>
                      <span className="text-amber-600">⚠️ Belum Ada</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insert Account Form Container */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-dashed border-teal-500/50 p-6 space-y-4 shadow-xs animate-fadeIn">
          <h3 className="text-sm font-bold text-brand-primary flex items-center gap-1.5 border-b pb-2">
            <UserPlus className="w-4 h-4" />
            Pembuatan Akun Kredensial Baru
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nama Lengkap Pemegang</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Muhammad Ali, S.Pd"
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-205 focus:outline-none focus:border-brand-secondary rounded-xl"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Username Unik</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: maliputra"
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-205 focus:outline-none focus:border-brand-secondary rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Sandi Sandaran</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Pin / Kata sandi kuat"
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-205 focus:outline-none focus:border-brand-secondary rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Grup Wewenang / Hak Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-205 focus:outline-none focus:border-brand-secondary rounded-xl"
              >
                <option value={Role.Admin}>Admin (Seluruh Modul)</option>
                <option value={Role.Pengasuh}>Pengasuh (Approval Izin)</option>
                <option value={Role.Musyrif}>Musyrif (Otorisasi Izin)</option>
                <option value={Role.Guru}>Guru (Input Pembelajaran)</option>
                <option value={Role.PetugasSarpras}>Petugas Sarpras (Pengerjaan Kerusakan)</option>
                <option value={Role.Santri}>Santri (Pengajuan Umum)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 font-bold rounded-lg cursor-pointer hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-primary active:bg-brand-secondary text-white font-bold rounded-lg cursor-pointer"
            >
              Simpan Akun
            </button>
          </div>
        </form>
      )}

      {/* Accounts display Table List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-102 font-bold uppercase tracking-wider text-slate-505">
                <th className="py-4 px-5">ID Pengguna</th>
                <th className="py-4 px-5">Nama Pustaka</th>
                <th className="py-4 px-5">Kredensial Username</th>
                <th className="py-4 px-5">Peranan Akses</th>
                <th className="py-4 px-5">Status Akun</th>
                <th className="py-4 px-5 text-center">Ubah Daya Hidup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-slate-400 font-bold">{user.id}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-800">{user.nama}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">{user.username}</span>
                      <span className="text-[10px] text-slate-400" title="Password terekam">🔑</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold rounded-md uppercase">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    {user.status === 'Aktif' ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        Aktif
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold flex items-center gap-1 text-[11px]">
                        <XCircle className="w-4 h-4 text-slate-350 shrink-0" />
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => toggleStatus(user)}
                        disabled={user.id === currentUser.id}
                        className={`p-1 flex items-center gap-1 px-3 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                          user.status === 'Aktif'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                        }`}
                        title={user.id === currentUser.id ? 'Sedang Anda gunakan' : 'Ubah status aktifasi'}
                      >
                        {user.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
