'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Map as MapIcon,
  Megaphone,
  FilePlus,
  IdCard,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function OfficerDashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
            <IdCard size={32} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Đơn vị: {(session?.user as any)?.department || 'Chưa gán'}
            </p>
            <h1 className="text-2xl font-black text-police-green uppercase tracking-tight">
              {session?.user?.name || 'Cán bộ xử lý'}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/officer/reports">
            <Button variant="outline" className="border-police-green text-police-green hover:bg-green-50 text-xs font-bold h-10 px-6 uppercase rounded-xl">
              Danh sách xử lý
            </Button>
          </Link>
        </div>
      </div>

      {/* Professional Tools Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
          <span className="w-8 h-[1px] bg-slate-200" /> Công cụ nghiệp vụ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard 
            title="ĐĂNG BẢN TIN" 
            sub="Thông báo phòng ban & địa bàn" 
            icon={<Megaphone className="w-6 h-6" />}
            color="bg-purple-500"
            onClick={() => toast.info('Chức năng đang được tích hợp')}
          />
          <ToolCard 
            title="TẢI LÊN TÀI LIỆU" 
            sub="Biểu mẫu hướng dẫn nghiệp vụ" 
            icon={<FilePlus className="w-6 h-6" />}
            color="bg-teal-500"
            onClick={() => toast.info('Chức năng đang được tích hợp')}
          />
          <ToolCard 
            title="TRA CỨU CCCD" 
            sub="Xác minh thông tin công dân" 
            icon={<IdCard className="w-6 h-6" />}
            color="bg-blue-500"
            onClick={() => toast.info('Chức năng đang được tích hợp')}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Đang xử lý" 
          value="12" 
          icon={<Clock className="w-5 h-5 text-blue-500" />} 
          description="Cần giải quyết ngay"
        />
        <StatsCard 
          title="Hoàn thành tháng này" 
          value="24" 
          icon={<CheckCircle className="w-5 h-5 text-green-500" />} 
          description="+4 so với tháng trước"
        />
        <StatsCard 
          title="Phản ánh mới" 
          value="8" 
          icon={<AlertTriangle className="w-5 h-5 text-yellow-500" />} 
          description="Trong 24 giờ qua"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg">Phản ánh mới nhất</CardTitle>
            <CardDescription>Các vụ việc vừa được phân công cho bạn</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-police-green transition-colors">Vụ việc #{1234 + i}</p>
                      <p className="text-xs text-slate-500">Tai nạn giao thông - Đường tỉnh 741</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] uppercase font-bold px-2 py-0.5">
                    Mới
                  </Badge>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Link href="/officer/reports">
                <Button variant="ghost" className="w-full text-xs text-slate-500 hover:text-police-green font-bold">
                  XEM TẤT CẢ PHẢN ÁNH
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 bg-police-green text-white overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <MapIcon size={120} />
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-white">Bản đồ nghiệp vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-xs opacity-90 leading-relaxed">Theo dõi các điểm nóng về an ninh trật tự trên địa bàn xã Bù Gia Mập.</p>
              <Link href="/officer/heatmap" className="block">
                <Button className="w-full bg-white text-police-green hover:bg-slate-100 font-bold text-xs h-11 uppercase shadow-md rounded-xl border-none">
                  <MapIcon size={16} className="mr-2" /> Mở bản đồ nhiệt
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Hiệu suất đơn vị</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-800">85%</span>
                <span className="text-xs text-green-600 font-bold mb-1 flex items-center">
                  <TrendingUp size={12} className="mr-1" /> +5%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Tỷ lệ hoàn thành đúng hạn trong tháng này.</p>
              <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-police-green h-full transition-all duration-1000" style={{ width: '85%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ title, sub, icon, color, onClick }: any) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all border-slate-200 group"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className={`w-16 h-16 flex items-center justify-center text-white ${color} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-[13px] text-slate-800 tracking-tight leading-none">{title}</h3>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">{sub}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) {
  return (
    <Card className="shadow-sm border-slate-200 hover:border-blue-200 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-blue-600">
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-800">{value}</h3>
              <span className="text-[10px] text-slate-400 font-medium">{description}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
