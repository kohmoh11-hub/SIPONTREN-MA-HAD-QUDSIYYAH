import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Printer, Shield, Check, RefreshCw, 
  MapPin, Phone, User as UserIcon, Calendar, BookOpen, 
  Sparkles, RotateCw, CheckCircle, Info, Upload
} from 'lucide-react';
import { User, Role } from '../types';
import { QudsiyyahCrest } from './InstitutionHeader';

interface ProfileCardViewProps {
  currentUser: User;
}

// Pre-defined printable templates/themes
interface CardTheme {
  id: string;
  name: string;
  bgClass: string;
  borderColor: string;
  accentText: string;
  textColor: string;
  badgeBg: string;
  bannerPattern: string;
}

const CARD_THEMES: CardTheme[] = [
  {
    id: 'emerald-gold',
    name: 'Emerald Gold (Official)',
    bgClass: 'from-[#054032] via-[#043226] to-[#022018]',
    borderColor: 'border-amber-400',
    accentText: 'text-amber-400',
    textColor: 'text-emerald-100',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    bannerPattern: 'bg-[#a36a00]/10'
  },
  {
    id: 'royal-velvet',
    name: 'Royal Maroon',
    bgClass: 'from-[#5a0b12] via-[#3a060b] to-[#250306]',
    borderColor: 'border-amber-500',
    accentText: 'text-amber-400',
    textColor: 'text-red-100',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    bannerPattern: 'bg-[#ffc107]/5'
  },
  {
    id: 'midnight-teal',
    name: 'Midnight Navy',
    bgClass: 'from-[#0f2027] via-[#203a43] to-[#2c5364]',
    borderColor: 'border-cyan-400',
    accentText: 'text-cyan-400',
    textColor: 'text-cyan-100',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    bannerPattern: 'bg-cyan-500/10'
  },
  {
    id: 'sufi-minimalist',
    name: 'Warm Olive (Light)',
    bgClass: 'from-amber-50 via-emerald-50 to-emerald-100/40 text-emerald-950',
    borderColor: 'border-emerald-600',
    accentText: 'text-emerald-800',
    textColor: 'text-emerald-900',
    badgeBg: 'bg-emerald-600/15 text-emerald-900 border-emerald-600/20',
    bannerPattern: 'bg-emerald-700/5'
  }
];

// Beautiful built-in avatar options for Muslim Student/Teacher identity
interface CardAvatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  bgColor: string;
  emoji: string;
}

const AVATAR_PRESETS: CardAvatar[] = [
  { id: 'av-muhammad', name: 'Santri Putra (Kopiah)', gender: 'male', bgColor: 'bg-emerald-700', emoji: '👳' },
  { id: 'av-ahmad', name: 'Santri Putra Formal', gender: 'male', bgColor: 'bg-teal-800', emoji: '🧑‍💼' },
  { id: 'av-yusuf', name: 'Santri Putra Santai', gender: 'male', bgColor: 'bg-slate-700', emoji: '🙋‍♂️' },
  { id: 'av-fatimah', name: 'Santri Putri (Hijab Hijau)', gender: 'female', bgColor: 'bg-emerald-800', emoji: '🧕' },
  { id: 'av-aminah', name: 'Santri Putri (Hijab Hitam)', gender: 'female', bgColor: 'bg-[#2D3748]', emoji: '👩‍💼' },
  { id: 'av-aisyah', name: 'Santri Putri (Hijab Cokelat)', gender: 'female', bgColor: 'bg-[#7B341E]', emoji: '👩' },
];

