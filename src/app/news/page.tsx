'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  publishedAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="container mx-auto px-6 py-10 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-police-green uppercase">Tin tức & Thông báo</h1>
        <p className="text-slate-500 mt-2">Cập nhật những thông tin mới nhất từ Công an xã Bù Gia Mập</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-slate-100 h-80 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <Card className="h-full hover:shadow-xl transition-shadow border-slate-200 overflow-hidden flex flex-col group">
                {item.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                )}
                <CardHeader className="p-5 flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="secondary" className="bg-police-green/10 text-police-green border-none uppercase text-[10px] font-bold">
                      {item.category}
                    </Badge>
                    <div className="flex items-center text-slate-400 text-[10px]">
                      <Calendar size={12} className="mr-1" />
                      {new Date(item.publishedAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-police-green transition-colors line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <p className="text-sm text-slate-500 line-clamp-3 italic">
                    {item.content}
                  </p>
                  <div className="mt-4 flex items-center text-police-green text-xs font-bold uppercase">
                    Xem chi tiết <ChevronRight size={14} className="ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
