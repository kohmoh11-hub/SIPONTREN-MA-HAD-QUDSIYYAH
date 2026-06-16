import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, Filter, Plus, Calendar, Clock, Phone, MapPin, 
  Trash2, Edit, CheckCircle, XCircle, Printer, X, Sparkles, RefreshCcw
} from 'lucide-react';
import { User, Izin, Role } from '../types';
import InstitutionHeader from './InstitutionHeader';

interface IzinViewProps {
  currentUser: User;
  izinList: Izin[];
  onAddIzin: (izin: Omit<Izin, 'id' | 'status' | 'tanggal'>) => Promise<any>;
  onUpdateIzin: (id: string, updates: Partial<Izin>) => Promise<any>;
  onDeleteIzin: (id: string) => Promise<any>;
}

export default function IzinView({
  currentUser,
  izinList,
  onAddIzin,
  onUpdateIzin,
  onDeleteIzin
}: IzinViewProps) {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState<Izin | null>(null);

  // Form States
  const [nama, setNama] = useState(currentUser.role === Role.Santri ? currentUser.nama : '');
  const [nis, setNis] = useState(currentUser.role === Role.Santri ? '12345' : '');
  const [kelas, setKelas] = useState(currentUser.role === Role.Santri ? 'XI-A' : '');
  const [kamar, setKamar] = useState(currentUser.role === Role.Santri ? 'Kamar Al-Iman 02' : '');
  const [tujuan, setTujuan] = useState('');
  const [alasan, setAlasan] = useState('');
  const [keluar, setKeluar] = useState('08:00');
  const [kembali, setKembali] = useState('17:00');
  const [noHpwali, setNoHpwali] = useState('0812');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter & Search
  const filteredIzin = useMemo(() => {
    let result = izinList;

    // Santri only sees their own permission requests
    if (currentUser.role === Role.Santri) {
      result = result.filter(iz => iz.nama.toLowerCase() === currentUser.nama.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(iz => 
        iz.nama.toLowerCase().includes(q) || 
        iz.nis.includes(q) || 
        iz.kamar.toLowerCase().includes(q) ||
        iz.tujuan.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'Semua') {
      result = result.filter(iz => iz.status === statusFilter);
    }

    return result;
  }, [izinList, currentUser, searchQuery, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nis || !tujuan || !alasan) {
      alert('Mohon lengkapi seluruh kolom isian!');
      return;
    }

    setIsSubmitting(true);
    await onAddIzin({
      nama,
      nis,
      kelas,
      kamar,
      tujuan,
      alasan,
      keluar,
      kembali,
      noHpwali
    });

    // Reset non-fixed fields
    setTujuan('');
    setAlasan('');
    setKeluar('08:00');
    setKembali('17:00');
    setNoHpwali('0812');
    
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: Izin['status']) => {
    await onUpdateIzin(id, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    await onDeleteIzin(id);
  };

  const triggerPrintSim = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">Manajemen Izin Keluar Pondok</h2>
          <p className="text-xs text-slate-400">Pengajuan, persetujuan makhraj (izin keluar komplek), serta tracking jam kembali santri</p>
        </div>
        
        {/* Admin, Pengasuh, Guru, and Sarpras can raise new permission */}
        {currentUser.role !== Role.Santri && (
          <button
            onClick={() => {
              setNama('');
              setNis('');
              setKelas('');
              setKamar('');
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-brand-primary active:bg-brand-secondary text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajukan Surat Izin Keluar
          </button>
        )}
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row gap-3 items-center no-print">
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama santri, NIS, kamar, atau tujuan..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl text-xs font-semibold text-slate-700 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {['Semua', 'Menunggu Persetujuan', 'Disetujui', 'Ditolak', 'Sudah Kembali'].map((stat) => (
            <button
              key={stat}
              onClick={() => setStatusFilter(stat)}
              className={`
                px-3 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer whitespace-nowrap
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

      {/* Grid List of Izin */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-105 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Santri</th>
                <th className="py-4 px-4">Kelas & Kamar</th>
                <th className="py-4 px-4">Keterangan Pengajuan</th>
                <th className="py-4 px-4">Rencana Keluar / Estimasi</th>
                <th className="py-4 px-4">Wali Santri</th>
                <th className="py-4 px-4">Status Izin</th>
                <th className="py-4 px-4 text-center">Aksi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIzin.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    {searchQuery ? 'Hasil pencarian nihil. Coba kata kunci lain.' : 'Belum ada data pengajuan surat izin saat ini.'}
                  </td>
                </tr>
              ) : (
                filteredIzin.map((iz) => (
                  <tr key={iz.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{iz.nama}</div>
                      <div className="text-[10px] text-slate-400 font-mono">NIS: {iz.nis}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-700">{iz.kelas}</div>
                      <div className="text-[10px] text-slate-400">{iz.kamar}</div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-bold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-secondary inline shrink-0" />
                        {iz.tujuan}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 italic pl-4">"{iz.alasan}"</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {iz.tanggal}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {iz.keluar} s.d {iz.kembali}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {iz.noHpwali}
                      </div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide">Wali Terverifikasi</span>
                    </td>
                    <td className="py-4 px-4">
                      {iz.status === 'Menunggu Persetujuan' && (
                        <span className="px-2.5 py-1.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-lg uppercase tracking-wider animate-pulse">
                          Menunggu
                        </span>
                      )}
                      {iz.status === 'Disetujui' && (
                        <span className="px-2.5 py-1.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          Disetujui
                        </span>
                      )}
                      {iz.status === 'Ditolak' && (
                        <span className="px-2.5 py-1.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          Ditolak
                        </span>
                      )}
                      {iz.status === 'Sudah Kembali' && (
                        <span className="px-2.5 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          Kembali
                        </span>
                      )}
                    </td>
                     <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Admin, Pengasuh, Musyrif, and Guru can Approve / Reject */}
                        {[Role.Admin, Role.Pengasuh, Role.Musyrif, Role.Guru].includes(currentUser.role) && iz.status === 'Menunggu Persetujuan' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(iz.id, 'Disetujui')}
                              className="p-1 px-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold border border-green-200 rounded-lg cursor-pointer"
                              title="Setujui Izin"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(iz.id, 'Ditolak')}
                              className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-650 font-bold border border-red-200 rounded-lg cursor-pointer"
                              title="Tolak Izin"
                            >
                              Tolak
                            </button>
                          </>
                        )}

                        {/* Admin, Pengasuh, Musyrif, and Guru can confirm return */}
                        {[Role.Admin, Role.Pengasuh, Role.Musyrif, Role.Guru].includes(currentUser.role) && iz.status === 'Disetujui' && (
                          <button
                            onClick={() => handleUpdateStatus(iz.id, 'Sudah Kembali')}
                            className="p-1 px-2.5 bg-slate-100 hover:bg-slate-205 text-slate-700 font-bold border border-slate-300 rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <RefreshCcw className="w-3 h-3" />
                            Konfirmasi Kembali
                          </button>
                        )}

                        {/* Print Permit clearance */}
                        {iz.status === 'Disetujui' && (
                          <button
                            onClick={() => setShowPrintModal(iz)}
                            className="p-1.5 text-slate-650 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer shadow-sm"
                            title="Cetak Surat Izin"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete option (Admin only) */}
                        {currentUser.role === Role.Admin && (
                          <button
                            onClick={() => handleDelete(iz.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF PRINT GENERATOR LAYOUT / SIMULATED OVERLAY PANEL */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            
            {/* Control Panel inside printer box */}
            <div className="flex items-center justify-between border-b pb-4 mb-6 no-print">
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-brand-secondary" />
                Arsip Surat Izin Keluar Format PDF
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerPrintSim}
                  className="px-4 py-2 bg-brand-primary active:bg-brand-secondary text-white font-semibold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Cetak (Print / Save PDF)
                </button>
                <button
                  onClick={() => setShowPrintModal(null)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Area layout */}
            <div className="border-[3px] border-slate-900 p-6 md:p-10 font-sans tracking-wide leading-relaxed bg-white">
              
              {/* Pesantren KOP (Qudsiyyah Menara Kudus) */}
              <div className="mb-6 -mx-6 md:-mx-10 border-b pb-4">
                <InstitutionHeader variant="light-bg" />
              </div>

              {/* Document Title */}
              <div className="text-center mb-6">
                <h3 className="text-base font-bold underline uppercase tracking-wide text-slate-900">
                  SURAT IZIN KELUAR SANTRI (MAKHRAJ)
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">No. Surat: {showPrintModal.id}/YPI-M/VI/2026</p>
              </div>

              {/* Body Content */}
              <p className="text-xs font-semibold text-slate-800 mb-4 font-mono">
                Diberikan izin keluar komplek pesantren kepada santri yang tertera di bawah ini:
              </p>

              {/* Data Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-300 p-4 rounded-lg bg-slate-50/50 text-xs mb-6 font-mono">
                <div>
                  <span className="text-slate-500 block">Nama Santri:</span>
                  <span className="font-bold text-slate-900">{showPrintModal.nama}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">NIS / Kamar:</span>
                  <span className="font-bold text-slate-900">{showPrintModal.nis} / {showPrintModal.kamar}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Kelas:</span>
                  <span className="font-bold text-slate-900">{showPrintModal.kelas}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">No HP Orang Tua/Wali:</span>
                  <span className="font-bold text-slate-900">{showPrintModal.noHpwali}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-slate-500 block">Lokasi & Tujuan Izin:</span>
                  <span className="font-bold text-slate-900 text-sm">{showPrintModal.tujuan}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-slate-500 block">Keperluan / Keterangan:</span>
                  <span className="text-slate-800 italic font-medium">"{showPrintModal.alasan}"</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jadwal Keberangkatan:</span>
                  <span className="font-bold text-slate-950">{showPrintModal.tanggal} pukul {showPrintModal.keluar}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Batas Waktu Kembali:</span>
                  <span className="font-bold text-amber-700">{showPrintModal.kembali}</span>
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="text-[10px] text-slate-500 leading-relaxed border-t pt-4 font-mono">
                <p className="font-bold">Ketentuan Izin Keluar:</p>
                <ol className="list-decimal pl-4 space-y-0.5 mt-1">
                  <li>Santri wajib berbusana sopan & rapi (baju koko, sarung/celana panjang kain, memakai peci).</li>
                  <li>Santri dilarang keras pergi ke lokasi di luar dari rincian tertulis pada surat izin.</li>
                  <li>Santri wajib melapor kembali pada petugas kepengasuhan setibanya di dalam komplek.</li>
                  <li>Keterlambatan jam kembali tanpa udzur syar'i akan dikenakan takzir (sanksi) disiplin.</li>
                </ol>
              </div>

              {/* Signatures section */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs font-mono">
                <div className="flex flex-col justify-between h-24">
                  <span>Petugas Menyetujui,</span>
                  <div className="italic font-bold text-emerald-800 underline">Ustadz Luqman Hakim</div>
                  <span className="text-[10px] text-slate-400">Kepengasuhan Santri</span>
                </div>
                
                {/* QR Code Simulation */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-2 border-slate-900 p-1 bg-white mb-1 shadow-sm">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                      <rect x="0" y="0" width="20" height="20" fill="currentColor" />
                      <rect x="80" y="0" width="20" height="20" fill="currentColor" />
                      <rect x="0" y="80" width="20" height="20" fill="currentColor" />
                      <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                      <line x1="30" y1="10" x2="70" y2="10" stroke="currentColor" strokeWidth="4" />
                      <line x1="10" y1="30" x2="10" y2="70" stroke="currentColor" strokeWidth="4" />
                      <line x1="50" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="4" />
                      <line x1="90" y1="30" x2="90" y2="60" stroke="currentColor" strokeWidth="4" />
                    </svg>
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono tracking-tight font-bold">TER-VERIFIKASI SISTEM</span>
                </div>

                <div className="flex flex-col justify-between h-24">
                  <span>Wali Santri,</span>
                  <div className="italic font-bold text-slate-800 font-medium border-b border-dashed border-slate-405 pb-1 max-w-[150px] mx-auto w-full">
                    ( Tanda Tangan Wali )
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{showPrintModal.nama}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ADD DIALOG MODAL / FORM */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-display font-bold text-base text-slate-800 flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-brand-secondary" />
                Formulir Surat Izin Santri Baru
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap Santri</label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama santri..."
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">NIS (Nomor Induk Santri)</label>
                    <input
                      type="text"
                      required
                      value={nis}
                      onChange={(e) => setNis(e.target.value)}
                      placeholder="123456"
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kelas Tingkatan</label>
                  <input
                    type="text"
                    required
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Contoh: XI-A atau XII-B"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl"
                    disabled={currentUser.role === Role.Santri}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kamar Pemukiman</label>
                  <input
                    type="text"
                    required
                    value={kamar}
                    onChange={(e) => setKamar(e.target.value)}
                    placeholder="Kamar Al-Iman 02"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl"
                    disabled={currentUser.role === Role.Santri}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Tujuan / Lokasi Bepergian</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-455 pointer-events-none">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={tujuan}
                    onChange={(e) => setTujuan(e.target.value)}
                    placeholder="Membeli kitab tafsir di toko buku kota / Berobat"
                    className="w-full pl-9 text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Deskripsi Ringkas & Alasan Izin</label>
                <textarea
                  required
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Terangkan secara jelas alasan kepergian Anda agar disetujui ustadz..."
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Jam Keluar</label>
                  <input
                    type="text"
                    required
                    value={keluar}
                    onChange={(e) => setKeluar(e.target.value)}
                    placeholder="08:00"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Estimasi Kembali</label>
                  <input
                    type="text"
                    required
                    value={kembali}
                    onChange={(e) => setKembali(e.target.value)}
                    placeholder="17:00 / 18:00 (Besok)"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">No HP Wali Santri</label>
                  <input
                    type="text"
                    required
                    value={noHpwali}
                    onChange={(e) => setNoHpwali(e.target.value)}
                    placeholder="081234567890"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-secondary rounded-xl font-mono text-center"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500 border border-slate-200 font-semibold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-brand-primary active:bg-brand-secondary text-white font-semibold text-xs rounded-xl cursor-pointer hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? 'Mengirim Data...' : 'Kirim Pengajuan Izin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
