'use client';

import React from 'react';
import ReportForm from '@/components/reports/ReportForm';

export default function NewReportPage() {
  return (
    <div className="bg-[#F4F6F8] min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <ReportForm />
      </div>
    </div>
  );
}
