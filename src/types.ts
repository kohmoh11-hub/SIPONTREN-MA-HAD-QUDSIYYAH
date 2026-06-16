export enum Role {
  Admin = 'Admin',
  Pengasuh = 'Pengasuh',
  Musyrif = 'Musyrif',
  Guru = 'Guru',
  PetugasSarpras = 'Petugas Sarpras',
  Santri = 'Santri'
}

export function normalizeRole(roleStr: string): Role {
  if (!roleStr) return Role.Santri;
  const cleaned = roleStr.toLowerCase().trim();
  if (cleaned === 'admin' || cleaned === 'administrator') return Role.Admin;
  if (cleaned === 'pengasuh' || cleaned === 'kepengasuhan') return Role.Pengasuh;
  if (cleaned === 'musyrif' || cleaned === 'musrif') return Role.Musyrif;
  if (cleaned === 'guru' || cleaned === 'ustadz' || cleaned === 'ustadzah') return Role.Guru;
  if (cleaned === 'petugas sarpras' || cleaned === 'sarpras' || cleaned === 'petugas_sarpras' || cleaned === 'petugassarpras') return Role.PetugasSarpras;
  return Role.Santri;
}

export interface User {
  id: string;
  nama: string;
  username: string;
  password?: string;
  role: Role;
  status: 'Aktif' | 'Nonaktif';
  kelas?: string;
  kamar?: string;
  nis?: string;
}

export interface Izin {
  id: string;
  tanggal: string; // YYYY-MM-DD
  nama: string;
  nis: string;
  kelas: string;
  kamar: string;
  tujuan: string;
  alasan: string;
  keluar: string; // HH:MM
  kembali: string; // HH:MM / Description
  noHpwali: string;
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak' | 'Sudah Kembali';
}

export interface Sarpras {
  id: string;
  tanggal: string; // YYYY-MM-DD
  pelapor: string;
  kelas: string;
  lokasi: string;
  kategori: 'Listrik' | 'Air' | 'Toilet' | 'Kamar' | 'Kelas' | 'Inventaris' | 'Lainnya';
  deskripsi: string;
  foto: string; // URL string
  status: 'Baru' | 'Diproses' | 'Selesai';
}

export interface Pembelajaran {
  id: string;
  tanggal: string; // YYYY-MM-DD
  guru: string;
  mapel: string;
  kelas: string;
  materi: string;
  metode: string;
  kehadiran: string;
  catatan: string;
  dokumentasi: string; // URL string
}
