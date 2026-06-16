import React, { useMemo } from 'react';
import { 
  Users, PlayCircle, AlertTriangle, BookOpen, Clock, 
  ArrowRight, FileText, CheckCircle2, ShieldAlert, Sparkles,
  CreditCard
} from 'lucide-react';
import { User, Izin, Sarpras, Pembelajaran, Role } from '../types';
import InstitutionHeader from './InstitutionHeader';
import { formatDateTimeDisplay } from './IzinView';

interface DashboardViewProps {
  currentUser: User;
  izinList: Izin[];
  sarprasList: Sarpras[];
  pembelajaranList: Pembelajaran[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardView({
  currentUser,
  izinList,
  sarprasList,
  pembelajaranList,
  setActiveTab
}: DashboardViewProps) {
  
  // Calculate stats
  const stats = useMemo(() => {
    const tanggalHariIni = new Date().toISOString().split('T')[0];
    
    const santriKeluar = izinList.filter(iz => iz.status === 'Disetujui').length;
    const izinMenunggu = izinList.filter(iz => iz.status === 'Menunggu Persetujuan').length;
    const kerusakanAktif = sarprasList.filter(sr => sr.status !== 'Selesai').length;
    const pembelajaranHariIni = pembelajaranList.filter(pb => pb.tanggal === tanggalHariIni).length;

    // Totals for mini sub-stats
    const totalIzinHariIni = izinList.filter(iz => iz.tanggal === tanggalHariIni).length;
    const totalBelumKembali = santriKeluar; // disetujui but not back

    return {
      santriKeluar,
      izinMenunggu,
      kerusakanAktif,
      pembelajaranHariIni,
      totalIzinHariIni,
      totalBelumKembali
    };
  }, [izinList, sarprasList, pembelajaranList]);

  // Aggregate Category Data for SVG Chart
  const sarprasStatsKategori = useMemo(() => {
    const counts: Record<string, number> = {
      Listrik: 0,
      Air: 0,
      Toilet: 0,
      Kamar: 0,
      Kelas: 0,
      Inventaris: 0,
      Lainnya: 0
    };
    sarprasList.forEach(item => {
      if (counts[item.kategori] !== undefined) {
        counts[item.kategori]++;
      } else {
        counts.Lainnya++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sarprasList]);

  // Aggregate Weekly Departure Data (Dummy aggregate dates around the current code date)
  const departureStatsWeekly = useMemo(() => {
    // Collect counts for past 5 days
    const days = ['Kamis', 'Jumat', 'Sabtu', 'Ahad', 'Senin (Hari Ini)'];
    const counts = [2, 5, 8, 3, stats.totalIzinHariIni || 2];
    return days.map((day, i) => ({ day, count: counts[i] }));
  }, [stats.totalIzinHariIni]);

  // Max value helper for scaling charts
  const maxWeeklyCount = Math.max(...departureStatsWeekly.map(d => d.count), 5);
  const maxSarprasCount = Math.max(...sarprasStatsKategori.map(c => c.value), 4);

  return (
    <div className="space-y-6">
      
      {/* Official Qudsiyyah Banner */}
      <InstitutionHeader variant="banner" />
      
      {/* Dynamic Welcome Premium Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
          <svg width="350" height="350" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" fill="none" strokeWidth="2" />
            <polygon points="50,15 85,50 50,85 15,50" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-500 text-emerald-950 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-emerald-950" />
              Sistem Aktif
            </span>
            <span className="text-emerald-200 text-xs font-mono font-medium">Sesi: {currentUser.role}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-amber-300">
            Assalamu'alaikum, {currentUser.nama}!
          </h2>
          <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
            Selamat datang di Portal Sistem Terpadu Pondok Pesantren. Dasbor ini menyajikan rangkuman keizinan santri keluar-masuk pondok, pemantauan aset sarana fisik prasarana, serta pencatatan jurnal kelas harian guru.
          </p>

          {/* Quick Shortcuts depending on role */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => setActiveTab('profile-card')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 font-bold text-emerald-950 text-xs rounded-xl shadow-sm hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5 no-print">
              <CreditCard className="w-4 h-4" />
              Lihat Kartu Anggota Digital
            </button>
            {currentUser.role === Role.Santri && (
              <>
                <button onClick={() => setActiveTab('izin')} className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 font-semibold text-white text-xs rounded-xl shadow-sm hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5 no-print">
                  <FileText className="w-4 h-4 text-amber-300" />
                  Akses Surat Izin Keluar
                </button>
                <button onClick={() => setActiveTab('pembelajaran')} className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 font-semibold text-white text-xs rounded-xl shadow-sm hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5 no-print">
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  Lihat Jurnal & Nilai Belajar
                </button>
              </>
            )}
            {currentUser.role === Role.Pengasuh && (
              <button onClick={() => setActiveTab('izin')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 font-semibold text-emerald-950 text-xs rounded-xl shadow-sm hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5 no-print">
                <FileText className="w-4 h-4" />
                Daftar Persetujuan Izin ({stats.izinMenunggu})
              </button>
            )}
            {currentUser.role === Role.Musyrif && (
              <button onClick={() => setActiveTab('izin')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 font-semibold text-emerald-950 text-xs rounded-xl shadow-sm hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5 no-print">
                <FileText className="w-4 h-4" />
                Otorisasi Persetujuan Izin ({stats.izinMenunggu})
              </button>
            )}
            {currentUser.role === Role.Guru && (
              <button onClick={() => setActiveTab('pembelajaran')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 font-semibold text-emerald-950 text-xs rounded-xl shadow-sm hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5 no-print">
                <BookOpen className="w-4 h-4" />
                Input Jurnal Pembelajaran Baru
              </button>
            )}
            {currentUser.role === Role.PetugasSarpras && (
              <button onClick={() => setActiveTab('sarpras')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 font-semibold text-emerald-950 text-xs rounded-xl shadow-sm hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5 no-print">
                <AlertTriangle className="w-4 h-4 text-emerald-950" />
                Proses Laporan Masuk ({stats.kerusakanAktif})
              </button>
            )}
            {currentUser.role === Role.Admin && (
              <>
                <button onClick={() => setActiveTab('izin')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 font-semibold text-emerald-950 text-xs rounded-xl shadow-sm hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5 no-print">
                  Tinjau Semua Izin Santri
                </button>
                <button onClick={() => setActiveTab('sarpras')} className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 font-semibold text-white text-xs rounded-xl shadow-sm hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5 no-print">
                  Tinjau Laporan Sarpras
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Statistics Cards Display Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Santri Keluar</span>
            <span className="text-3xl font-display font-bold text-slate-800 block leading-none">{stats.santriKeluar}</span>
            <span className="text-[10px] text-green-600 font-medium">Sedang di luar pondok</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-55 text-orange-600 flex items-center justify-center shadow-inner shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Izin Menunggu</span>
            <span className="text-3xl font-display font-bold text-amber-600 block leading-none">{stats.izinMenunggu}</span>
            <span className="text-[10px] text-amber-500 font-medium">Butuh persetujuan</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-55 text-amber-600 flex items-center justify-center shadow-inner shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Kerusakan Aktif</span>
            <span className="text-3xl font-display font-bold text-red-650 block leading-none">{stats.kerusakanAktif}</span>
            <span className="text-[10px] text-red-500 font-medium">Baru & Sedang diproses</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-55 text-red-600 flex items-center justify-center shadow-inner shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Kelas Hari Ini</span>
            <span className="text-3xl font-display font-bold text-emerald-650 block leading-none">{stats.pembelajaranHariIni}</span>
            <span className="text-[10px] text-emerald-600 font-medium">Jurnal terinput hari ini</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-55 text-emerald-600 flex items-center justify-center shadow-inner shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Section - Gorgeous Responsive Handcrafted SVG Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart: Weekly departure timeline */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-slate-800 text-base leading-tight">Tren Frekuensi Izin Keluar</h3>
              <p className="text-xs text-slate-400">Statistik pengajuan izin disetujui 5 hari terakhir</p>
            </div>
            <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-semibold">
              Minggu Ini
            </div>
          </div>

          {/* Simple Custom SVG Line/Bar Chart representing weekly data */}
          <div className="h-48 flex items-end justify-between mt-4 relative pt-10 min-h-[200px]">
            {/* Background horizontal separation lines */}
            <div className="absolute inset-x-0 bottom-4 border-b border-dashed border-slate-100 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-1/2 border-b border-dashed border-slate-100 pointer-events-none" />
            <div className="absolute inset-x-0 top-10 border-b border-dashed border-slate-100 pointer-events-none" />

            {departureStatsWeekly.map((v, idx) => {
              const pct = (v.count / maxWeeklyCount) * 100;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 group z-10">
                  {/* Floating tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bg-slate-800 text-white text-[10px] py-1 px-2.5 rounded-md -translate-y-8 transition-opacity font-semibold z-20 shadow-md">
                    {v.count} Izin
                  </div>
                  <div className="w-10 sm:w-12 bg-gradient-to-t from-brand-secondary to-teal-400 rounded-t-lg transition-all duration-500 ease-out group-hover:brightness-105"
                       style={{ height: `${pct || 10}%`, minHeight: '16px' }} />
                  <div className="h-6 mt-2 text-[10px] font-semibold text-slate-500 truncate max-w-[80px]">
                    {v.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chart: Asset breakdown damages */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-slate-800 text-base leading-tight">Kerusakan Berdasarkan Kategori</h3>
              <p className="text-xs text-slate-400">Pembagian kerusakan aset inventaris pondok</p>
            </div>
          </div>

          {/* Styled Horizontal bars representing kerusakan kategori */}
          <div className="space-y-3">
            {sarprasStatsKategori.map(({ name, value }) => {
              const widthPct = (value / maxSarprasCount) * 100;
              let barColor = 'bg-teal-600';
              if (name === 'Listrik') barColor = 'bg-amber-500';
              else if (name === 'Air') barColor = 'bg-sky-500';
              else if (name === 'Toilet') barColor = 'bg-red-500';
              else if (name === 'Kamar') barColor = 'bg-indigo-500';

              return (
                <div key={name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{name}</span>
                    <span className="text-slate-800 font-mono">{value} Laporan</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                         style={{ width: `${value > 0 ? (widthPct || 10) : 0}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recents Monitoring Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-slate-800 text-base">Santri yang Sedang Keluar Pondok</h3>
            <p className="text-xs text-slate-400">Santri yang telah memegang izin persetujuan kepengasuhan dan belum kembali</p>
          </div>
          <button 
            onClick={() => setActiveTab('izin')} 
            className="text-xs font-bold text-brand-secondary hover:text-brand-primary flex items-center gap-1"
          >
            Semua Izin
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Nama Santri</th>
                <th className="py-3 px-4">NIS / Kamar</th>
                <th className="py-3 px-4">Tujuan Izin</th>
                <th className="py-3 px-4">Tanggal & Jam Keluar</th>
                <th className="py-3 px-4">Estimasi Kembali</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {izinList.filter(iz => iz.status === 'Disetujui').length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    Tidak ada santri yang sedang keluar pondok saat ini.
                  </td>
                </tr>
              ) : (
                izinList.filter(iz => iz.status === 'Disetujui').map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{item.nama}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-700">{item.nis}</div>
                      <div className="text-[10px] text-slate-400">{item.kamar}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-650 max-w-xs truncate">{item.tujuan}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                      <div>{formatDateTimeDisplay(item.keluar, item.tanggal)}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-amber-800 font-semibold">{formatDateTimeDisplay(item.kembali, item.tanggal)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg uppercase">
                        Sedang Keluar
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
