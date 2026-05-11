'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export const AppCard = ({ 
  children, 
  className, 
  onClick 
}: { 
  children: React.ReactNode, 
  className?: string,
  onClick?: () => void
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white rounded-[20px] border border-[#E0E2E5] shadow-[0_4px_10px_rgba(0,0,0,0.03)] overflow-hidden",
        onClick && "cursor-pointer hover:bg-slate-50 transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
};

export const AppSectionHeader = ({ 
  title, 
  actionLabel, 
  onActionClick 
}: { 
  title: string, 
  actionLabel?: string, 
  onActionClick?: () => void 
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 mt-4">
      <h2 className="text-[12px] font-[900] uppercase tracking-[0.8px] text-[#42474E]">
        {title}
      </h2>
      {actionLabel && (
        <button 
          onClick={onActionClick}
          className="text-[12px] font-bold text-police-green hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const AppActionCard = ({ 
  title, 
  sub, 
  icon: Icon, 
  color, 
  onClick 
}: { 
  title: string, 
  sub: string, 
  icon: LucideIcon, 
  color: string,
  onClick: () => void
}) => {
  return (
    <div className="w-[320px] flex-shrink-0 pr-3">
      <AppCard 
        onClick={onClick}
        className="p-4 flex items-center h-full rounded-[16px]"
      >
        <div 
          className="p-2.5 rounded-[12px] mr-3"
          style={{ backgroundColor: `${color}1A` }} // 1A is ~10% opacity in hex
        >
          <Icon size={28} style={{ color }} />
        </div>
        <div className="flex flex-col justify-center overflow-hidden">
          <h3 
            className="text-[13px] font-[900] leading-[1.1]"
            style={{ color }}
          >
            {title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h3>
          <p className="text-[10px] text-[#42474E] leading-[1.1] mt-0.5 truncate">
            {sub}
          </p>
        </div>
      </AppCard>
    </div>
  );
};

export const AppInfoSection = () => {
  return (
    <div className="mx-4 my-6 p-5 bg-white rounded-[20px] border border-[#E0E2E5] flex flex-col items-center text-center">
      <div className="text-police-green mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      </div>
      <p className="text-[13px] leading-[1.5] text-slate-700 max-w-xs">
        Hệ thống tiếp nhận phản ánh kiến nghị của nhân dân tại địa bàn xã Bù Gia Mập.
      </p>
      <p className="text-[12px] font-bold italic text-police-green mt-2">
        Phục vụ nhân dân là trách nhiệm và vinh dự!
      </p>
    </div>
  );
};
