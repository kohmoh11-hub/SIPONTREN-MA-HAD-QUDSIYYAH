import React from 'react';

/**
 * High-Fidelity SVG Emblem for Yayasan Pendidikan Islam Qudsiyyah Menara Kudus
 */
export function QudsiyyahCrest({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg 
      className={`${className} transition-transform hover:scale-105 duration-300 drop-shadow-md select-none`} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Case (Red Ring) */}
      <circle cx="60" cy="60" r="58" fill="#D32F2F" />
      <circle cx="60" cy="60" r="54" fill="#FFC107" />

      {/* 8-Petaled Lotus Flower Contour (Yellow with red border, wrapping the core) */}
      {/* Mathematically perfectly symmetric 8-petal Bezier shape centered around 60,60 */}
      <path 
        d="M 60,8.5 Q 69,14.5 76.8,19.4 Q 84.5,21.5 96.4,23.6 Q 98.5,33.5 100.6,43.2 Q 106.5,51.5 111.5,60 Q 106.5,68.5 100.6,76.8 Q 98.5,86.5 96.4,96.4 Q 84.5,98.5 76.8,100.6 Q 69,105.5 60,111.5 Q 51,105.5 43.2,100.6 Q 35.5,98.5 23.6,96.4 Q 21.5,86.5 19.4,76.8 Q 13.5,68.5 8.5,60 Q 13.5,51.5 19.4,43.2 Q 21.5,33.5 23.6,23.6 Q 35.5,21.5 43.2,19.4 Q 51,14.5 60,8.5 Z" 
        fill="#FFD54F" 
        stroke="#D32F2F" 
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Red Circle Divider inside the flower */}
      <circle cx="60" cy="60" r="44" fill="#D32F2F" />
      
      {/* Outer Yellow Border of the Shield Container */}
      <circle cx="60" cy="60" r="41.5" fill="#FFEB3B" />

      {/* ========================================== */}
      {/* THE PENTAGON SHIELD (Dual background) */}
      {/* Left side is Green, Right side is White */}
      {/* ========================================== */}
      <g>
        {/* Left Green half of the Pentagon */}
        <path d="M 60,26 L 27,45 L 35,80 L 60,80 Z" fill="#0B7A3E" />
        {/* Right White half of the Pentagon */}
        <path d="M 60,26 L 93,45 L 85,80 L 60,80 Z" fill="#FFFFFF" />
        
        {/* Outer Shield Outline (Golden and black frame) */}
        <path 
          d="M 60,26 L 27,45 L 35,80 L 85,80 L 93,45 Z" 
          fill="none" 
          stroke="#FFD54F" 
          strokeWidth="3.2" 
          strokeLinejoin="round" 
        />
        <path 
          d="M 60,26 L 27,45 L 35,80 L 85,80 L 93,45 Z" 
          fill="none" 
          stroke="#1A1A1A" 
          strokeWidth="1" 
          strokeLinejoin="round" 
        />
      </g>

      {/* Text Inside Shield parallel to left green slant: PENDIDIKAN ISLAM */}
      <defs>
        <path id="shield-text-left" d="M 30,44.5 L 57,29" fill="none" />
        <path id="shield-text-right" d="M 63,29 L 90,44.5" fill="none" />
      </defs>
      
      <text fill="#FFFFFF" fontSize="3.6" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.1">
        <textPath href="#shield-text-left" startOffset="50%" textAnchor="middle">
          PENDIDIKAN ISLAM
        </textPath>
      </text>

      {/* Text Inside Shield parallel to right white slant: QUDSIYYAH */}
      <text fill="#1A1A1A" fontSize="4.0" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.1">
        <textPath href="#shield-text-right" startOffset="50%" textAnchor="middle">
          QUDSIYYAH
        </textPath>
      </text>

      {/* ========================================== */}
      {/* CELESTIAL STARS (Left: White, Right: Black) */}
      {/* ========================================== */}
      
      {/* Top Peak Star (Centered Black star right above tower, on the dividing line) */}
      <polygon points="60,29 61.2,31.5 64,31.5 61.8,33.2 62.6,36 60,34.2 57.4,36 58.2,33.2 56,31.5 58.8,31.5" fill="#1A1A1A" />

      {/* Left green side stars (3 White Stars aligned diagonally following green slant) */}
      <g fill="#FFFFFF">
        <polygon points="37,48.5 38.2,51 41,51 38.8,52.7 39.6,55.5 37,53.7 34.4,55.5 35.2,52.7 33,51 35.8,51" />
        <polygon points="44,43.5 45.2,46 48,46 45.8,47.7 46.6,50.5 44,48.7 41.4,50.5 42.2,47.7 40,46 42.8,46" />
        <polygon points="51,38.5 52.2,41 55,41 52.8,42.7 53.6,45.5 51,43.7 48.4,45.5 49.2,42.7 47,41 49.8,41" />
      </g>

      {/* Right white side stars (3 Black Stars aligned diagonally following white slant) */}
      <g fill="#1A1A1A">
        <polygon points="83,48.5 84.2,51 87,51 84.8,52.7 85.6,55.5 83,53.7 80.4,55.5 81.2,52.7 79,51 81.8,51" />
        <polygon points="76,43.5 77.2,46 80,46 77.8,47.7 78.6,50.5 76,48.7 73.4,50.5 74.2,47.7 72,46 74.8,46" />
        <polygon points="69,38.5 70.2,41 73,41 70.8,42.7 71.6,45.5 69,43.7 66.4,45.5 67.2,42.7 65,41 67.8,41" />
      </g>

      {/* ========================================== */}
      {/* CORE LOGO TOWER (MENARA KUDUS) SILHOUETTE */}
      {/* ========================================== */}
      
      {/* Base Candi pediment/platforms */}
      <rect x="50" y="66" width="20" height="4" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="0.5" rx="0.5" />
      
      {/* Fine white brick details for the historical masonry look */}
      <line x1="50" y1="67.5" x2="70" y2="67.5" stroke="#FFFFFF" strokeWidth="0.4" opacity="0.8" />
      <line x1="50" y1="69" x2="70" y2="69" stroke="#FFFFFF" strokeWidth="0.4" opacity="0.8" />
      
      {/* Main vertical brick trunk (tapered) */}
      <path d="M 54.75,47 L 65.25,47 L 63.5,66 L 56.5,66 Z" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="0.6" />
      
      {/* Inner dark center column arches/door of the minaret */}
      <path d="M 58,52 C 58,50.5 62,50.5 62,52 L 62,66 L 58,66 Z" fill="#000000" stroke="#FFFFFF" strokeWidth="0.5" />

      {/* Tower highlight markings representing architectural banding */}
      <line x1="54.2" y1="56" x2="65.8" y2="56" stroke="#FFFFFF" strokeWidth="0.5" />
      <line x1="54.5" y1="61" x2="65.5" y2="61" stroke="#FFFFFF" strokeWidth="0.5" />

      {/* Double Overlocking Java Tumpang Overhang Roofs */}
      {/* Lower roof deck */}
      <rect x="48" y="45.5" width="24" height="1.5" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="0.5" />
      {/* Overhanging curved tumpang roof layer 1 */}
      <polygon points="46,45.5 74,45.5 70,40.5 50,40.5" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="0.6" />
      
      {/* Middle timber lantern spacer */}
      <rect x="54" y="37" width="12" height="3.5" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="0.5" />
      
      {/* Overhanging steep pyramid roof layer 2 */}
      <polygon points="51,37 69,37 60,31" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="0.6" />
      
      {/* Pinnacle Crest Tip (Mustaka crescent crown design) */}
      <line x1="60" y1="31" x2="60" y2="28" stroke="#FFFFFF" strokeWidth="0.8" />
      <circle cx="60" cy="27.5" r="1.1" fill="#FFD54F" />

      {/* ========================================== */}
      {/* STYLIZED WHITE PEN/KRIS BLADE */}
      {/* Elegant wing-like curve flowing on the right of Menara */}
      {/* ========================================== */}
      <path 
        d="M 62.5,65 C 71.5,60 77,50 75,40 C 73.5,37.5 72.5,38.5 71,41 C 67.5,47.5 64,57 61.5,65 Z" 
        fill="#FFFFFF" 
        stroke="#1A1A1A" 
        strokeWidth="0.8" 
        strokeLinejoin="round"
      />
      {/* Internal feather shaft line to make it clearly look like a Kalam pen */}
      <path d="M 62,62 C 65.5,56.5 69,50 71.5,43.5" stroke="#1A1A1A" strokeWidth="0.5" fill="none" />

      {/* ========================================== */}
      {/* RED ARABIC CALLIGRAPHY SCROLL/SASH */}
      {/* Dynamically wrapped around the base of the tower */}
      {/* ========================================== */}
      <g>
        {/* Ribbon back folds for classic banner tailing */}
        <path d="M 41,59 L 36,61.5 L 36,65 L 43,63.5 Z" fill="#880E4F" stroke="#1A1A1A" strokeWidth="0.8" />
        <polygon points="41,59 43,63.5 40,61" fill="#1A1A1A" />
        
        <path d="M 79,59 L 84,61.5 L 84,65 L 77,63.5 Z" fill="#880E4F" stroke="#1A1A1A" strokeWidth="0.8" />
        <polygon points="79,59 77,63.5 80,61" fill="#1A1A1A" />

        {/* Shadow-like backing ribbon */}
        <path d="M 40,60 C 50,57.5 70,57.5 80,60 L 77,65 C 69,62.5 51,62.5 43,65 Z" fill="#1A1A1A" />
        {/* Main Crimson sash ribbon */}
        <path d="M 41,59 C 50.5,56.5 69.5,56.5 79,59 L 77,64 C 69,61.5 51,61.5 43,64 Z" fill="#C62828" stroke="#1A1A1A" strokeWidth="0.8" />
        
        {/* Golden calligraphic curls mimicking standard script on original ribbon (التربية الإسلامية) */}
        <path 
          d="M 44,61.5 C 47,59.5 50,61.5 53,60 Q 55,59.5 58,60 Q 61,59.5 64,60 Q 67,59.5 70,60.5 Q 73,59.5 76,60.5" 
          fill="none" 
          stroke="#FFF59D" 
          strokeWidth="0.75" 
          strokeLinecap="round" 
        />
        <path 
          d="M 46,62.5 Q 49,61 52,62 Q 55,60.5 58,62 Q 61,60.5 64,61.5 Q 68,61 72,62" 
          fill="none" 
          stroke="#FFF59D" 
          strokeWidth="0.5" 
          strokeLinecap="round" 
        />
      </g>

      {/* ========================================== */}
      {/* BOTTOM LOGO ELEMENT ROW (Within Pentagon) */}
      {/* Left: Stack of books | Center: Open Quran | Right: Kandil Lamp */}
      {/* ========================================== */}
      
      {/* Left: Stack of three distinct vertical school books */}
      <g>
        <rect x="36.5" y="69" width="2.5" height="9.5" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="0.5" rx="0.3" />
        <rect x="39" y="69" width="2.5" height="9.5" fill="#4CAF50" stroke="#1A1A1A" strokeWidth="0.5" rx="0.3" />
        <rect x="41.5" y="70.5" width="2.5" height="8" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="0.5" rx="0.3" />
        {/* Fine vertical lines representing book bindings/page segments */}
        <line x1="37.75" y1="71.5" x2="37.75" y2="76" stroke="#1A1A1A" strokeWidth="0.4" />
        <line x1="40.25" y1="71.5" x2="40.25" y2="76" stroke="#FFFFFF" strokeWidth="0.4" />
      </g>

      {/* Center: Open Holy Qur'an with support rehal stand */}
      <g>
        {/* Rehal Pedestal stand */}
        <polygon points="53,77.5 67,77.5 65.5,80 54.5,80" fill="#BF360C" stroke="#1A1A1A" strokeWidth="0.5" />
        {/* White pages showing script text lines */}
        <path 
          d="M 53.5,73.5 C 56.5,72 59.5,73.5 60,74.5 C 60.5,73.5 63.5,72 66.5,73.5 L 66.5,76.5 C 63.5,75 60.5,76.5 60,77 C 59.5,76.5 56.5,75 53.5,76.5 Z" 
          fill="#FFFFFF" 
          stroke="#1A1A1A" 
          strokeWidth="0.5" 
          strokeLinejoin="round" 
        />
        {/* Script mock letters */}
        <line x1="55" y1="74.5" x2="58.5" y2="74.5" stroke="#757575" strokeWidth="0.4" />
        <line x1="55" y1="75.5" x2="58.5" y2="75.5" stroke="#757575" strokeWidth="0.4" />
        <line x1="61.5" y1="74.5" x2="65" y2="74.5" stroke="#757575" strokeWidth="0.4" />
        <line x1="61.5" y1="75.5" x2="65" y2="75.5" stroke="#757575" strokeWidth="0.4" />
      </g>

      {/* Right: Classic Dome Pelita Study Lamp with golden aura */}
      <g>
        {/* Base set on bottom boundary y=80 */}
        <path d="M 74,80 L 82,80 L 80,77.5 L 76,77.5 Z" fill="#37474F" stroke="#1A1A1A" strokeWidth="0.6" />
        {/* Oil-filled glass body */}
        <circle cx="78" cy="76" r="2.5" fill="#FFB74D" stroke="#1A1A1A" strokeWidth="0.5" />
        {/* Nozzle/Adjuster */}
        <rect x="76.5" y="73.2" width="3" height="0.8" fill="#78909C" stroke="#1A1A1A" strokeWidth="0.4" />
        {/* Bulb dome chimney */}
        <path d="M 76.5,73.2 C 75.5,69.5 80.5,69.5 79.5,73.2 Z" fill="#E0F7FA" opacity="0.85" stroke="#1A1A1A" strokeWidth="0.5" />
        {/* Rising lamp flame */}
        <path d="M 78,71 Q 78.5,72 78,73 Q 77.5,72 78,71 Z" fill="#FF3D00" />
        {/* Radiating Light Rays/Aura */}
        <line x1="73" y1="71" x2="71" y2="69" stroke="#FFD54F" strokeWidth="0.6" strokeLinecap="round" />
        <line x1="83" y1="71" x2="85" y2="69" stroke="#FFD54F" strokeWidth="0.6" strokeLinecap="round" />
        <line x1="78" y1="67.5" x2="78" y2="65" stroke="#FFD54F" strokeWidth="0.6" strokeLinecap="round" />
        <line x1="74" y1="75" x2="71" y2="75" stroke="#FFD54F" strokeWidth="0.6" strokeLinecap="round" />
        <line x1="82" y1="75" x2="85" y2="75" stroke="#FFD54F" strokeWidth="0.6" strokeLinecap="round" />
      </g>

      {/* ========================================== */}
      {/* "KUDUS" BANNER AT THE ABSOLUTE BOTTOM */}
      {/* Curves elegantly along the yellow ring contour */}
      {/* ========================================== */}
      <g>
        {/* Yellow ribbon background shape conforming to lower contour */}
        <path 
          d="M 37,83.5 C 47,81.5 73,81.5 83,83.5 L 80,90.5 C 71.5,88.5 48.5,88.5 40,90.5 Z" 
          fill="#FFEB3B" 
          stroke="#1A1A1A" 
          strokeWidth="1.2" 
          strokeLinejoin="round"
        />
        {/* Centered KUDUS text */}
        <text 
          x="60" 
          y="89" 
          textAnchor="middle" 
          fill="#000000" 
          fontSize="5.8" 
          fontWeight="950" 
          fontFamily="Georgia, serif" 
          letterSpacing="1"
        >
          KUDUS
        </text>
      </g>
    </svg>
  );
}

