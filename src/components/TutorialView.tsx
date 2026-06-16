import React, { useState } from 'react';
import { 
  Database, HelpCircle, Code, Copy, Check, ExternalLink, 
  Settings, Key, Layers, Terminal, Sparkles, BookOpen 
} from 'lucide-react';

export default function TutorialView() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiUrlInput, setApiUrlInput] = useState(() => localStorage.getItem('pesantren_api_url') || 'https://script.google.com/macros/s/AKfycbzsGpBQ8g5kqCysl-CroUZZbUgdR-P-6xndCJS69HmFyhlLESSXpaZw-5Loah1aUMgx/exec');
  const [isSaved, setIsSaved] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('codegs');

  const handleSaveApi = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pesantren_api_url', apiUrlInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    // Refresh page / alert on sync active
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Google Apps Script Source Code
  const codeGsContent = `/**
 * GOOGLE APPS SCRIPT API - SISTEM TERPADU PONDOK PESANTREN
 * Deploy sebagai Web App dengan Akses "Anyone" (Siapa saja bahkan Anonim)
 */

const SPREADSHEET_ID = "MASUKKAN_ID_SPREADSHEET_ANDA_DI_SINI";

function getSheetByName(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(name);
}

// Handler Request GET
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    if (action === "getUsers") {
      return excelToJsonResponse(fetchData("USERS"));
    } else if (action === "getIzin") {
      return excelToJsonResponse(fetchData("IZIN"));
    } else if (action === "getSarpras") {
      return excelToJsonResponse(fetchData("SARPRAS"));
    } else if (action === "getPembelajaran") {
      return excelToJsonResponse(fetchData("PEMBELAJARAN"));
    }
    
    return errorJsonResponse("Aksi GET tidak valid / tidak dikenal.");
  } catch (err) {
    return errorJsonResponse(err.toString());
  }
}

// Handler Request POST
function doPost(e) {
  // Parsing payload JSON dari request body jika ada
  let postData = {};
  if (e.postData && e.postData.contents) {
    try {
      postData = JSON.parse(e.postData.contents);
    } catch(err) {
      // Abaikan jika tidak valid JSON
    }
  }
  
  // Ambil parameter action dari query string or parsed JSON payload
  const action = e.parameter.action || postData.action;
  
  try {
    if (action === "addUser") {
      return excelToJsonResponse(insertData("USERS", postData));
    } else if (action === "addIzin") {
      return excelToJsonResponse(insertData("IZIN", postData));
    } else if (action === "addSarpras") {
      return excelToJsonResponse(insertData("SARPRAS", postData));
    } else if (action === "addPembelajaran") {
      return excelToJsonResponse(insertData("PEMBELAJARAN", postData));
    } else if (action === "updateIzin") {
      return excelToJsonResponse(updateData("IZIN", postData.id, postData));
    } else if (action === "updateSarpras") {
      return excelToJsonResponse(updateData("SARPRAS", postData.id, postData));
    } else if (action === "updateUser") {
      return excelToJsonResponse(updateData("USERS", postData.id, postData));
    } else if (action === "deleteIzin") {
      const id = e.parameter.id || postData.id;
      return excelToJsonResponse(deleteRowById("IZIN", id));
    } else if (action === "deleteSarpras") {
      const id = e.parameter.id || postData.id;
      return excelToJsonResponse(deleteRowById("SARPRAS", id));
    }
    
    return errorJsonResponse("Aksi POST tidak valid / tidak dikenal.");
  } catch (err) {
    return errorJsonResponse(err.toString());
  }
}

// HELPER: Ambil semua data dari Sheet dan ubah ke array object JSON
function fetchData(sheetName) {
  const sheet = getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = {};
    const cols = data[i];
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = cols[j];
    }
    rows.push(row);
  }
  return rows;
}

// HELPER: Insert baris data baru ke Sheet
function insertData(sheetName, item) {
  const sheet = getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const newRow = [];
  for (let j = 0; j < headers.length; j++) {
    const key = headers[j];
    newRow.push(item[key] !== undefined ? item[key] : "");
  }
  
  sheet.appendRow(newRow);
  return { status: "success", message: "Data berhasil ditambahkan ke " + sheetName };
}

// HELPER: Update status / field baris by ID
function updateData(sheetName, id, updates) {
  const sheet = getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColIdx = headers.indexOf("id");
  
  if (idColIdx === -1) throw new Error("Kolom ID tidak ditemukan di sheet " + sheetName);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColIdx].toString() === id.toString()) {
      // Row found (Aka indeks i + 1 pada spreadsheet fisik)
      const excelRow = i + 1;
      for (let key in updates) {
        if (key === "id") continue;
        const colIdx = headers.indexOf(key);
        if (colIdx !== -1) {
          sheet.getRange(excelRow, colIdx + 1).setValue(updates[key]);
        }
      }
      return { status: "success", message: "Data " + id + " berhasil diperbarui." };
    }
  }
  throw new Error("Data dengan ID " + id + " tidak ditemukan.");
}

// HELPER: Hapus baris data by ID
function deleteRowById(sheetName, id) {
  const sheet = getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColIdx = headers.indexOf("id");
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColIdx].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Arsip ID " + id + " berhasil dihapus." };
    }
  }
  throw new Error("Arsip dengan ID " + id + " tidak terdaftar.");
}

// FORMATTER: Mengembalikan output JSON terstruktur aman CORS
function excelToJsonResponse(data) {
  let outputPayload;
  if (data && data.status) {
    outputPayload = JSON.stringify(data);
  } else {
    outputPayload = JSON.stringify({ status: "success", data: data });
  }
  
  return ContentService.createTextOutput(outputPayload)
    .setMimeType(ContentService.MimeType.JSON);
}

function errorJsonResponse(msg) {
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const configJsContent = `// config.js - Konfigurasi endpoint API Pondok IT
const CONFIG = {
  // Masukkan URL Google Apps Script Web App hasil deploy Anda di sini
  API_URL: "${apiUrlInput || 'HTTPS://SCRIPT.GOOGLE.COM/MACROS/S/XXXXXX/EXEC'}",
  VERSI: "3.5.0",
  LEMBAGA: "Pondok Pesantren Komputer & IT"
};`;

  const apiJsContent = `// api.js - File Service Penanganan Fetch HTTP Request (CORS & JSON Bridge)
