import React from 'react';
import OfficerSidebar from '@/components/officer/OfficerSidebar'; // Reuse or customize

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // For now reusing the same sidebar structure but could be customized for Admin
  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden bg-slate-50">
      <OfficerSidebar /> 
      <main className="flex-grow overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