interface InstitutionHeaderProps {
  variant?: 'letterhead' | 'banner' | 'compact' | 'light-bg';
}

/**
 * Reusable Brand Letterhead (KOP SURAT) & Banner Component representing Qudsiyyah Menara Kudus
 */
export default function InstitutionHeader({ variant = 'letterhead' }: InstitutionHeaderProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 bg-[#054032]/5 border border-emerald-800/10 p-3.5 rounded-2xl">
        <QudsiyyahCrest className="w-12 h-12 shrink-0" />
        <div>
          <h4 className="font-display font-extrabold text-[#054032] text-sm tracking-tight leading-none uppercase">MA'HAD QUDSIYYAH</h4>
          <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Yayasan Pendidikan Islam Qudsiyyah Menara Kudus</p>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="relative group overflow-hidden bg-gradient-to-br from-[#054032] via-[#043d2f] to-[#02221b] text-white p-6 md:p-8 rounded-2xl shadow-lg border border-emerald-800/30">
        {/* Geometric Background Overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20 group-hover:bg-emerald-500/15 transition-all duration-700" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-yellow-500/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white/95 p-2 rounded-2xl shadow-md shrink-0 flex items-center justify-center">
            <QudsiyyahCrest className="w-20 h-20" />
          </div>
          
          <div className="text-center md:text-left flex-1 space-y-2">
            <div>
              <span className="px-3 py-1 bg-[#10b981]/25 text-emerald-300 text-[10px] font-bold tracking-wider rounded-full border border-emerald-500/20 uppercase">
                Ma'had Aly & Salafiyyah
              </span>
            </div>
            
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-amber-300 tracking-tight leading-tight uppercase">
              MA'HAD QUDSIYYAH KUDUS
            </h1>
            
            <p className="text-emerald-100 text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
              Di bawah naungan <strong className="text-amber-400 font-semibold">Yayasan Pendidikan Islam Qudsiyyah Menara Kudus</strong>. Mengintegrasikan kemurnian tradisi salaf dengan teknologi modern sistem manajemen pondok pesantren.
            </p>

            <div className="pt-2 border-t border-emerald-800/50 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-[10px] text-emerald-300 font-mono">
              <span>📍 Kudus, Jawa Tengah</span>
              <span className="hidden sm:inline">•</span>
              <span>🌐 www.qudsiyyah.com</span>
              <span className="hidden sm:inline">•</span>
              <span>📧 mahadqudsiyah1919@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT & LETTERHEAD (KOP SURAT) Style
  return (
    <div className={`w-full bg-white select-none ${variant === 'letterhead' ? 'p-6 border border-slate-200 shadow-md rounded-2xl' : 'p-4'}`}>
      
      {/* Letterhead Grid */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 text-center md:text-left pb-4">
        
        {/* Institution Logo on left */}
        <div className="shrink-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm">
          <QudsiyyahCrest className="w-18 h-18 md:w-22 md:h-22" />
        </div>

        {/* Institution Texts */}
        <div className="flex-1 space-y-1.5 max-w-3xl">
          {/* Beautiful Faux Calligraphy using Serif Styling */}
          <div className="py-2 flex justify-center md:justify-start">
            <div className="text-right text-emerald-950 font-serif italic text-xl md:text-2xl tracking-normal select-none leading-none opacity-90 block">
              المؤسسة التربوية الإسلامية قدسية منار قدس
            </div>
          </div>

          <h2 className="text-xs md:text-sm font-display font-extrabold text-slate-500 uppercase tracking-widest leading-none">
            YAYASAN PENDIDIKAN ISLAM QUDSIYYAH MENARA KUDUS
          </h2>
          
          <h1 className="text-2xl md:text-3.5xl font-serif font-black text-slate-900 tracking-tight leading-none uppercase">
            MA'HAD QUDSIYYAH
          </h1>
          
          <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-relaxed tracking-wide">
            Alamat: Jl. K.H.R. Asnawi Gang Kerjasan Kudus, Kode Pos: 59315 | Telp: (0291) 4250212
            <br />
            Website: <a href="http://www.qudsiyyah.com" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">www.qudsiyyah.com</a> &bull; Email: <span className="text-[#054032] font-mono">mahadqudsiyah1919@gmail.com</span>
          </p>
        </div>
      </div>

      {/* Styled Double Line Divider (Traditional Indonesian Letterhead / Kop Surat style) */}
      <div className="space-y-0.5 no-print">
        <div className="h-0.75 w-full bg-[#054032]" />
        <div className="h-0.25 w-full bg-[#10b981]" />
      </div>
    </div>
  );
}
