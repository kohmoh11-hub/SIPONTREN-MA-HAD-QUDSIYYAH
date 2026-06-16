import { Role, User, Izin, Sarpras, Pembelajaran, normalizeRole } from './types';

// Seed Initial Data
const INITIAL_USERS: User[] = [
  { id: 'USR001', nama: 'K.H. Ahmad Dahlan', username: 'admin', password: 'admin123', role: Role.Admin, status: 'Aktif' },
  { id: 'USR006', nama: 'Ustadz H. M. Syafi\'i (Admin 2)', username: 'admin2', password: 'admin123', role: Role.Admin, status: 'Aktif' },
  { id: 'USR002', nama: 'Ustadz Luqman Hakim', username: 'pengasuh', password: 'pengasuh123', role: Role.Pengasuh, status: 'Aktif' },
  { id: 'USR007', nama: 'Ustadz Mansur (Musyrif)', username: 'musyrif', password: 'musyrif123', role: Role.Musyrif, status: 'Aktif' },
  { id: 'USR003', nama: 'Ustadzah Aminah Solihah', username: 'guru', password: 'guru123', role: Role.Guru, status: 'Aktif' },
  { id: 'USR004', nama: 'Pak Joko Sarpras', username: 'sarpras', password: 'sarpras123', role: Role.PetugasSarpras, status: 'Aktif' },
  { id: 'USR005', nama: 'Muhammad Yusuf', username: 'santri', password: 'santri123', role: Role.Santri, status: 'Aktif' },
];

const INITIAL_IZIN: Izin[] = [
  {
    id: 'IZ001',
    tanggal: '2026-06-15',
    nama: 'Muhammad Yusuf',
    nis: '12345',
    kelas: 'XI-A',
    kamar: 'Kamar Al-Iman 02',
    tujuan: 'Belanja Kitab',
    alasan: 'Membeli kitab tafsir di pasar induk kota',
    keluar: '08:00',
    kembali: '12:00',
    noHpwali: '081234567890',
    status: 'Sudah Kembali'
  },
  {
    id: 'IZ002',
    tanggal: '2026-06-15',
    nama: 'Abdurrahman Wahid',
    nis: '12346',
    kelas: 'X-B',
    kamar: 'Kamar Al-Ikhlas 04',
    tujuan: 'Menengok Orang Tua',
    alasan: 'Orang tua sedang sakit keras di daerah Cilacap',
    keluar: '09:30',
    kembali: '18:00 (Besok)',
    noHpwali: '081398765432',
    status: 'Disetujui'
  },
  {
    id: 'IZ003',
    tanggal: '2026-06-14',
    nama: 'Ahmad Baihaqi',
    nis: '12347',
    kelas: 'XII-A',
    kamar: 'Kamar Al-Irsyad 12',
    tujuan: 'Pangkas Rambut',
    alasan: 'Rambut sudah melebihi batas telinga, potong di luar gerbang',
    keluar: '14:00',
    kembali: '15:30',
    noHpwali: '085611223344',
    status: 'Sudah Kembali'
  },
  {
    id: 'IZ004',
    tanggal: '2026-06-15',
    nama: 'Ali Zainal Abidin',
    nis: '12348',
    kelas: 'XI-B',
    kamar: 'Kamar Al-Iman 05',
    tujuan: 'Klinik Kesehatan',
    alasan: 'Mengunjungi dokter luar karena demam tinggi 2 hari',
    keluar: '10:00',
    kembali: '12:30',
    noHpwali: '087855667788',
    status: 'Menunggu Persetujuan'
  }
];