const ApiService = {
  // Mengambil Data Pengguna / User
  async getUsers() {
    const response = await fetch(CONFIG.API_URL + "?action=getUsers");
    const res = await response.json();
    return res.data || [];
  },

  // Izin Keluar Santri
  async getIzin() {
    const response = await fetch(CONFIG.API_URL + "?action=getIzin");
    const res = await response.json();
    return res.data || [];
  },

  async addIzin(data) {
    const req = await fetch(CONFIG.API_URL + "?action=addIzin", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return req;
  },

  async updateIzin(id, statusUp) {
    const req = await fetch(CONFIG.API_URL + "?action=updateIzin", {
      method: "POST",
      body: JSON.stringify({ id: id, status: statusUp })
    });
    return req;
  },

  async deleteIzin(id) {
    const req = await fetch(CONFIG.API_URL + "?action=deleteIzin&id=" + id, {
      method: "POST"
    });
    return req;
  },

  // Sarpras
  async getSarpras() {
    const response = await fetch(CONFIG.API_URL + "?action=getSarpras");
    const res = await response.json();
    return res.data || [];
  },

  async addSarpras(data) {
    const req = await fetch(CONFIG.API_URL + "?action=addSarpras", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return req;
  },

  async updateSarpras(id, statusUp) {
    const req = await fetch(CONFIG.API_URL + "?action=updateSarpras", {
      method: "POST",
      body: JSON.stringify({ id: id, status: statusUp })
    });
    return req;
  }
};`;

  const appJsContent = `// app.js - Vanilla JS untuk login session & UI rendering multi-role
document.addEventListener("DOMContentLoaded", () => {
  // Ambil state session dari LocalStorage
  const sessionUser = JSON.parse(localStorage.getItem("active_session"));
  
  if (!sessionUser && window.location.pathname.indexOf("login.html") === -1) {
    window.location.href = "login.html";
    return;
  }
  
  if (sessionUser) {
    document.getElementById("nav-user-name").innerText = sessionUser.nama;
    document.getElementById("nav-user-role").innerText = sessionUser.role;
    
    // Sembunyikan modul berdasarkan hak akses role
    renderAccessControl(sessionUser.role);
  }
});

function renderAccessControl(role) {
  if (role === "Santri") {
    // Dan seterusnya sembunyikan navigasi yang dilarang
    $("#nav-pembelajaran, #nav-users").hide();
  } else if (role === "Guru") {
    $("#nav-izin, #nav-sarpras, #nav-users").hide();
  } else if (role === "Petugas Sarpras") {
    $("#nav-izin, #nav-pembelajaran, #nav-users").hide();
  }
}

function handleLogout() {
  localStorage.removeItem("active_session");
  window.location.href = "login.html";
}`;

  const styleCssContent = `/* style.css - Kustomisasi Bootstrap 5 Modern */
:root {
  --primary-green: #064e3b;
  --secondary-teal: #0f766e;
  --gold-accent: #b45309;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
}

.bg-pesantren-primary {
  background-color: var(--primary-green) !important;
}

.text-pesantren-gold {
  color: #fbbf24 !important;
}

.btn-pesantren {
  background-color: var(--primary-green);
  color: white;
  border-radius: 8px;
}

.btn-pesantren:hover {
  background-color: var(--secondary-teal);
  color: white;
}

.card-dashboard {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: transform 0.2s;
}

.card-dashboard:hover {
  transform: translateY(-4px);
}`;

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">Panduan Integrasi Google Sheet & Kode Sumber</h2>
        <p className="text-xs text-slate-400">Instruksi langkah-demi-langkah menghubungkan antarmuka ini ke basis data spreadsheet Anda sendiri secara gratis</p>
      </div>

      {/* Sync Panel Widget */}
      <div className="p-6 bg-gradient-to-tr from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 shadow-md">
            <Database className="w-5 h-5 text-emerald-950" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-teal-400">Hubungkan Live Database Google Sheets Anda</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sambungkan antarmuka visual ini ke Google Spreadsheet Anda secara interaktif!</p>
          </div>
        </div>

        <form onSubmit={handleSaveApi} className="space-y-3 pt-2">
          <label className="block text-[10px] uppercase font-bold text-slate-400">Script Web App URL (doGet/doPost Endpoint)</label>
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <input
              type="url"
              required
              value={apiUrlInput}
              onChange={(e) => setApiUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbz..._xxxx/exec"
              className="flex-1 bg-slate-910 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 text-xs font-mono font-medium text-slate-100 placeholder-slate-600"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-teal-500 active:bg-teal-600 text-slate-950 text-xs font-bold rounded-xl cursor-pointer shadow-sm hover:scale-[1.02] transition-all shrink-0"
            >
              {isSaved ? 'Berhasil Tersinkron!' : 'Simpan & Sinkronkan'}
            </button>
          </div>
          {apiUrlInput ? (
            <p className="text-[10px] text-green-400 font-bold flex items-center gap-1 mt-1">
              ✨ Status: Sedang tersambung ke URL API Anda! Database saat ini mendengarkan Spreadsheet secara real-time.
            </p>
          ) : (
            <p className="text-[10px] text-yellow-450 font-medium flex items-center gap-1 mt-1">
              💡 Status: Saat ini menggunakan Sandbox Local Storage (Tinggal pasang url di atas untuk online live sync!).
            </p>
          )}
        </form>
      </div>

      {/* Grid of Tutorial Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step Guide List */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-5">
          <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b pb-3">
            <BookOpen className="w-5 h-5 text-brand-primary" />
            Langkah Panduan Setup Serverless
          </h3>

          <div className="space-y-4 text-xs font-medium text-slate-600 leading-relaxed max-h-[500px] overflow-y-auto pr-2">
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-600">Langkah 1</span>
              <h4 className="font-bold text-slate-800">Membuat Google Spreadsheet</h4>
              <p className="text-slate-500">
                1. Buat spreadsheet baru di Google Drive.<br />
                2. Buat 4 nama Sheet (Tab samping bawah) dengan huruf kapital persis:<br />
                &nbsp;&nbsp;&bull; <strong>USERS</strong> (Kolom: <code className="font-mono bg-slate-100 px-1 text-slate-700">id, nama, username, password, role, status</code>)<br />
                &nbsp;&nbsp;&bull; <strong>IZIN</strong> (Kolom: <code className="font-mono bg-slate-100 px-1 text-slate-700">id, tanggal, nama, nis, kelas, kamar, tujuan, alasan, keluar, kembali, noHpwali, status</code>)<br />
                &nbsp;&nbsp;&bull; <strong>SARPRAS</strong> (Kolom: <code className="font-mono bg-slate-100 px-1 text-slate-700">id, tanggal, pelapor, kelas, lokasi, kategori, deskripsi, foto, status</code>)<br />
                &nbsp;&nbsp;&bull; <strong>PEMBELAJARAN</strong> (Kolom: <code className="font-mono bg-slate-100 px-1 text-slate-700">id, tanggal, guru, mapel, kelas, materi, metode, kehadiran, catatan, dokumentasi</code>)
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-50">
              <span className="text-[10px] uppercase font-bold text-amber-600">Langkah 2</span>
              <h4 className="font-bold text-slate-800">Membuat Script Web App (GAS)</h4>
              <p className="text-slate-500">
                1. Di Spreadsheet Anda klik menu <strong>Ekstensi</strong> &rarr; <strong>Apps Script</strong>.<br />
                2. Ganti seluruh isi file <code className="font-mono px-1 bg-slate-50">Code.gs</code> dengan kode di panel sebelah kanan.<br />
                3. Update baris konstanta <code className="font-mono text-slate-800">const SPREADSHEET_ID = "..."</code> dengan ID unik spreadsheet milik Anda (dapat dicopy dari url browser spreadsheet Anda).
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-50">
              <span className="text-[10px] uppercase font-bold text-amber-600">Langkah 3</span>
              <h4 className="font-bold text-slate-800">Deploy sebagai Web App</h4>
              <p className="text-slate-500">
                1. Di halaman Apps Script klik <strong>Terapkan (Deploy)</strong> &rarr; <strong>Penerapan Baru (New Deployment)</strong>.<br />
                2. Pilih jenis penyebaran: <strong>Aplikasi Web (Web App)</strong>.<br />
                3. Beri deskripsi, ubah opsi akses <strong>"Siapa yang memiliki akses (Who has access)"</strong> menjadi <strong>"Siapa saja (Anyone)"</strong>.<br />
                4. Klik <strong>Terapkan</strong>, setujui ijin autentikasi Google akun Anda, lalu salin URL Web App yang disediakan.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-50">
              <span className="text-[10px] uppercase font-bold text-amber-600">Langkah 4</span>
              <h4 className="font-bold text-slate-800">Menghubungkan Frontend ke API</h4>
              <p className="text-slate-500">
                Tempel URL Web App hasil deploy tadi ke form hitam di atas lalu klik "Simpan & Sinkronkan" untuk menghubungkannya secara interaktif!
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-50">
              <span className="text-[10px] uppercase font-bold text-amber-600">Langkah 5</span>
              <h4 className="font-bold text-slate-800">Deploy ke Vercel</h4>
              <p className="text-slate-500">
                Untuk menghosting file-file vanilla statis Anda secara gratis:<br />
                1. Taruh file HTML dan folder asset ke repositori Git (seperti GitHub).<br />
                2. Masuk ke halaman <code className="font-mono text-slate-700 font-bold">vercel.com</code>, import repositori GitHub Anda dan klik <strong>Deploy</strong>. Selesai dalam sekejap!
              </p>
            </div>

          </div>
        </div>

        {/* Source Code Code tab view */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Code className="w-5 h-5 text-amber-605" />
              Kelola & Copy Source Code Lengkap
            </h3>
            
            {/* Horizontal Tabs to toggle different files */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b pb-2">
              {[
                { id: 'codegs', label: 'Code.gs' },
                { id: 'configjs', label: 'config.js' },
                { id: 'apijs', label: 'api.js' },
                { id: 'appjs', label: 'app.js' },
                { id: 'stylecss', label: 'style.css' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCodeTab(tab.id)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                    activeCodeTab === tab.id 
                      ? 'bg-slate-900 text-amber-450 shadow-sm' 
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code viewers box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-hidden relative group max-h-[350px] overflow-y-auto">
              
              <button
                onClick={() => {
                  let copyText = codeGsContent;
                  if (activeCodeTab === 'configjs') copyText = configJsContent;
                  else if (activeCodeTab === 'apijs') copyText = apiJsContent;
                  else if (activeCodeTab === 'appjs') copyText = appJsContent;
                  else if (activeCodeTab === 'stylecss') copyText = styleCssContent;
                  
                  handleCopy(activeCodeTab, copyText);
                }}
                className="absolute top-3 right-3 p-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer z-10 opacity-80 group-hover:opacity-100 transition-opacity"
                title="Salin Kode"
              >
                {copiedId === activeCodeTab ? (
                  <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Tersalin
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <pre className="text-[10px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
                {activeCodeTab === 'codegs' && codeGsContent}
                {activeCodeTab === 'configjs' && configJsContent}
                {activeCodeTab === 'apijs' && apiJsContent}
                {activeCodeTab === 'appjs' && appJsContent}
                {activeCodeTab === 'stylecss' && styleCssContent}
              </pre>
            </div>
          </div>

          <div className="p-4 bg-teal-50/20 border border-teal-100 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-teal-800 block">Struktur Folder Final (Vercel)</span>
            <pre className="text-[10px] font-mono text-slate-600 mt-1">
              {`/
├── index.html         - Antarmuka web utama
├── login.html         - Form login portal
├── dashboard.html     - Statistik & Grafik
├── izin.html          - Kelola Perizinan Santri
├── sarpras.html       - Kelola Pelaporan Ruangan
├── pembelajaran.html  - Jurnal Pembelajaran Guru
├── assets/
│   ├── css/style.css  - Desain & Kustomisasi
│   └── js/app.js      - Logika Navigasi & Session
├── services/
│   └── api.js         - Jaringan request Sheet API
└── config.js          - Konfigurasi URL`}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
}