export default function ProfileCardView({ currentUser }: ProfileCardViewProps) {
  // Check role to load defaults
  const isStudent = currentUser.role === Role.Santri;

  // Customized fields State loaded from localStorage if exists
  const [profileData, setProfileData] = useState({
    nama: currentUser.nama,
    role: currentUser.role,
    nomorInduk: isStudent ? '12345/MQA' : 'NIP-QDS-260601',
    kelas: isStudent ? 'XI-A (Aliyah)' : 'Rumpun Keilmuan Mulok',
    kamar: isStudent ? 'Kamar Al-Iman 02' : 'Ruang Guru Utama',
    tempatLahir: 'Kudus',
    tanggalLahir: '2009-10-15',
    asalKota: 'Kudus, Jawa Tengah',
    hp: '+62 812-3456-7890',
  });

  const [selectedThemeId, setSelectedThemeId] = useState<string>('emerald-gold');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('av-muhammad');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Load saved personalization
  useEffect(() => {
    const savedConfig = localStorage.getItem(`qudsiyyah_card_config_${currentUser.username}`);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.profileData) setProfileData(parsed.profileData);
        if (parsed.selectedThemeId) setSelectedThemeId(parsed.selectedThemeId);
        if (parsed.selectedAvatarId) setSelectedAvatarId(parsed.selectedAvatarId);
        if (parsed.photoUrl !== undefined) setPhotoUrl(parsed.photoUrl);
      } catch (e) {
        console.warn('Gagal memuat kustomisasi kartu', e);
      }
    } else {
      // Auto-assign matching female avatar for female names if pre-seeded
      if (currentUser.nama.toLowerCase().includes('aminah') || currentUser.nama.toLowerCase().includes('solihah') || currentUser.nama.toLowerCase().includes('putri')) {
        setSelectedAvatarId('av-fatimah');
      }
    }
  }, [currentUser]);

  const activeTheme = CARD_THEMES.find(t => t.id === selectedThemeId) || CARD_THEMES[0];
  const activeAvatar = AVATAR_PRESETS.find(a => a.id === selectedAvatarId) || AVATAR_PRESETS[0];

  const handleSaveConfig = () => {
    const config = {
      profileData,
      selectedThemeId,
      selectedAvatarId,
      photoUrl
    };
    localStorage.setItem(`qudsiyyah_card_config_${currentUser.username}`, JSON.stringify(config));
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 2500);
  };

  const handleResetConfig = () => {
    if (confirm('Kembalikan semua kustomisasi data kartu ke setelan bawaan?')) {
      const resetData = {
        nama: currentUser.nama,
        role: currentUser.role,
        nomorInduk: isStudent ? '12345/MQA' : 'NIP-QDS-260601',
        kelas: isStudent ? 'XI-A (Aliyah)' : 'Rumpun Keilmuan Mulok',
        kamar: isStudent ? 'Kamar Al-Iman 02' : 'Ruang Guru Utama',
        tempatLahir: 'Kudus',
        tanggalLahir: '2009-10-15',
        asalKota: 'Kudus, Jawa Tengah',
        hp: '+62 812-3456-7890',
      };
      setProfileData(resetData);
      setSelectedThemeId('emerald-gold');
      setSelectedAvatarId(currentUser.nama.toLowerCase().includes('aminah') ? 'av-fatimah' : 'av-muhammad');
      setPhotoUrl('');
      localStorage.removeItem(`qudsiyyah_card_config_${currentUser.username}`);
    }
  };

  const handlePrint = () => {
    setShowPrintModal(true);
    setTimeout(() => {
      window.print();
    }, 600);
  };

  // Prepares the text content encoded in the QR Code
  const qrRawText = `PESANTREN_QUDSIYYAH_MEMBER_ID:${profileData.nomorInduk}|NAME:${profileData.nama}|ROLE:${profileData.role}|EXP:PERMANENTE`;

  return (
    <div className="space-y-6">
      
      {/* Page Title & Back story info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-brand-primary text-white text-[10px] uppercase font-bold rounded-md flex items-center gap-1 leading-none shadow-sm">
              <CreditCard className="w-3.5 h-3.5" />
              E-Card System
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black text-slate-800">
            Kartu Tanda Anggota Digital
          </h2>
          <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">
            Sistem penerbitan Kartu Tanda Anggota (KTA) digital Ma'had Qudsiyyah Kudus untuk siswa-santri, asatidz, pengurus, maupun admin. Atur detail informasi, cetak kartu fisik mandiri, dan bagikan e-ID Card.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={handlePrint}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-all hover:scale-[1.01]"
          >
            <Printer className="w-4 h-4" />
            Cetak Kartu Fisik
          </button>
        </div>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-opacity duration-300">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <span>Kustomisasi data kartu profil berhasil disimpan secara permanen di browser local storage Anda!</span>
        </div>
      )}

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: THE ID CARD PREVIEW STAGE (SPAN 5) */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4">
          
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pratinjau Kartu ({cardSide === 'front' ? 'Depan' : 'Belakang'})</span>
            <button
              onClick={() => setCardSide(prev => prev === 'front' ? 'back' : 'front')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Putar Kartu
            </button>
          </div>

          {/* CARD CONTAINER WITH SHADOW & TRANSITIONS */}
          <div className="relative w-full max-w-[380px] aspect-[54/85] sm:max-w-[400px] cursor-pointer group mt-2" 
               onClick={() => setCardSide(prev => prev === 'front' ? 'back' : 'front')}
               title="Klik untuk membalik kartu">
            
            {/* FRONT OF THE CARD */}
            <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between absolute inset-0 bg-gradient-to-br shadow-xl transition-all duration-700 backface-hidden select-none overflow-hidden ${activeTheme.bgClass} ${activeTheme.borderColor} ${cardSide === 'front' ? 'opacity-100 rotate-y-0 scale-100' : 'opacity-0 rotate-y-180 scale-95 pointer-events-none'}`}>
              
              {/* Premium Geometric Mesh Overlay */}
              <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
              <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full pointer-events-none ${activeTheme.bannerPattern}`} />
              <div className={`absolute -bottom-10 -right-10 w-44 h-44 rounded-full pointer-events-none ${activeTheme.bannerPattern}`} />

              {/* CARD FRONT HEADER: Logo & School metadata */}
              <div className="flex items-center gap-2.5 border-b pb-2.5 border-white/10 relative z-10">
                <div className="bg-white p-0.5 rounded-lg shrink-0 flex items-center justify-center shadow-xs">
                  {/* Reuse the high quality Qudsiyyah icon */}
                  <QudsiyyahCrest className="w-9 h-9" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-display font-black text-[11px] text-amber-300 tracking-wider uppercase leading-tight truncate">MA'HAD QUDSIYYAH</h3>
                  <p className="text-[7.5px] font-bold text-white/80 uppercase tracking-widest leading-none">Menara Kudus • Jawa Tengah</p>
                  <p className="text-[6.5px] font-mono text-white/50 leading-none mt-1">NSPP: 510333190002</p>
                </div>
              </div>

              {/* CARD FRONT BODY: Member Avatar & Details Grid */}
              <div className="flex gap-4 items-center my-6 relative z-10 flex-1">
                
                {/* PHOTO CONTAINER */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={`w-22 h-26 rounded-xl border border-white/20 shadow-md ${photoUrl ? 'bg-slate-100' : activeAvatar.bgColor} overflow-hidden flex items-center justify-center relative`}>
                    {photoUrl ? (
                      <img src={photoUrl} alt={profileData.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-4xl filter drop-shadow-md select-none">{activeAvatar.emoji}</span>
                    )}

                    {/* Authenticity Red Ink Stamp Overlay on Photo (Pesantren Cap) */}
                    <div className="absolute -bottom-1 -right-2 w-9 h-9 border border-red-500/80 rounded-full flex items-center justify-center pointer-events-none rotate-12 scale-90 border-dashed bg-red-500/10 text-red-500 font-serif text-[6px] font-black leading-none text-center">
                      CAP<br/>MQA
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[8.5px] uppercase tracking-wider ${activeTheme.badgeBg}`}>
                    {profileData.role === Role.Santri ? 'Santri' : 'Pengurus'}
                  </span>
                </div>

                {/* DETAILS METADATA */}
                <div className="flex-1 space-y-2.5 text-xs">
                  <div>
                    <span className="text-[8px] font-bold text-white/40 block leading-none uppercase">Nama Anggota</span>
                    <span className="text-11px font-display font-extrabold text-white leading-tight block truncate" title={profileData.nama}>
                      {profileData.nama}
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-white/40 block leading-none uppercase">
                      {profileData.role === Role.Santri ? 'No. Induk (NIS)' : 'No. Identitas (NIP)'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-300 block">
                      {profileData.nomorInduk}
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-white/40 block leading-none uppercase">
                      {profileData.role === Role.Santri ? 'Kamar / Kelas' : 'Bagian / Kelas'}
                    </span>
                    <span className="text-[9.5px] text-white/90 font-semibold block truncate">
                      {profileData.role === Role.Santri 
                        ? `${profileData.kamar} / ${profileData.kelas}`
                        : `${profileData.kelas}`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-white/40 block leading-none uppercase">Kota / Daerah Asal</span>
                    <span className="text-[9.5px] text-white/90 font-medium block truncate">
                      {profileData.asalKota}
                    </span>
                  </div>
                </div>

              </div>

              {/* CARD FRONT FOOTER: Glow Status, Signature Barcode */}
              <div className="border-t pt-2.5 border-white/10 flex items-end justify-between relative z-10">
                <div className="space-y-0.5">
                  <span className="text-[7px] text-white/40 font-bold block uppercase leading-none">Status Berlaku</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 absolute" />
                    <span className="text-[9px] font-extrabold text-emerald-400 tracking-wider">AKTIF / SEUMUR HIDUP</span>
                  </div>
                </div>

                {/* Simulated high-quality minimalist vector barcode */}
                <div className="flex flex-col items-end">
                  <div className="h-6 w-24 bg-white/10 rounded-sm p-0.5 flex gap-0.5 justify-between items-stretch">
                    <div className="w-1.5 bg-white/90" />
                    <div className="w-0.5 bg-white/40" />
                    <div className="w-1 bg-white/90" />
                    <div className="w-0.5 bg-white/40" />
                    <div className="w-0.75 bg-white/90" />
                    <div className="w-0.5 bg-white/30" />
                    <div className="w-1.25 bg-white/90" />
                    <div className="w-0.5 bg-white/90" />
                    <div className="w-1 bg-white/90" />
                    <div className="w-0.5 bg-white/30" />
                    <div className="w-0.75 bg-white/90" />
                  </div>
                  <span className="text-[6.5px] font-mono text-white/40 mt-0.5">MQA-{profileData.nomorInduk.replace(/\D/g, '') || '9865'}</span>
                </div>
              </div>

            </div>

            {/* BACK OF THE CARD */}
            <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between absolute inset-0 bg-gradient-to-br shadow-xl transition-all duration-700 backface-hidden select-none overflow-hidden ${activeTheme.bgClass} ${activeTheme.borderColor} ${cardSide === 'back' ? 'opacity-100 rotate-y-0 scale-100' : 'opacity-0 rotate-y-180 scale-95 pointer-events-none'}`}>
              
              <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none" />
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none ${activeTheme.bannerPattern}`} />
              <div className={`absolute -bottom-10 -left-10 w-44 h-44 rounded-full pointer-events-none ${activeTheme.bannerPattern}`} />

              {/* CARD BACK HEADER: Quote from Al-Zarnuji (Ta'lim Muta'allim) or Quranic Verse */}
              <div className="text-center border-b pb-2 border-white/15 relative z-10">
                <span className="font-serif italic text-[11px] text-amber-300 block leading-tight">
                  قَالَ رَسُولُ اللَّهِ ﷺ: طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ
                </span>
                <p className="text-[7.5px] text-white/70 italic mt-1 leading-none">
                  "Menuntut ilmu wajib bagi setiap orang Islam" (HR. Ibnu Majah)
                </p>
              </div>

              {/* CARD BACK BODY: Rules & Conditions of Ma'had Qudsiyyah */}
              <div className="my-3.5 space-y-1.5 relative z-10 flex-1">
                <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest block mb-1">
                  Tata Tertib & Ketentuan Pemegang Kartu:
                </span>
                <ol className="list-decimal list-inside text-[7.5px] text-white/80 space-y-1 font-semibold leading-relaxed">
                  <li>Kartu ini wajib dibawa saat menghadiri kegiatan resmi ma'had.</li>
                  <li>Wajib digunakan sebagai akses verifikasi proses perizinan keluar-masuk.</li>
                  <li>Hak kepemilikan mutlak milik Ma'had Qudsiyyah Kudus, tidak boleh dipindahtangankan.</li>
                  <li>Jika menemukan kartu ini harap mengembalikan ke Bagian Kepengasuhan Ma'had.</li>
                  <li>Khidmah Tholabul Ilmi demi tercapainya ilmu yang berkah manfaat dunia akhirat.</li>
                </ol>
              </div>

              {/* CARD BACK FOOTER: QR verification box & Authority Sign */}
              <div className="border-t pt-2 border-white/15 flex items-center justify-between relative z-10">
                
                {/* Dynamically simulated customizable QR Code */}
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1 rounded-lg shrink-0 shadow-md">
                    <svg className="w-13 h-13" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Outer frame */}
                      <rect width="100" height="100" fill="white" />
                      {/* Simulated QR block positions */}
                      <g fill="#111827">
                        {/* Top-left position finder */}
                        <path d="M5,5 h25 v25 h-25 z M10,10 h15 v15 h-15 z" />
                        {/* Top-right position finder */}
                        <path d="M70,5 h25 v25 h-25 z M75,10 h15 v15 h-15 z" />
                        {/* Bottom-left position finder */}
                        <path d="M5,70 h25 v25 h-25 z M10,75 h15 v15 h-15 z" />
                        
                        {/* Scattered randomized QR dots for highly authentic visual representability */}
                        <rect x="15" y="40" width="10" height="10" />
                        <rect x="40" y="15" width="10" height="10" />
                        <rect x="50" y="5" width="5" height="5" />
                        <rect x="60" y="20" width="10" height="10" />
                        <rect x="35" y="35" width="20" height="15" />
                        <rect x="40" y="55" width="15" height="10" />
                        <rect x="15" y="55" width="10" height="10" />
                        <rect x="65" y="45" width="10" height="20" />
                        <rect x="80" y="40" width="15" height="5" />
                        <rect x="75" y="55" width="5" height="10" />
                        <rect x="45" y="75" width="15" height="15" />
                        <rect x="85" y="80" width="10" height="10" />
                        <rect x="70" y="75" width="5" height="5" />
                        <rect x="65" y="85" width="10" height="10" />
                        <rect x="35" y="80" width="5" height="10" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[6.5px] text-white/50 block font-bold uppercase leading-none">Security Verification</span>
                    <span className="text-[7.5px] font-mono font-bold text-emerald-300 block mt-0.5">SCAN TO VALIDATE</span>
                  </div>
                </div>

                {/* Director's Signature of Ma'had */}
                <div className="text-right space-y-0.5">
                  <span className="text-[6px] text-white/55 block">Kudus, Juni 2026</span>
                  <span className="text-[7px] font-extrabold text-[#FFC107] block uppercase">Mudir Ma'had,</span>
                  
                  {/* Signature graphic overlay */}
                  <div className="h-4 relative flex justify-end">
                    <svg className="w-14 h-4 text-amber-300/80 -rotate-3" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M10,12 C25,2 40,25 50,15 C60,5 75,25 90,8" />
                      <path d="M15,20 L80,18" strokeWidth="1" />
                    </svg>
                    {/* Circle seal stamp */}
                    <div className="absolute right-3 -bottom-1 w-6 h-6 border border-dashed border-red-500/60 rounded-full flex items-center justify-center font-serif text-[4px] font-black leading-none text-red-500/30 scale-90">
                      MQA
                    </div>
                  </div>
                  
                  <span className="text-[7.5px] font-bold text-white block underline">K.H. Ahmad Dahlan</span>
                </div>

              </div>

            </div>

          </div>

          {/* Quick Manual Flip Tips */}
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 justify-center">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Tip: Klik pada kartu di atas untuk membalik dan melihat sisi {cardSide === 'front' ? 'belakang' : 'depan'}
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: CARD CUSTOMIZER FORM & OTHER MEMBERS VIEWER (SPAN 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PERSONALIZATION CONFIGURATION PANEL */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
            <div className="border-b pb-3 border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg shrink-0 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-display font-extrabold text-slate-800 text-sm">Penyesuaian Detail Informasi Kartu</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Ubah template, foto, serta identitas Anda untuk disematkan di kartu digital</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetConfig}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                  title="Reset Kustomisasi"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 1. Select Card Theme */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-secondary" />
                Pilih Desain Tema Kartu:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {CARD_THEMES.map((theme) => {
                  const isGold = theme.id === 'emerald-gold';
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold leading-tight relative overflow-hidden flex flex-col justify-between items-center gap-1.5 ${isSelected ? 'border-brand-secondary bg-emerald-50 text-emerald-950 shadow-inner' : 'border-slate-150 hover:bg-slate-50 text-slate-700'}`}
                    >
                      <div className={`w-8 h-4 rounded-md bg-gradient-to-br ${theme.bgClass}`} />
                      <span>{theme.name}</span>
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 p-0.5 bg-brand-secondary text-white rounded-full">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Photo Avatar Customizer Selector */}
            <div className="space-y-2.5 pt-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Pilih Avatar Foto Profil (Gunakan Emoji Pesantren atau URL Foto Sendiri)</label>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AVATAR_PRESETS.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => {
                      setSelectedAvatarId(av.id);
                      setPhotoUrl(''); // clear URL as preset is selected
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-[10px] font-bold text-center ${selectedAvatarId === av.id && !photoUrl ? 'border-brand-secondary bg-emerald-50/50 text-emerald-900 shadow-inner' : 'border-slate-150 hover:bg-slate-50 text-slate-600'}`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
                    <span className="truncate w-full block">{av.name.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>

              {/* Or Input custom image URL option */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      placeholder="Atau tempel URL foto profil kustom (e.g. https://...)"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-2 focus:bg-white focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition-all"
                    />
                    {photoUrl && (
                      <span className="absolute right-2.5 top-2.5 text-[8.5px] uppercase font-mono font-bold text-brand-secondary">AKTIF</span>
                    )}
                  </div>
                  {photoUrl && (
                    <button
                      onClick={() => setPhotoUrl('')}
                      className="px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                </div>
                <p className="text-[9.5px] text-slate-400 mt-1.5 leading-none">Masukkan tautan URL foto Anda sendiri (misal dari hosting eksternal atau Google Drive publik/Unsplash).</p>
              </div>
            </div>

            {/* 3. Core Text Information fields on Card */}
            <div className="border-t pt-4 border-slate-100 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Ubah Teks Identitas Kartu Mandiri</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Field 1: Nama */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Lengkap Anggota</label>
                  <input
                    type="text"
                    value={profileData.nama}
                    onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:ring-1 focus:ring-brand-secondary outline-none"
                  />
                </div>

                {/* Field 2: Nomor Induk / NIS */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {profileData.role === Role.Santri ? 'Nomor Induk Santri (NIS)' : 'No. Identitas/NIP Pengurus'}
                  </label>
                  <input
                    type="text"
                    value={profileData.nomorInduk}
                    onChange={(e) => setProfileData({ ...profileData, nomorInduk: e.target.value })}
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:ring-1 focus:ring-brand-secondary outline-none"
                  />
                </div>

                {/* Field 3: Kelas atau Departemen */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {profileData.role === Role.Santri ? 'Kelas / Jenjang' : 'Rumpun Tugas / Divisi'}
                  </label>
                  <input
                    type="text"
                    value={profileData.kelas}
                    onChange={(e) => setProfileData({ ...profileData, kelas: e.target.value })}
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:ring-1 focus:ring-brand-secondary outline-none"
                  />
                </div>

                {/* Field 4: Kamar (if student) or Bagian */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {profileData.role === Role.Santri ? 'Kamar Santri' : 'Lokasi Kantor Utama'}
                  </label>
                  <input
                    type="text"
                    value={profileData.kamar}
                    onChange={(e) => setProfileData({ ...profileData, kamar: e.target.value })}
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:ring-1 focus:ring-brand-secondary outline-none"
                  />
                </div>

                {/* Field 5: Kota Asal */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Asal Daerah / Kota</label>
                  <input
                    type="text"
                    value={profileData.asalKota}
                    onChange={(e) => setProfileData({ ...profileData, asalKota: e.target.value })}
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:ring-1 focus:ring-brand-secondary outline-none"
                  />
                </div>

                {/* Field 6: No HP */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">No. Handphone Aktif / Darurat</label>
                  <input
                    type="text"
                    value={profileData.hp}
                    onChange={(e) => setProfileData({ ...profileData, hp: e.target.value })}
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:ring-1 focus:ring-brand-secondary outline-none"
                  />
                </div>

              </div>
            </div>

            {/* Bottom Actions of customize */}
            <div className="border-t pt-4 border-slate-100 flex justify-end gap-2 bg-white">
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-brand-primary text-white hover:bg-brand-secondary font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Simpan Penyesuaian Kartu
              </button>
            </div>

          </div>

          {/* BENEFIT/ADVANTAGE INFORMATIONAL CARD */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-200/50 shadow-xs space-y-3">
            <h4 className="font-display font-extrabold text-amber-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-700" />
              Verifikasi & Keamanan Kartu Anggota
            </h4>
            <div className="text-xs text-amber-800 leading-relaxed space-y-2 font-medium">
              <p>
                KTA Ma'had Qudsiyyah Kudus terintegrasi secara digital. Scan QR code pada bagian belakang kartu untuk memvalidasi status keaktifan santri di sistem perizinan utama pengasuhan secara otomatis saat melewati pos penjagaan.
              </p>
              <p>
                Gunakan menu <strong>"Cetak Kartu Fisik"</strong> untuk mengunduh pdf dalam format layout standard siap print PVC seukuran KTP/ID Card biasa. Pastikan Anda menunjukkan identitas yang sah saat pemeriksaan.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* FULL-SCREEN PRINT MODE OVERLAY (ONLY TRIGGERED ON PRINT ACTION) */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-white z-9999 font-sans flex flex-col items-center justify-center p-8 overflow-y-auto print:absolute print:inset-0 print:p-0 bg-white">
          
          {/* HEADER EXCLUSIVELY SHOWN TO BROWSER RENDER, HIDDEN ON PRINT */}
          <div className="text-center space-y-3 mb-10 no-print flex flex-col items-center">
            <div className="p-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl font-bold flex items-center gap-1.5 text-xs animate-bounce">
              <Printer className="w-4 h-4" />
              Sistem layout siap cetak (ID Card Standards)
            </div>
            <h3 className="text-lg font-black text-slate-800">Menampilkan Dialog Cetak Browser...</h3>
            <p className="text-xs text-slate-500 max-w-md">
              Dialog cetak browser Anda telah terbuka secara otomatis. Gunakan ukuran kertas standard (A4 atau Portrait) dan aktifkan opsi "Cetak Gambar Latar (Background Graphics)" agar tema kartu tercetak sempurna.
            </p>
            <button
              onClick={() => setShowPrintModal(false)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Selesai & Kembali ke Aplikasi
            </button>
          </div>

          {/* TWO GRAPHIC CARDS ALIGNED SIDE-BY-SIDE PERFECTLY FOR PRINTING */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 print:flex-row print:gap-14 print:mt-12 bg-white p-4">
            
            {/* FRONT PRINT CARD OUTLINE */}
            <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between bg-gradient-to-br shadow-none select-none overflow-hidden ${activeTheme.bgClass} ${activeTheme.borderColor} w-[320px] aspect-[85/54] relative text-white shrink-0`}>
              <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-2.5 border-b pb-2.5 border-white/10 relative z-10">
                <div className="bg-white p-0.5 rounded-lg shrink-0 flex items-center justify-center">
                  <QudsiyyahCrest className="w-9 h-9" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-display font-black text-[11px] text-amber-300 tracking-wider uppercase leading-tight truncate">MA'HAD QUDSIYYAH</h3>
                  <p className="text-[7.5px] font-bold text-white/80 uppercase tracking-widest leading-none">Menara Kudus • Jawa Tengah</p>
                </div>
              </div>

              <div className="flex gap-4 items-center my-4 relative z-10 flex-1">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className={`w-18 h-22 rounded-xl border border-white/20 shadow-md ${photoUrl ? 'bg-slate-100' : activeAvatar.bgColor} overflow-hidden flex items-center justify-center relative`}>
                    {photoUrl ? (
                      <img src={photoUrl} alt={profileData.nama} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl filter drop-shadow-md select-none">{activeAvatar.emoji}</span>
                    )}
                    <div className="absolute -bottom-1 -right-2 w-8 h-8 border border-red-500/80 rounded-full flex items-center justify-center rotate-12 scale-90 border-dashed bg-red-500/10 text-red-500 font-serif text-[5px] font-black leading-none">
                      CAP<br/>MQA
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-md font-bold text-[7.5px] uppercase tracking-wider ${activeTheme.badgeBg}`}>
                    {profileData.role === Role.Santri ? 'Santri' : 'Pengurus'}
                  </span>
                </div>

                <div className="flex-1 space-y-2 text-[10px]">
                  <div>
                    <span className="text-[7px] font-bold text-white/40 block leading-none uppercase">Nama Anggota</span>
                    <span className="font-display font-extrabold text-white leading-tight block truncate">
                      {profileData.nama}
                    </span>
                  </div>

                  <div>
                    <span className="text-[7px] font-bold text-white/40 block leading-none uppercase">
                      {profileData.role === Role.Santri ? 'No. Induk (NIS)' : 'No. Identitas (NIP)'}
                    </span>
                    <span className="font-mono font-bold text-amber-300 block text-[9px]">
                      {profileData.nomorInduk}
                    </span>
                  </div>

                  <div>
                    <span className="text-[7px] font-bold text-white/40 block leading-none uppercase">
                      {profileData.role === Role.Santri ? 'Kamar / Kelas' : 'Bagian / Kelas'}
                    </span>
                    <span className="text-[8.5px] text-white/95 font-semibold block truncate">
                      {profileData.role === Role.Santri 
                        ? `${profileData.kamar} / ${profileData.kelas}`
                        : `${profileData.kelas}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-2 border-white/10 flex items-end justify-between relative z-10">
                <div className="space-y-0.5">
                  <span className="text-[6.5px] text-white/40 font-bold block uppercase leading-none">Status Berlaku</span>
                  <span className="text-[8.5px] font-extrabold text-emerald-400 tracking-wider">AKTIF / SEUMUR HIDUP</span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="h-4.5 w-20 bg-white/10 rounded-sm p-0.5 flex gap-0.5 justify-between items-stretch">
                    <div className="w-1 bg-white/90" />
                    <div className="w-0.5 bg-white/40" />
                    <div className="w-1 bg-white/90" />
                    <div className="w-0.5 bg-white/30" />
                    <div className="w-0.75 bg-white/90" />
                    <div className="w-1 bg-white/90" />
                    <div className="w-0.5 bg-white/90" />
                    <div className="w-0.75 bg-white/90" />
                  </div>
                </div>
              </div>

            </div>

            {/* BACK PRINT CARD OUTLINE */}
            <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between bg-gradient-to-br shadow-none select-none overflow-hidden ${activeTheme.bgClass} ${activeTheme.borderColor} w-[320px] aspect-[85/54] relative text-white shrink-0`}>
              <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none" />
              
              <div className="text-center border-b pb-1.5 border-white/10 relative z-10">
                <span className="font-serif italic text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 block leading-tight">
                  طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ
                </span>
                <p className="text-[7.5px] text-white/70 italic leading-none mt-0.5">
                  "Menuntut ilmu wajib bagi setiap orang Islam"
                </p>
              </div>

              <div className="my-2.5 space-y-1 relative z-10 flex-1">
                <span className="text-[8px] font-black text-amber-400 uppercase block leading-none">
                  Tata Tertib Anggota:
                </span>
                <ol className="text-[7px] text-white/80 space-y-0.5 font-semibold list-decimal list-inside leading-normal">
                  <li>Kartu ini wajib dibawa saat menghadiri kegiatan resmi ma'had.</li>
                  <li>Wajib digunakan sebagai akses verifikasi proses perizinan.</li>
                  <li>Hak kepemilikan mutlak milik Ma'had Qudsiyyah Kudus.</li>
                  <li>Khidmah Tholabul Ilmi demi tercapainya ilmu yang berkah.</li>
                </ol>
              </div>

              <div className="border-t pt-1.5 border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                  <div className="bg-white p-0.5 rounded-sm">
                    <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none">
                      <rect width="100" height="100" fill="white" />
                      <g fill="#111827">
                        <path d="M5,5 h25 v25 h-25 z M10,10 h15 v15 h-15 z" />
                        <path d="M70,5 h25 v25 h-25 z M75,10 h15 v15 h-15 z" />
                        <path d="M5,70 h25 v25 h-25 z M10,75 h15 v15 h-15 z" />
                        <rect x="20" y="40" width="10" height="10" />
                        <rect x="40" y="20" width="10" height="10" />
                        <rect x="35" y="35" width="20" height="15" />
                        <rect x="40" y="55" width="15" height="10" />
                        <rect x="65" y="45" width="10" height="20" />
                        <rect x="45" y="75" width="15" height="15" />
                        <rect x="85" y="80" width="10" height="10" />
                      </g>
                    </svg>
                  </div>
                  <span className="text-[7px] font-bold text-amber-300">SCAN VERIFIED</span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-[5.5px] text-white/55 block">Kudus, Juni 2026</span>
                  <span className="text-[6.5px] font-extrabold text-[#FFC107] block leading-none">Mudir Ma'had,</span>
                    <svg className="w-12 h-3.5 text-amber-400" viewBox="0 0 100 30" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M10,12 C25,2 40,25 50,15 C60,5 75,25 90,8" />
                    </svg>
                  <span className="text-[7px] font-bold text-white block underline leading-none">K.H. Ahmad Dahlan</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