const INITIAL_SARPRAS: Sarpras[] = [
  {
    id: 'SR001',
    tanggal: '2026-06-14',
    pelapor: 'Muhammad Yusuf',
    kelas: 'XI-A',
    lokasi: 'Kamar Al-Iman 02',
    kategori: 'Toilet',
    deskripsi: 'Kran air tempat wudhu dalam toilet patah sehingga air bocor terus menerus.',
    foto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    status: 'Selesai'
  },
  {
    id: 'SR002',
    tanggal: '2026-06-15',
    pelapor: 'Abdurrahman Wahid',
    kelas: 'X-B',
    lokasi: 'Ruang Kelas X-B',
    kategori: 'Listrik',
    deskripsi: 'Kipas angin gantung ruang belajar mati total setelah mengeluarkan bau hangus.',
    foto: 'https://images.unsplash.com/photo-1558230418-29fe1a221fcc?auto=format&fit=crop&q=80&w=400',
    status: 'Diproses'
  },
  {
    id: 'SR003',
    tanggal: '2026-06-15',
    pelapor: 'Ahmad Baihaqi',
    kelas: 'XII-A',
    lokasi: 'Teras Masjid Jami\'',
    kategori: 'Lainnya',
    deskripsi: 'Karpet sajadah baris paling depan robek sekitar 30cm tersangkut ujung daun pintu besi.',
    foto: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
    status: 'Baru'
  }
];

const INITIAL_PEMBELAJARAN: Pembelajaran[] = [
  {
    id: 'PB001',
    tanggal: '2026-06-15',
    guru: 'Ustadzah Aminah Solihah',
    mapel: 'Kitab Safinatun Najah',
    kelas: 'XI-A',
    materi: 'Bab Syarat Sah & Rukun Salat Fardhu',
    metode: 'Kajian Kitab Kuning & Praktik Mandiri',
    kehadiran: '28 dari 30 Santri (2 Izin Demam)',
    catatan: 'Santri sangat antusias terutama saat simulasi gerakan sujud sahwi dan rukun salat yang benar.',
    dokumentasi: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'PB002',
    tanggal: '2026-06-15',
    guru: 'Ustadz Luqman Hakim',
    mapel: 'Tafsir Jalalain',
    kelas: 'XII-B',
    materi: 'Pembahasan Surah Al-Baqarah ayat 1-5 tentang Ghaib',
    metode: 'Halaqah Sorogan & Tanya Jawab Interaktif',
    kehadiran: 'Full (32 Santri hadir)',
    catatan: 'Diskusi berjalan lancar mengenai ciri-ciri orang bertaqwa menurut permulaan Al-Baqarah.',
    dokumentasi: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400'
  }
];

// Helper to check localStorage and load
export function getLocalStorageData<T>(key: string, backup: T[]): T[] {
  const value = localStorage.getItem(key);
  if (!value) {
    localStorage.setItem(key, JSON.stringify(backup));
    return backup;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return backup;
  }
}

export function saveLocalStorageData<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Global Core Data Client supporting local DB + optional Google App Script bridge
export class Database {
  private static getApiUrl(): string {
    return localStorage.getItem('pesantren_api_url') || 'https://script.google.com/macros/s/AKfycbzsGpBQ8g5kqCysl-CroUZZbUgdR-P-6xndCJS69HmFyhlLESSXpaZw-5Loah1aUMgx/exec';
  }

  // --- USERS API ---
  static async getUsers(): Promise<User[]> {
    const backup = getLocalStorageData<User>('pesantren_users', INITIAL_USERS);
    const normalizedBackup = backup.map(u => ({
      ...u,
      role: normalizeRole(u.role)
    }));
    const api = this.getApiUrl();
    if (!api) return normalizedBackup;

    try {
      const res = await fetch(`${api}?action=getUsers`);
      const payload = await res.json();
      if (payload && payload.status === 'success' && Array.isArray(payload.data)) {
        const normalized = payload.data.map((u: any) => ({
          ...u,
          role: normalizeRole(u.role)
        }));
        saveLocalStorageData('pesantren_users', normalized);
        return normalized;
      }
    } catch (e) {
      console.warn('GAGAL memuat dari Google Sheet API (Menggunakan Local Storage):', e);
    }
    return normalizedBackup;
  }

