import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  BookOpen, Calendar, Users, FileText, Plus, Search, Filter, 
  Image as ImageIcon, Upload, X, CheckCircle, HelpCircle, Sparkles 
} from 'lucide-react';
import { User, Pembelajaran, Role } from '../types';

interface PembelajaranViewProps {
  currentUser: User;
  pembelajaranList: Pembelajaran[];
  onAddPembelajaran: (pembelajaran: Omit<Pembelajaran, 'id' | 'tanggal'>) => Promise<any>;
}

export default function PembelajaranView({
  currentUser,
  pembelajaranList,
  onAddPembelajaran
}: PembelajaranViewProps) {
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Harian');

  // Form Fields
  const [guru, setGuru] = useState(currentUser.role === Role.Guru ? currentUser.nama : '');
  const [mapel, setMapel] = useState('');
  const [kelas, setKelas] = useState('');
  const [materi, setMateri] = useState('');
  const [metode, setMetode] = useState('Ceramah & Diskusi');
  const [kehadiran, setKehadiran] = useState('Hadir semua (30 siswa)');
  const [catatan, setCatatan] = useState('');
  const [dokumentasi, setDokumentasi] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Load all users from LocalStorage for autocompletion dropdown lookup
  const [allUsers, setAllUsers] = useState<User[]>([]);
  useEffect(() => {
    const usersJson = localStorage.getItem('pesantren_users');
    if (usersJson) {
      try {
        setAllUsers(JSON.parse(usersJson));
      } catch (e) {}
    }
  }, [showAddModal]);

  // Compute unique lists for dropdown selectors
  const listGuru = useMemo(() => {
    const fromList = pembelajaranList.map(p => p.guru);
    const fromUsers = allUsers.filter(u => u.role !== Role.Santri).map(u => u.nama);
    return Array.from(new Set([...fromList, ...fromUsers])).filter(Boolean);
  }, [pembelajaranList, allUsers]);

  const listMapel = useMemo(() => {
    const fromList = pembelajaranList.map(p => p.mapel);
    const defaults = ['Tafsir Jalalain', 'Nahwu Alfiyah', 'Shorof Amtsilah Tashrifiyyah', 'Fathul Qorib (Fiqh)', 'Juz Amma / Tahfidz', 'Hadits Arbain Nawawi', 'Tarikh Islam / SKI', 'Aqidatul Awam'];
    return Array.from(new Set([...fromList, ...defaults])).filter(Boolean);
  }, [pembelajaranList]);

  const listKelasPembelajaran = useMemo(() => {
    const fromList = pembelajaranList.map(p => p.kelas);
    const defaults = ['Kelas X-A', 'Kelas XI-A', 'Kelas XII-A', 'Halaqah Masjid Jami', 'Kamar Al-Iman', 'Selasar Perpustakaan'];
    return Array.from(new Set([...fromList, ...defaults])).filter(Boolean);
  }, [pembelajaranList]);

  const listMateri = useMemo(() => {
    const fromList = pembelajaranList.map(p => p.materi);
    const defaults = ['Bab Syarat Sah Shalat', 'Bab Isim-Isim yang Di-rafa-kan', 'Setoran Hafalan Surat Al-Kahfi', 'Bab Jual Beli / Muamalah'];
    return Array.from(new Set([...fromList, ...defaults])).filter(Boolean);
  }, [pembelajaranList]);

  const listMetode = useMemo(() => {
    const fromList = pembelajaranList.map(p => p.metode);
    const defaults = ['Sorogan / Talaqqi Mandiri', 'Bandongan / Wetonan', 'Ceramah & Diskusi', 'Simaan Hafalan Qur\'an', 'Tanya Jawab & Praktek'];
    return Array.from(new Set([...fromList, ...defaults])).filter(Boolean);
  }, [pembelajaranList]);

  const listKehadiran = useMemo(() => {
    const fromList = pembelajaranList.map(p => p.kehadiran);
    const defaults = ['Hadir semua (30 siswa)', 'Hadir 29, 1 sakit', 'Hadir 28, 2 izin pulang', 'Hadir Semua'];
    return Array.from(new Set([...fromList, ...defaults])).filter(Boolean);
  }, [pembelajaranList]);

  const handleGuruChange = (val: string) => {
    setGuru(val);
    const existing = [...pembelajaranList].reverse().find(p => p.guru.toLowerCase() === val.toLowerCase());
    if (existing) {
      if (existing.mapel) setMapel(existing.mapel);
      if (existing.kelas) setKelas(existing.kelas);
      if (existing.metode) setMetode(existing.metode);
    }
  };

  const handleMapelChange = (val: string) => {
    setMapel(val);
    const existing = [...pembelajaranList].reverse().find(p => p.mapel.toLowerCase() === val.toLowerCase());
    if (existing) {
      if (existing.kelas) setKelas(existing.kelas);
      if (existing.metode) setMetode(existing.metode);
    }
  };

  // Time-frame Statistics Calculations
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const pastSevenDays = new Date();
    pastSevenDays.setDate(pastSevenDays.getDate() - 7);
    const pastMonth = new Date();
    pastMonth.setMonth(pastMonth.getMonth() - 1);

    const harianCount = pembelajaranList.filter(p => p.tanggal === today).length;
    
    const mingguanCount = pembelajaranList.filter(p => {
      const pDate = new Date(p.tanggal);
      return pDate >= pastSevenDays;
    }).length;

    const bulananCount = pembelajaranList.filter(p => {
      const pDate = new Date(p.tanggal);
      return pDate >= pastMonth;
    }).length;

    return { harianCount, mingguanCount, bulananCount };
  }, [pembelajaranList]);

  // Filters Journals by Segment & Search String
  const filteredJournals = useMemo(() => {
    let result = pembelajaranList;

    // Filter by search text
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.guru.toLowerCase().includes(q) ||
        p.mapel.toLowerCase().includes(q) ||
        p.materi.toLowerCase().includes(q) ||
        p.kelas.toLowerCase().includes(q)
      );
    }

    // Filter based on selected time-segment tab
    const today = new Date().toISOString().split('T')[0];
    const pastSevenDays = new Date();
    pastSevenDays.setDate(pastSevenDays.getDate() - 7);
    const pastMonth = new Date();
    pastMonth.setMonth(pastMonth.getMonth() - 1);

    if (activeSegmentFilter === 'Harian') {
      result = result.filter(p => p.tanggal === today);
    } else if (activeSegmentFilter === 'Mingguan') {
      result = result.filter(p => new Date(p.tanggal) >= pastSevenDays);
    } else if (activeSegmentFilter === 'Bulanan') {
      result = result.filter(p => new Date(p.tanggal) >= pastMonth);
    }

    return result;
  }, [pembelajaranList, searchQuery, activeSegmentFilter]);

  // Base64 document parser
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setDokumentasi(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Quick preset photos for Islamic Education classes
  const useDocPreset = (topic: string) => {
    const presets: Record<string, string> = {
      Kajian: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400',
      Halaqah: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400',
      Ujian: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400'
    };
    setDokumentasi(presets[topic] || presets.Kajian);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapel || !kelas || !materi || !catatan) {
      alert('Mohon isi jurnal pembelajaran dengan lengkap!');
      return;
    }

    setIsSubmitting(true);
    const fallbackDoc = dokumentasi || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400';

    await onAddPembelajaran({
      guru,
      mapel,
      kelas,
      materi,
      metode,
      kehadiran,
      catatan,
      dokumentasi: fallbackDoc
    });

    setMapel('');
    setKelas('');
    setMateri('');
    setCatatan('');
    setDokumentasi('');
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* View Header with form button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">Buku Jurnal Pembelajaran Guru</h2>
          <p className="text-xs text-slate-400">Pencatatan materi ajar harian (taqrir), absensi kelas, metode bimbingan, dan evaluasi hasil belajar</p>
        </div>

        {/* Staff roles can enter class journal */}
        {currentUser.role !== Role.Santri && (
          <button
            onClick={() => {
              if (currentUser.role === Role.Guru) {
                setGuru(currentUser.nama);
              } else {
                setGuru('');
              }
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-brand-primary active:bg-brand-secondary text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Input Jurnal Baru
          </button>
        )}
      </div>

      {/* Segment Metrics Card Grid */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setActiveSegmentFilter('Harian')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeSegmentFilter === 'Harian' 
              ? 'border-brand-secondary bg-teal-50/40 shadow-sm' 
              : 'border-slate-100 bg-white hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Hari Ini</span>
          <span className="text-2xl font-display font-bold text-slate-800 mt-1 block">{metrics.harianCount} Jurnal</span>
        </button>

        <button
          onClick={() => setActiveSegmentFilter('Mingguan')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeSegmentFilter === 'Mingguan' 
              ? 'border-brand-secondary bg-teal-50/40 shadow-sm' 
              : 'border-slate-100 bg-white hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-bold">7 Hari Terakhir</span>
          <span className="text-2xl font-display font-bold text-slate-800 mt-1 block">{metrics.mingguanCount} Jurnal</span>
        </button>

        <button
          onClick={() => setActiveSegmentFilter('Bulanan')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeSegmentFilter === 'Bulanan' 
              ? 'border-brand-secondary bg-teal-50/40 shadow-sm' 
              : 'border-slate-100 bg-white hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">30 Hari Terakhir</span>
          <span className="text-2xl font-display font-bold text-slate-800 mt-1 block">{metrics.bulananCount} Jurnal</span>
        </button>
      </div>

      {/* Query Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari berdasarkan Guru, Mapel, atau Materi pada laporan ${activeSegmentFilter}...`}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-205 focus:outline-none focus:border-brand-secondary rounded-xl text-xs font-semibold text-slate-700 transition-all"
          />
        </div>
      </div>

      {/* Log Book Entries Timeline List */}
      <div className="space-y-6">
        {filteredJournals.length === 0 ? (
          <div className="p-16 bg-white border rounded-2xl text-center text-slate-400 font-medium">
            Tidak ada jurnal kelas {activeSegmentFilter.toLowerCase()} yang terekam. Masukkan rincian berkas baru menggunakan tombol di atas!
          </div>
        ) : (
          filteredJournals.map((journal) => (
            <div key={journal.id} className="bg-white rounded-2xl border border-slate-101 shadow-xs overflow-hidden hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12">
              
              {/* Photo Box */}
              <div className="md:col-span-3 bg-slate-55 h-48 md:h-full relative overflow-hidden shrink-0">
                <img 
                  src={journal.dokumentasi} 
                  alt={journal.mapel} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/60 backdrop-blur-xs text-[10px] font-mono text-white rounded-lg">
                  #{journal.id}
                </span>
              </div>

              {/* Text content details */}
              <div className="md:col-span-9 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-brand-secondary uppercase tracking-wider">{journal.mapel}</span>
                      <h3 className="font-display font-bold text-slate-800 text-base">{journal.materi}</h3>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-405 font-semibold font-mono">
                      <Calendar className="w-4 h-4" />
                      {journal.tanggal}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block">Ustadz / Ustadzah</span>
                      <span className="font-semibold text-slate-800">{journal.guru}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">Halaqah / Kelas</span>
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-0.5">{journal.kelas}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">Absensi Santri</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Users className="w-4 h-4 text-brand-secondary shrink-0" />
                        {journal.kehadiran}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-xs font-bold text-slate-415 block">Metode Pembelajaran / Sesi kelas</span>
                    <p className="text-xs text-slate-800 font-medium">{journal.metode}</p>
                  </div>

                  <div className="p-3 bg-emerald-50/15 border border-emerald-100 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-brand-secondary block tracking-wider">Catatan Evaluasi / Hambatan Santri</span>
                    <p className="text-xs text-slate-650 italic">"{journal.catatan}"</p>
                  </div>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

      {/* ADD MODAL FORM PANEL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-display font-bold text-base text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-5 h-5 text-brand-secondary" />
                Catat Jurnal Pembelajaran Baru
              </span>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {currentUser.role !== Role.Santri && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Ustadz / Ustadzah Pengajar</label>
                  <input
                    type="text"
                    required
                    value={guru}
                    onChange={(e) => handleGuruChange(e.target.value)}
                    placeholder="Masukkan nama lengkap guru..."
                    list="list-guru"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                  />
                  <span className="text-[9px] text-slate-400 mt-0.5 block">Pilih nama ustadz dari database</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Mata Pelajaran / Kitab</label>
                  <input
                    type="text"
                    required
                    value={mapel}
                    onChange={(e) => handleMapelChange(e.target.value)}
                    placeholder="Contoh: Tafsir Jalalain / Nahwu"
                    list="list-mapel"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Ruangan Kelas / Halaqah</label>
                  <input
                    type="text"
                    required
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Contoh: XI-A, XII-B, Masjid Jami"
                    list="list-kelas-belajar"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Materi / Sub-bab Pembahasan</label>
                <input
                  type="text"
                  required
                  value={materi}
                  onChange={(e) => setMateri(e.target.value)}
                  placeholder="Contoh: Bab Syarat & Rukun Wudhu yang Sah"
                  list="list-materi"
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Metode Belajar Mengajar</label>
                  <input
                    type="text"
                    required
                    value={metode}
                    onChange={(e) => setMetode(e.target.value)}
                    placeholder="Contoh: Sorogan / Ceramah kualitatif"
                    list="list-metode"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kehadiran Santri (Absensi)</label>
                  <input
                    type="text"
                    required
                    value={kehadiran}
                    onChange={(e) => setKehadiran(e.target.value)}
                    placeholder="Contoh: 30 Hadir, 2 Sakit demam"
                    list="list-kehadiran"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Catatan Hambatan & Hasil Evaluasi Belajar</label>
                <textarea
                  required
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Gambarkan tingkat ketangkasan santri, kendala yang dihadapi, atau PR tugas yang mesti dirampungkan..."
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl h-24 resize-none"
                />
              </div>

              {/* Document attachment block */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Foto Dokumentasi Sesi Pembelajaran</label>
                <div className="flex gap-4 items-center">
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-550 hover:text-brand-primary" />
                    Pilih File Gambar
                  </button>
                  <input
                    type="file"
                    ref={docInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {dokumentasi ? (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md overflow-hidden border border-slate-200 shrink-0">
                        <img src={dokumentasi} alt="Dokumentasi" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md">Terpilih</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">Belum ada dokumentasi terpasang</span>
                  )}
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Pasang cepat dari preset foto edukasi:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {['Kajian', 'Halaqah', 'Ujian'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => useDocPreset(t)}
                        className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 hover:border-brand-secondary hover:bg-teal-50 rounded-lg text-slate-500 hover:text-teal-700 cursor-pointer transition-colors"
                      >
                        Sesi {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Datalists for automatic spreadsheet and historical record match */}
              <datalist id="list-guru">
                {listGuru.map((item, idx) => (
                  <option key={idx} value={item} />
                ))}
              </datalist>

              <datalist id="list-mapel">
                {listMapel.map((item, idx) => (
                  <option key={idx} value={item} />
                ))}
              </datalist>

              <datalist id="list-kelas-belajar">
                {listKelasPembelajaran.map((item, idx) => (
                  <option key={idx} value={item} />
                ))}
              </datalist>

              <datalist id="list-materi">
                {listMateri.map((item, idx) => (
                  <option key={idx} value={item} />
                ))}
              </datalist>

              <datalist id="list-metode">
                {listMetode.map((item, idx) => (
                  <option key={idx} value={item} />
                ))}
              </datalist>

              <datalist id="list-kehadiran">
                {listKehadiran.map((item, idx) => (
                  <option key={idx} value={item} />
                ))}
              </datalist>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500 border border-slate-210 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-brand-primary active:bg-brand-secondary text-white font-bold text-xs rounded-xl cursor-pointer hover:shadow-md transition-all flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? 'Mengirim Data...' : 'Kirim Berkas Jurnal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
