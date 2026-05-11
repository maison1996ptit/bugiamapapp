import React from 'react';
import OfficerSidebar from '@/components/officer/OfficerSidebar';

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden bg-slate-50">
      <OfficerSidebar />
      <main className="flex-grow overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