  static async addUser(user: Omit<User, 'id'>): Promise<User> {
    const list = getLocalStorageData<User>('pesantren_users', INITIAL_USERS);
    const newId = `USR${String(list.length + 1).padStart(3, '0')}`;
    const newUser: User = { ...user, id: newId };
    
    list.push(newUser);
    saveLocalStorageData('pesantren_users', list);

    const api = this.getApiUrl();
    if (!api) return newUser;

    try {
      await fetch(`${api}?action=addUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
        mode: 'no-cors'
      });
    } catch (e) {
      console.error('Simpan ke API gagal:', e);
    }
    return newUser;
  }

  static async updateUserStatus(id: string, status: User['status']): Promise<boolean> {
    const backupList = getLocalStorageData<User>('pesantren_users', INITIAL_USERS);
    const updatedList = backupList.map(u => u.id === id ? { ...u, status } : u);
    saveLocalStorageData('pesantren_users', updatedList);

    const api = this.getApiUrl();
    if (api) {
      try {
        await fetch(`${api}?action=updateUser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status }),
          mode: 'no-cors'
        });
      } catch (e) {
        console.error('Update status di API gagal:', e);
        return false;
      }
    }
    return true;
  }

  // --- IZIN API ---
  static async getIzin(): Promise<Izin[]> {
    const backup = getLocalStorageData<Izin>('pesantren_izin', INITIAL_IZIN);
    const api = this.getApiUrl();
    if (!api) return backup;

    try {
      const res = await fetch(`${api}?action=getIzin`);
      const payload = await res.json();
      if (payload && payload.status === 'success' && Array.isArray(payload.data)) {
        saveLocalStorageData('pesantren_izin', payload.data);
        return payload.data;
      }
    } catch (e) {
      console.warn('GAGAL memuat izin dari Sheets:', e);
    }
    return backup;
  }

  static async addIzin(izin: Omit<Izin, 'id' | 'status' | 'tanggal'>): Promise<Izin> {
    const list = getLocalStorageData<Izin>('pesantren_izin', INITIAL_IZIN);
    const newId = `IZ${String(list.length + 1).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newIzin: Izin = {
      ...izin,
      id: newId,
      tanggal: dateStr,
      status: 'Menunggu Persetujuan'
    };

    list.unshift(newIzin); // Tambah di paling atas
    saveLocalStorageData('pesantren_izin', list);

    const api = this.getApiUrl();
    if (api) {
      try {
        await fetch(`${api}?action=addIzin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newIzin),
          mode: 'no-cors'
        });
      } catch (e) {
        console.error(e);
      }
    }
    return newIzin;
  }

  static async updateIzin(id: string, updates: Partial<Izin>): Promise<Izin | null> {
    const list = getLocalStorageData<Izin>('pesantren_izin', INITIAL_IZIN);
    const idx = list.findIndex(iz => iz.id === id);
    if (idx === -1) return null;

    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    saveLocalStorageData('pesantren_izin', list);

    const api = this.getApiUrl();
    if (api) {
      try {
        await fetch(`${api}?action=updateIzin`, {
          method: 'POST', // some GAS web apps only support POST/GET properly
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
          mode: 'no-cors'
        });
      } catch (e) {
        console.error(e);
      }
    }
    return updated;
  }

  static async deleteIzin(id: string): Promise<boolean> {
    const list = getLocalStorageData<Izin>('pesantren_izin', INITIAL_IZIN);
    const filtered = list.filter(iz => iz.id !== id);
    if (filtered.length === list.length) return false;

    saveLocalStorageData('pesantren_izin', filtered);

    const api = this.getApiUrl();
    if (api) {
      try {
        await fetch(`${api}?action=deleteIzin&id=${id}`, {
          method: 'POST',
          mode: 'no-cors'
        });
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  }

  // --- SARPRAS API ---
  static async getSarpras(): Promise<Sarpras[]> {
    const backup = getLocalStorageData<Sarpras>('pesantren_sarpras', INITIAL_SARPRAS);
    const api = this.getApiUrl();
    if (!api) return backup;

    try {
      const res = await fetch(`${api}?action=getSarpras`);
      const payload = await res.json();
      if (payload && payload.status === 'success' && Array.isArray(payload.data)) {
        saveLocalStorageData('pesantren_sarpras', payload.data);
        return payload.data;
      }
    } catch (e) {
      console.warn('GAGAL memuat sarpras dari Sheets:', e);
    }
    return backup;
  }

  static async addSarpras(sarpras: Omit<Sarpras, 'id' | 'status' | 'tanggal'>): Promise<Sarpras> {
    const list = getLocalStorageData<Sarpras>('pesantren_sarpras', INITIAL_SARPRAS);
    const newId = `SR${String(list.length + 1).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newSarp: Sarpras = {
      ...sarpras,
      id: newId,
      tanggal: dateStr,
      status: 'Baru'
    };

    list.unshift(newSarp);
    saveLocalStorageData('pesantren_sarpras', list);

    const api = this.getApiUrl();
    if (api) {
      try {
        await fetch(`${api}?action=addSarpras`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSarp),
          mode: 'no-cors'
        });
      } catch (e) {
        console.error(e);
      }
    }
    return newSarp;
  }

  static async updateSarpras(id: string, updates: Partial<Sarpras>): Promise<Sarpras | null> {
    const list = getLocalStorageData<Sarpras>('pesantren_sarpras', INITIAL_SARPRAS);
    const idx = list.findIndex(sr => sr.id === id);
    if (idx === -1) return null;

    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    saveLocalStorageData('pesantren_sarpras', list);

    const api = this.getApiUrl();
    if (api) {
      try {
        await fetch(`${api}?action=updateSarpras`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates }),
          mode: 'no-cors'
        });
      } catch (e) {
        console.error(e);
      }
    }
    return updated;
  }

  static async deleteSarpras(id: string): Promise<boolean> {
    const list = getLocalStorageData<Sarpras>('pesantren_sarpras', INITIAL_SARPRAS);
    const filtered = list.filter(sr => sr.id !== id);
    if (filtered.length === list.length) return false;

    saveLocalStorageData('pesantren_sarpras', filtered);

    const api = this.getApiUrl();
    if (api) {
      try {
        await fetch(`${api}?action=deleteSarpras&id=${id}`, {
          method: 'POST',
          mode: 'no-cors'
        });
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  }

  // --- PEMBELAJARAN API ---
  static async getPembelajaran(): Promise<Pembelajaran[]> {
    const backup = getLocalStorageData<Pembelajaran>('pesantren_pembelajaran', INITIAL_PEMBELAJARAN);
    const api = this.getApiUrl();
    if (!api) return backup;

    try {
      const res = await fetch(`${api}?action=getPembelajaran`);
      const payload = await res.json();
      if (payload && payload.status === 'success' && Array.isArray(payload.data)) {
        saveLocalStorageData('pesantren_pembelajaran', payload.data);
        return payload.data;
      }
    } catch (e) {
      console.warn('GAGAL memuat pembelajaran dari Sheets:', e);
    }
    return backup;
  }

  static async addPembelajaran(pem: Omit<Pembelajaran, 'id' | 'tanggal'>): Promise<Pembelajaran> {
    const list = getLocalStorageData<Pembelajaran>('pesantren_pembelajaran', INITIAL_PEMBELAJARAN);
    const newId = `PB${String(list.length + 1).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newPem: Pembelajaran = {
      ...pem,
      id: newId,
      tanggal: dateStr
    };

    list.unshift(newPem);
    saveLocalStorageData('pesantren_pembelajaran', list);

    const api = this.getApiUrl();
    if (api) {
      try {
        await fetch(`${api}?action=addPembelajaran`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPem),
          mode: 'no-cors'
        });
      } catch (e) {
        console.error(e);
      }
    }
    return newPem;
  }
}
