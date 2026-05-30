'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, Bell, LogOut, Download } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { DataBackup } from '@/components/DataBackup';

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBackupMenu, setShowBackupMenu] = useState(false);

  // Cerrar menús cuando se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileMenu(false);
      setShowBackupMenu(false);
    };

    if (showProfileMenu || showBackupMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showProfileMenu, showBackupMenu]);

  const getPageTitle = () => {
    if (title) return title;

    const titles: { [key: string]: string } = {
      '/': 'Dashboard',
      '/finanzas': 'Finanzas',
      '/inventario': 'Inventario',
      '/eventos': 'Eventos',
      '/clientes': 'Clientes',
      '/reportes': 'Reportes',
    };

    return titles[pathname] || 'Amaré Decor';
  };

  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return null;

    return (
      <div className="flex items-center gap-2 text-sm text-primary/70">
        <span className="font-medium">Inicio</span>
        <span>/</span>
        <span className="text-primary">{getPageTitle()}</span>
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    setShowProfileMenu(false);
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      admin: 'Administrador',
      editor: 'Editor',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: 'bg-primary/20 text-primary',
      editor: 'bg-[#8E977D]/20 text-[#8E977D]',
    };
    return colors[role] || 'bg-gray-200 text-gray-700';
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-accent/30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left: Logo, Title and Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <div className="hidden sm:block">
            <Image
              src="/logo-new.png"
              alt="Amaré Decor"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-display font-semibold text-primary truncate">
              {getPageTitle()}
            </h1>
            {getBreadcrumb()}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Data Backup */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBackupMenu(!showBackupMenu);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-full hover:bg-accent/20 transition-colors duration-200"
              title="Backup de datos"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </button>

            {/* Backup Dropdown */}
            {showBackupMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-secondary/20 backdrop-blur-sm rounded-xl shadow-lg border border-[#8E977D]/20 overflow-hidden fade-in z-50">
                <div className="p-2">
                  <DataBackup />
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-accent/20 transition-colors duration-200">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-[#8E977D]/20 hover:bg-[#8E977D]/10 rounded-lg px-2 sm:px-3 py-2 transition-all duration-200"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-primary truncate max-w-[150px]">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-primary/60">{getRoleLabel(user?.role || '')}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#8E977D] to-primary flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-secondary/20 backdrop-blur-sm rounded-xl shadow-lg border border-[#8E977D]/20 overflow-hidden fade-in">
                <div className="p-4 border-b border-[#8E977D]/10">
                  <p className="text-sm font-medium text-primary truncate">{user?.name}</p>
                  <p className="text-xs text-primary/60 truncate">{user?.email}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-lg ${getRoleColor(user?.role || '')}`}>
                      {getRoleLabel(user?.role || '')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-[#8E977D]/10 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="h-1 bg-gradient-to-r from-primary via-[#8E977D] to-accent"></div>
    </header>
  );
}
