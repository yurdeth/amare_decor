'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  DollarSign,
  Package,
  Calendar,
  Users,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Cotizaciones', href: '/cotizaciones', icon: FileText },
  { name: 'Finanzas', href: '/finanzas', icon: DollarSign },
  { name: 'Inventario', href: '/inventario', icon: Package },
  { name: 'Eventos', href: '/eventos', icon: Calendar },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-secondary/10 backdrop-blur-md border-r border-[#8E977D]/20 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-accent/30">
          {isCollapsed ? (
            <div className="flex items-center justify-center">
              <Image
                src="/logo-new.png"
                alt="Amaré Decor"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Image
                src="/logo-new.png"
                alt="Amaré Decor"
                width={180}
                height={60}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#8E977D] text-white shadow-md'
                    : 'text-primary hover:bg-[#8E977D]/10'
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-accent/30">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-primary hover:bg-accent/30 transition-all duration-300"
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <>
                <span className="text-sm font-medium">Colapsar</span>
                <ChevronUp className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-[#8E977D]/20 z-50 safe-bottom">
        <nav className="flex items-center justify-around py-2 safe-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 min-w-0 flex-1 ${
                  isActive ? 'text-[#8E977D]' : 'text-primary/60 hover:text-[#8E977D]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''} flex-shrink-0`} />
                <span className="text-xs font-medium truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
