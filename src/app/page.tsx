'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  Search, 
  FileText, 
  PhoneCall, 
  ChevronRight,
  Newspaper
} from 'lucide-react';
import { 
  AppSectionHeader, 
  AppActionCard, 
  AppInfoSection,
  AppCard
} from '@/components/ui/common-ui';

export default function HomePage() {
  const router = useRouter();

  const newsItems = [
    {
      id: 1,
      title: "Thông báo về việc cấp căn cước công dân gắn chip tại xã Bù Gia Mập",
      category: "THÔNG BÁO",
      date: "2026-05-10",
      image: "https://images.unsplash.com/photo-1557597774-9d2739f85a76?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Tuyên truyền phòng chống tội phạm công nghệ cao trên địa bàn",
      category: "TIN TỨC",
      date: "2026-05-08",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F8]">
      <main className="flex-grow pb-10">
        {/* Quick Actions Section */}
        <section className="pt-2">
          <AppSectionHeader title="Dịch vụ trực tuyến" />
          <div className="flex overflow-x-auto pb-4 px-4 no-scrollbar scroll-smooth">
            <AppActionCard 
              title={"GỬI PHẢN ÁNH\nHIỆN TRƯỜNG"}
              sub="Báo cáo vi phạm an ninh"
              icon={Camera}
              color="#DA251D" // National Red
              onClick={() => router.push('/reports/new')}
            />
            <AppActionCard 
              title={"TRA CỨU MÃ\nPHẢN ÁNH"}
              sub="Theo dõi kết quả xử lý"
              icon={Search}
              color="#1B5E20" // Police Green
              onClick={() => router.push('/lookup')}
            />
            <AppActionCard 
              title={"THỦ TỤC\nHÀNH CHÍNH"}
              sub="Hướng dẫn hồ sơ online"
              icon={FileText}
              color="#1565C0" // Blue
              onClick={() => alert('Chức năng đang phát triển')}
            />
            <AppActionCard 
              title={"LIÊN HỆ\nKHẨN CẤP"}
              sub="Hỗ trợ trực tuyến 24/7"
              icon={PhoneCall}
              color="#E65100" // Orange[900]
              onClick={() => alert('Chức năng đang phát triển')}
            />
          </div>
        </section>

        {/* News Section */}
        <section className="mt-2">
          <AppSectionHeader 
            title="Tin tức - Thông báo mới" 
            actionLabel="Xem tất cả"
            onActionClick={() => router.push('/news')}
          />
          <div className="px-4 space-y-4 mt-2">
            {newsItems.map((item) => (
              <AppCard key={item.id} className="flex flex-col">
                <div className="h-[150px] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="inline-block px-2 py-1 rounded-[4px] bg-[#1B5E201A] text-police-green text-[10px] font-bold mb-2">
                    {item.category}
                  </div>
                  <h3 className="text-[18px] font-bold leading-tight mb-2 text-[#1A1C1E]">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-[12px] text-[#42474E]">
                    <span className="opacity-60">{item.date}</span>
                  </div>
                </div>
              </AppCard>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <AppInfoSection />
      </main>

      {/* Bottom Navigation for Mobile (Optional, since we have a header, but Flutter has it) */}
      <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-[#E0E2E5] flex items-center justify-around md:hidden">
        <Link href="/" className="flex flex-col items-center justify-center text-police-green">
          <ChevronRight className="w-6 h-6 rotate-[-90deg]" />
          <span className="text-[10px] font-medium mt-1 uppercase">Trang chủ</span>
        </Link>
        <Link href="/news" className="flex flex-col items-center justify-center text-slate-400">
          <Newspaper className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1 uppercase">Tin tức</span>
        </Link>
        <Link href="/documents" className="flex flex-col items-center justify-center text-slate-400">
          <FileText className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1 uppercase">Tài liệu</span>
        </Link>
      </div>
    </div>
  );
}
