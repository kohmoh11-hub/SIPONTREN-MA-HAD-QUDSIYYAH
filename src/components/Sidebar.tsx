import React, { useState } from 'react';
import { 
  Menu, X, LayoutDashboard, FileCheck, BookOpen, 
  Users, HelpCircle, LogOut, UserCheck, CheckCircle,
  CreditCard
} from 'lucide-react';
import { User, Role } from '../types';
import { QudsiyyahCrest } from './InstitutionHeader';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentUser, activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { id: 'dashboard', label: 'Dasbor Utama', icon: LayoutDashboard, roles: [Role.Admin, Role.Pengasuh, Role.Musyrif, Role.Guru, Role.PetugasSarpras, Role.Santri] },
    { id: 'profile-card', label: 'Kartu Anggota', icon: CreditCard, roles: [Role.Admin, Role.Pengasuh, Role.Musyrif, Role.Guru, Role.PetugasSarpras, Role.Santri] },
    { id: 'izin', label: 'Izin Keluar Santri', icon: FileCheck, roles: [Role.Admin, Role.Pengasuh, Role.Musyrif, Role.Guru, Role.PetugasSarpras, Role.Santri] },
    { id: 'sarpras', label: 'Kerusakan Sarpras', icon: CheckCircle, roles: [Role.Admin, Role.Pengasuh, Role.Musyrif, Role.Guru, Role.PetugasSarpras] },
    { id: 'pembelajaran', label: 'Jurnal & Nilai Belajar', icon: BookOpen, roles: [Role.Admin, Role.Pengasuh, Role.Musyrif, Role.Guru, Role.PetugasSarpras, Role.Santri] },
    { id: 'users', label: 'Kelola Akun Sistem', icon: Users, roles: [Role.Admin] },
    { id: 'tutorial', label: 'Integrasi Google Sheet', icon: HelpCircle, roles: [Role.Admin, Role.Pengasuh, Role.Musyrif, Role.Guru, Role.PetugasSarpras, Role.Santri] },
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.map(r => r.toLowerCase()).includes(currentUser.role?.toLowerCase())
  );

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="md:hidden w-full h-16 bg-brand-primary text-white flex items-center justify-between px-4 fixed top-0 left-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-0.5 bg-white rounded-lg shrink-0 flex items-center justify-center">
            <QudsiyyahCrest className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xs tracking-wider uppercase text-amber-400 leading-tight">SIPONTREN</span>
            <span className="text-[9px] text-emerald-250 font-bold leading-none uppercase">Qudsiyyah Kudus</span>
          </div>
        </div>
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-emerald-900 rounded-lg cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          onClick={toggleSidebar} 
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
        />
      )}

      {/* Navigation Sidebar Box */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-brand-primary text-emerald-50 flex flex-col justify-between z-45 border-r border-[#043e2e] transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        pt-16 md:pt-0 shrink-0
      `}>
        <div>
          {/* Main Logo Header (Desktop) */}
          <div className="hidden md:flex items-center gap-3.5 px-6 py-6 border-b border-[#043e2e]">
            <div className="bg-white/95 p-1.5 rounded-xl shadow-md shrink-0 flex items-center justify-center">
              <QudsiyyahCrest className="w-10 h-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-[#FCD34D] text-sm tracking-widest leading-none uppercase">SIPONTREN</span>
              <span className="text-[10px] text-emerald-100 font-bold tracking-tight mt-1 leading-none uppercase">MA'HAD QUDSIYYAH</span>
            </div>
          </div>

          {/* Logged in Identity Card */}
          <div className="mx-4 my-6 p-4 rounded-xl bg-[#054032]/60 border border-emerald-800/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-secondary text-white flex items-center justify-center font-bold text-sm shadow-md uppercase">
                {currentUser.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-semibold truncate text-emerald-100">{currentUser.nama}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">{currentUser.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items Loop */}
          <nav className="px-3 space-y-1.5">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`
                    w-full px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-amber-500 text-emerald-950 shadow-md font-bold' 
                      : 'text-emerald-100 hover:bg-[#065f46]/60 hover:text-white'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-950' : 'text-emerald-200 group-hover:text-white'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quit Sign Out Footer */}
        <div className="p-4 border-t border-[#043e2e]">
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 rounded-xl bg-[#601a1a]/50 hover:bg-[#7a1f1f]/50 border border-red-900/60 text-red-200 hover:text-red-100 text-sm font-semibold flex items-center gap-3 cursor-pointer transition-all"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            Keluar Aplikasi
          </button>
        </div>
      </aside>
    </>
  );
}
