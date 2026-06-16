import React, { useState, useEffect } from 'react';
import { User, Izin, Sarpras, Pembelajaran, Role, normalizeRole } from './types';
import { Database, getLocalStorageData } from './data';

// Import Views
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import IzinView from './components/IzinView';
import SarprasView from './components/SarprasView';
import PembelajaranView from './components/PembelajaranView';
import UserView from './components/UserView';
import TutorialView from './components/TutorialView';
import ProfileCardView from './components/ProfileCardView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Database States
  const [usersList, setUsersList] = useState<User[]>([]);
  const [izinList, setIzinList] = useState<Izin[]>([]);
  const [sarprasList, setSarprasList] = useState<Sarpras[]>([]);
  const [pembelajaranList, setPembelajaranList] = useState<Pembelajaran[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check saved session on mount
  useEffect(() => {
    // Automatically set the new official Web App URL as the active database if not custom-set already
    const existingUrl = localStorage.getItem('pesantren_api_url');
    if (!existingUrl || existingUrl.includes('XXXXXX')) {
      localStorage.setItem('pesantren_api_url', 'https://script.google.com/macros/s/AKfycbzsGpBQ8g5kqCysl-CroUZZbUgdR-P-6xndCJS69HmFyhlLESSXpaZw-5Loah1aUMgx/exec');
    }

    const savedSession = localStorage.getItem('pesantren_active_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed) {
          parsed.role = normalizeRole(parsed.role);
        }
        setCurrentUser(parsed);
      } catch (e) {
        localStorage.removeItem('pesantren_active_session');
      }
    }
    
    // Initial fetch from Local fallback / Sheets
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [users, izins, sarpras, pems] = await Promise.all([
        Database.getUsers(),
        Database.getIzin(),
        Database.getSarpras(),
        Database.getPembelajaran()
      ]);

      setUsersList(users);
      setIzinList(izins);
      setSarprasList(sarpras);
      setPembelajaranList(pems);
    } catch (e) {
      console.error("Gagal melakukan sinkronisasi data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (user: User) => {
    const normalizedUser = { ...user, role: normalizeRole(user.role) };
    setCurrentUser(normalizedUser);
    localStorage.setItem('pesantren_active_session', JSON.stringify(normalizedUser));
    
    // Default active landing tab depending on role
    if (normalizedUser.role === Role.Guru) {
      setActiveTab('pembelajaran');
    } else if (normalizedUser.role === Role.PetugasSarpras) {
      setActiveTab('sarpras');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pesantren_active_session');
  };

  // --- ACTIONS ---

  const handleAddIzin = async (newIzin: Omit<Izin, 'id' | 'status' | 'tanggal'>) => {
    const created = await Database.addIzin(newIzin);
    // Reload state
    setIzinList(prev => [created, ...prev]);
    return created;
  };

  const handleUpdateIzin = async (id: string, updates: Partial<Izin>) => {
    const updated = await Database.updateIzin(id, updates);
    if (updated) {
      setIzinList(prev => prev.map(iz => iz.id === id ? updated : iz));
    }
    return updated;
  };

  const handleDeleteIzin = async (id: string) => {
    const success = await Database.deleteIzin(id);
    if (success) {
      setIzinList(prev => prev.filter(iz => iz.id !== id));
    }
    return success;
  };

  const handleAddSarpras = async (newSarpras: Omit<Sarpras, 'id' | 'status' | 'tanggal'>) => {
    const created = await Database.addSarpras(newSarpras);
    setSarprasList(prev => [created, ...prev]);
    return created;
  };

  const handleUpdateSarpras = async (id: string, updates: Partial<Sarpras>) => {
    const updated = await Database.updateSarpras(id, updates);
    if (updated) {
      setSarprasList(prev => prev.map(sr => sr.id === id ? updated : sr));
    }
    return updated;
  };

  const handleDeleteSarpras = async (id: string) => {
    const success = await Database.deleteSarpras(id);
    if (success) {
      setSarprasList(prev => prev.filter(sr => sr.id !== id));
    }
    return success;
  };

  const handleAddPembelajaran = async (newPem: Omit<Pembelajaran, 'id' | 'tanggal'>) => {
    const created = await Database.addPembelajaran(newPem);
    setPembelajaranList(prev => [created, ...prev]);
    return created;
  };

  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    const created = await Database.addUser(newUser);
    setUsersList(prev => [...prev, created]);
    return created;
  };

  const handleUpdateUserStatus = async (id: string, status: User['status']) => {
    await Database.updateUserStatus(id, status);
    const users = await Database.getUsers();
    setUsersList(users);
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar Navigation Drawer */}
      <Sidebar 
        currentUser={currentUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area panels */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Mini Header Bar (Desktop only) */}
        <header className="hidden md:flex items-center justify-between h-16 bg-white border-b border-slate-100 px-8 shrink-0 no-print">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-550">
            <span>Sistem Terpadu Pondok Pesantren</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 capitalize font-bold">{activeTab.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Quick sync button */}
            <button 
              onClick={loadAllData}
              title="Perbarui Sinkronisasi Data"
              className="p-2 text-slate-400 hover:text-brand-secondary hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5 text-xs text-brand-secondary font-bold font-mono">
                  <svg className="animate-spin h-3.5 w-3.5 text-brand-secondary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sinkron...
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                  🔄 Sinkron dengan Sheet
                </span>
              )}
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-650 bg-slate-100 rounded-md py-1 px-2">
              Server: {localStorage.getItem('pesantren_api_url') ? 'Sheets Live' : 'Sandbox Hijau (Offline)'}
            </span>
          </div>
        </header>

        {/* Content Container Body */}
        <div className="p-4 md:p-8 space-y-6 flex-1 mt-14 md:mt-0">
          
          {isLoading && (
            <div className="p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-semibold animate-pulse flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-brand-secondary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Melakukan pemutakhiran data secara real-time. Mohon tunggu...
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardView 
              currentUser={currentUser}
              izinList={izinList}
              sarprasList={sarprasList}
              pembelajaranList={pembelajaranList}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'profile-card' && (
            <ProfileCardView 
              currentUser={currentUser}
            />
          )}

          {activeTab === 'izin' && (
            <IzinView 
              currentUser={currentUser}
              izinList={izinList}
              onAddIzin={handleAddIzin}
              onUpdateIzin={handleUpdateIzin}
              onDeleteIzin={handleDeleteIzin}
            />
          )}

          {activeTab === 'sarpras' && (
            <SarprasView 
              currentUser={currentUser}
              sarprasList={sarprasList}
              onAddSarpras={handleAddSarpras}
              onUpdateSarpras={handleUpdateSarpras}
              onDeleteSarpras={handleDeleteSarpras}
            />
          )}

          {activeTab === 'pembelajaran' && (
            <PembelajaranView 
              currentUser={currentUser}
              pembelajaranList={pembelajaranList}
              onAddPembelajaran={handleAddPembelajaran}
            />
          )}

          {activeTab === 'users' && currentUser.role === Role.Admin && (
            <UserView 
              currentUser={currentUser}
              usersList={usersList}
              onAddUser={handleAddUser}
              onUpdateUserStatus={handleUpdateUserStatus}
            />
          )}

          {activeTab === 'tutorial' && currentUser.role === Role.Admin && (
            <TutorialView />
          )}

        </div>
      </main>
    </div>
  );
}
