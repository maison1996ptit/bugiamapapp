'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="flex flex-col w-full shadow-lg">
      {/* 1. Official Government Header (90px height) */}
      <div className="relative w-full h-[90px] bg-gradient-to-b from-[#DA251D] to-[#7B0000] border-b-[3px] border-[#FFD600] overflow-hidden">
        {/* Background Watermark Icon */}
        <div className="absolute -right-5 -top-2 opacity-10">
          <ShieldCheck size={120} className="text-white" />
        </div>

        {/* Logo (Fixed 75x75 at 20px left, 7.5px top) */}
        <div className="absolute left-3 sm:left-5 top-[15px] sm:top-[7.5px] w-[60px] h-[60px] sm:w-[75px] sm:h-[75px] z-20">
          <Image 
            src="/logo.png" 
            alt="Logo Công An" 
            fill
            sizes="(max-width: 640px) 60px, 75px"
            className="object-contain"
          />
        </div>

        {/* Identity Text (At 100px left) */}
        <div className="absolute left-[85px] sm:left-[110px] top-0 bottom-0 flex flex-col justify-center text-white select-none">
  <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.5px] sm:tracking-[1px] leading-tight">BỘ CÔNG AN</span>
  <span className="text-[8px] sm:text-[9px] font-[900] text-[#FFD600] leading-tight uppercase truncate max-w-[180px] sm:max-w-none">Công an Thành phố Đồng Nai</span>
  <div className="h-0.5" />
  <span className="text-[9px] sm:text-[11px] font-medium leading-tight">CÔNG AN XÃ</span>
  <span className="text-[16px] sm:text-[20px] font-[900] leading-[0.9] tracking-[-0.5px]">BÙ GIA MẬP</span>
  <div className="h-0.5" />
  <span className="text-[6px] sm:text-[7px] font-[800] text-[#FFD600] tracking-[0.5px] sm:tracking-[0.8px]">VÌ NHÂN DÂN PHỤC VỤ</span>
</div>

      </div>

      {/* 2. Secondary Navigation Bar (50px height) */}
      <div className="w-full h-[50px] bg-white border-b border-[#E0E2E5] px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 h-full">
          <Link href="/" className="text-sm font-bold text-police-green border-b-2 border-police-green h-full flex items-center px-2">
            TRANG CHỦ
          </Link>
          <div className="hidden md:flex items-center space-x-6 h-full">
            <Link href="/news" className="text-sm font-medium text-slate-600 hover:text-police-green transition-colors h-full flex items-center px-2">
              TIN TỨC
            </Link>
            <Link href="/documents" className="text-sm font-medium text-slate-600 hover:text-police-green transition-colors h-full flex items-center px-2">
              TÀI LIỆU
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {session ? (
            <div className="flex items-center gap-3">
              <NotificationCenter />
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
                {session.user?.name}
              </span>
              {(session.user as any).role === 'OFFICER' || (session.user as any).role === 'ADMIN' || (session.user as any).role === 'DEPARTMENT_HEAD' ? (
                <Link href={(session.user as any).role === 'ADMIN' ? "/admin" : "/officer"}>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-police-green text-police-green">
                    <LayoutDashboard className="w-3 h-3 mr-1" />
                    DASHBOARD
                  </Button>
                </Link>
              ) : null}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="h-8 text-[10px] font-bold text-national-red hover:bg-red-50"
              >
                <LogOut className="w-3 h-3 mr-1" />
                ĐĂNG XUẤT
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-police-green hover:bg-green-50">
                <LogIn className="w-3 h-3 mr-1" />
                ĐĂNG NHẬP
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
