'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Map as MapIcon, 
  Users, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';

const officerItems = [
  { icon: LayoutDashboard, label: 'Tổng quan Cán bộ', href: '/officer' },
  { icon: ClipboardList, label: 'Danh sách phản ánh', href: '/officer/reports' },
  { icon: MapIcon, label: 'Bản đồ nhiệt', href: '/officer/heatmap' },
];

const adminItems = [
  { icon: LayoutDashboard, label: 'Tổng quan Admin', href: '/admin' },
  { icon: Users, label: 'Quản lý người dùng', href: '/admin/users' },
  { icon: ClipboardList, label: 'Thống kê hệ thống', href: '/admin/stats' },
];

export default function OfficerSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const isDeptHead = (session?.user as any)?.role === 'DEPARTMENT_HEAD';
  const sidebarItems = isAdmin || isDeptHead ? [...adminItems, ...officerItems] : officerItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-100 bg-police-green text-white">
        <h2 className="font-bold uppercase tracking-wider text-sm">
          {isAdmin ? 'Quản trị viên' : isDeptHead ? 'Chỉ huy đơn vị' : 'Cán bộ xử lý'}
        </h2>
        <p className="text-[10px] opacity-75 mt-1 uppercase">
          {isAdmin ? 'Hệ thống Bù Gia Mập' : (session?.user as any)?.department || 'Đơn vị nghiệp vụ'}
        </p>
      </div>
      
      <nav className="flex-grow py-6 px-3 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors group",
                isActive 
                  ? "bg-police-green/10 text-police-green" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-police-green"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-police-green" : "text-slate-400 group-hover:text-police-green")} />
                {item.label}
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
