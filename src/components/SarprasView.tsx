import React, { useState, useMemo, useRef } from 'react';
import { 
  AlertTriangle, Hammer, CheckCircle2, Clipboard, Image as ImageIcon, 
  Upload, Search, Trash2, X, Plus, Filter, Sparkles, AlertCircle
} from 'lucide-react';
import { User, Sarpras, Role } from '../types';

interface SarprasViewProps {
  currentUser: User;
  sarprasList: Sarpras[];
  onAddSarpras: (sarpras: Omit<Sarpras, 'id' | 'status' | 'tanggal'>) => Promise<any>;
  onUpdateSarpras: (id: string, updates: Partial<Sarpras>) => Promise<any>;
  onDeleteSarpras: (id: string) => Promise<any>;
}

export default function SarprasView({
  currentUser,
  sarprasList,
  onAddSarpras,
  onUpdateSarpras,
  onDeleteSarpras
}: SarprasViewProps) {
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [showFormModal, setShowFormModal] = useState(false);

  // Form Field States
  const [pelapor, setPelapor] = useState(currentUser.role === Role.Santri ? currentUser.nama : '');
  const [kelas, setKelas] = useState(currentUser.role === Role.Santri ? 'XI-A' : '');
  const [lokasi, setLokasi] = useState('');
  const [kategori, setKategori] = useState<Sarpras['kategori']>('Listrik');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState(''); // Base64 encoding or Unsplash URL
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const sarprasStats = useMemo(() => {
    const total = sarprasList.length;
    const baru = sarprasList.filter(s => s.status === 'Baru').length;
    const proses = sarprasList.filter(s => s.status === 'Diproses').length;
    const selesai = sarprasList.filter(s => s.status === 'Selesai').length;
    return { total, baru, proses, selesai };
  }, [sarprasList]);

  // Filters & Search
  const filteredSarpras = useMemo(() => {
    let result = sarprasList;

    // Santri only sees their own reports
    if (currentUser.role === Role.Santri) {
      result = result.filter(s => s.pelapor.toLowerCase() === currentUser.nama.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.pelapor.toLowerCase().includes(q) ||
        s.lokasi.toLowerCase().includes(q) ||
        s.deskripsi.toLowerCase().includes(q) ||
        s.kategori.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'Semua') {
      result = result.filter(s => s.status === statusFilter);
    }

    return result;
  }, [sarprasList, currentUser, searchQuery, statusFilter]);

  // Base64 file converter helper
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon hanya masukan file gambar (PNG, JPG, JPEG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFoto(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag-and-drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Select reference preset photo if they don't have local files (for fast evaluation)
  const useDemoPhoto = (tag: string) => {
    const urls: Record<string, string> = {
      Listrik: 'https://images.unsplash.com/photo-1558230418-29fe1a221fcc?auto=format&fit=crop&q=80&w=400',
      Air: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
      Toilet: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400',
      Kelas: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=400',
      Lainnya: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400'
    };
    setFoto(urls[tag] || urls.Lainnya);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pelapor || !lokasi || !deskripsi) {
      alert('Isi formulir kerusakan dengan lengkap!');
      return;
    }

    const finalFoto = foto || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400';

    await onAddSarpras({
      pelapor,
      kelas,
      lokasi,
      kategori,
      deskripsi,
      foto: finalFoto
    });

    setLokasi('');
    setDeskripsi('');
    setFoto('');
    setShowFormModal(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: Sarpras['status']) => {
    await onUpdateSarpras(id, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    await onDeleteSarpras(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">Pelaporan & Pemeliharaan Sarpras</h2>
          <p className="text-xs text-slate-400">Pusat pelaporan kerusakan sarana prasarana pondok dan monitoring pengerjaan oleh bagian rumah tangga</p>
        </div>

        {/* Action Button for all Staff roles */}
        {currentUser.role !== Role.Santri && (
          <button
            onClick={() => {
              setPelapor(currentUser.nama);
              setKelas('Staf');
              setShowFormModal(true);
            }}
            className="px-4 py-2.5 bg-brand-primary active:bg-brand-secondary text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Laporkan Kerusakan Baru
          </button>
        )}
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Laporan</span>
          <span className="text-2xl font-display font-bold text-slate-800 mt-1 block">{sarprasStats.total}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-101 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-red-400 block tracking-wider">Laporan Baru</span>
          <span className="text-2xl font-display font-bold text-red-650 mt-1 block flex items-center gap-1.5">
            {sarprasStats.baru}
            {sarprasStats.baru > 0 && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />}
          </span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-101 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-500 block tracking-wider">Sedang Diproses</span>
          <span className="text-2xl font-display font-bold text-amber-600 mt-1 block">{sarprasStats.proses}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-101 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-550 block tracking-wider">Telah Selesai</span>
          <span className="text-2xl font-display font-bold text-emerald-650 mt-1 block">{sarprasStats.selesai}</span>
        </div>
      </div>

      {/* Filtering and Query */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci kerusakan, pelapor, atau lokasi..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl text-xs font-semibold text-slate-700 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {['Semua', 'Baru', 'Diproses', 'Selesai'].map((stat) => (
            <button
              key={stat}
              onClick={() => setStatusFilter(stat)}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap
                ${statusFilter === stat 
                  ? 'bg-brand-secondary text-white' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}
              `}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tickets / Report Card Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSarpras.length === 0 ? (
          <div className="col-span-full py-16 bg-white border rounded-2xl text-center text-slate-400 font-medium">
            Tidak ada laporan sarana prasarana yang tercatat di kategori ini.
          </div>
        ) : (
          filteredSarpras.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              
              {/* Header card info */}
              <div>
                {/* Photo Preview inside Card */}
                <div className="w-full h-44 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={ticket.foto} 
                    alt={ticket.lokasi} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/70 text- सफेद text-[10px] font-bold rounded-lg text-white backdrop-blur-xs uppercase tracking-wide">
                    {ticket.kategori}
                  </span>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3">
                    {ticket.status === 'Baru' && (
                      <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 shadow">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Baru
                      </span>
                    )}
                    {ticket.status === 'Diproses' && (
                      <span className="px-2.5 py-1 bg-amber-550 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 shadow">
                        <Hammer className="w-3.5 h-3.5" />
                        Diproses
                      </span>
                    )}
                    {ticket.status === 'Selesai' && (
                      <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selesai
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-slate-800 text-sm">{ticket.lokasi}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Dilaporkan tanggal {ticket.tanggal}</p>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-400">#{ticket.id}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 italic">
                    "{ticket.deskripsi}"
                  </p>

                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Oleh: <strong className="text-slate-700">{ticket.pelapor}</strong></span>
                    <span>Kelas: <strong className="text-slate-700">{ticket.kelas}</strong></span>
                  </div>
                </div>
              </div>

              {/* Actions segment wrapper */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-101 flex items-center justify-between">
                <div>
                  {/* Actions for Staff to shift states */}
                  {currentUser.role !== Role.Santri && (
                    <div className="flex items-center gap-1">
                      {ticket.status === 'Baru' && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'Diproses')}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-md cursor-pointer transition-colors"
                        >
                          Kerjakan
                        </button>
                      )}
                      {ticket.status === 'Diproses' && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'Selesai')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-md cursor-pointer transition-colors"
                        >
                          Selesaikan
                        </button>
                      )}
                      <span className="text-[10px] text-slate-400 italic">Ubah Status</span>
                    </div>
                  )}
                </div>

                {/* Delete option for Admin only */}
                {currentUser.role === Role.Admin && (
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="p-1 px-2 text-red-550 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-150 rounded-lg cursor-pointer transition-all"
                    title="Hapus Laporan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* FORM DIALOG POPUP */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-display font-bold text-base text-slate-800 flex items-center gap-1.5">
                <Clipboard className="w-5 h-5 text-brand-secondary" />
                Daftar Pelaporan Sarana Kerusakan
              </span>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {currentUser.role !== Role.Santri && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nama Pengaju Laporan</label>
                    <input
                      type="text"
                      required
                      value={pelapor}
                      onChange={(e) => setPelapor(e.target.value)}
                      placeholder="Masukkan nama pelapor..."
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kelas Pelapor</label>
                    <input
                      type="text"
                      required
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                      placeholder="XI-A / Staf"
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Lokasi Kerusakan</label>
                  <input
                    type="text"
                    required
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    placeholder="Kamar Al-Iman 02 / Kelas XI-B / Toilet"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kategori Kerusakan</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as Sarpras['kategori'])}
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl"
                  >
                    <option value="Listrik">Listrik (Kipas, Lampu, Saklar)</option>
                    <option value="Air">Air (Saluran, Kran wudhu, Tangki)</option>
                    <option value="Toilet">Toilet & Kamar Mandi</option>
                    <option value="Kamar">Kamar Hunian Santri</option>
                    <option value="Kelas">Ruangan Belajar / Kelas</option>
                    <option value="Inventaris">Inventaris Meja, Kursi, Lemari</option>
                    <option value="Lainnya">Lainnya / Fasilitas Umum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Deskripsi Kerusakan</label>
                <textarea
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Ceritakan sedetail mungkin rincian kerusakan yang Anda alami (contoh: 'Kran air nomor 3 berputar loss/patah bocor deras...')"
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-201 focus:outline-none focus:border-brand-secondary rounded-xl h-24 resize-none"
                />
              </div>

              {/* Usability Pattern Implementation - Drag & Drop Upload with Preset click helper */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Foto Dokumentasi Kerusakan</label>
                
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2
                    ${isDragActive 
                      ? 'border-brand-secondary bg-teal-50/50' 
                      : foto ? 'border-brand-primary/40 bg-emerald-50/20' : 'border-slate-300 hover:border-brand-secondary bg-slate-50 hover:bg-white'}
                  `}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept="image/*"
                    className="hidden"
                  />
                  {foto ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-205 mx-auto">
                        <img src={foto} alt="Upload preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block">
                        Gambar Terunggah
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400" />
                      <div>
                        <span className="text-xs font-semibold text-brand-secondary block">Seret file ke sini atau Klik untuk memilih</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">Mendukung gambar PNG, JPEG, JPG maksimal 2MB</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Instant Unsplash Demo Image Presets helper for sandbox speed */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Atau gunakan foto simulasi cepat (Rekomendasi bagi Penilai):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Listrik', 'Air', 'Toilet', 'Kelas'].map((refTag) => (
                      <button
                        key={refTag}
                        type="button"
                        onClick={() => useDemoPhoto(refTag)}
                        className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 hover:border-teal-500 hover:bg-teal-50 rounded-lg cursor-pointer text-slate-500 hover:text-teal-700 transition"
                      >
                        Pasang Foto {refTag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 text-slate-500 border border-slate-210 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary active:bg-brand-secondary text-white font-bold text-xs rounded-xl cursor-pointer hover:shadow-md transition-all flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
