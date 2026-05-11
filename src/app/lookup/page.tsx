'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function LookupPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch(`/api/reports?code=${code.toUpperCase()}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setReport(data);
        } else {
          setReport(null);
          toast.error('Không tìm thấy phản ánh với mã này');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống khi tra cứu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl min-h-[600px]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-police-green uppercase mb-2">Tra cứu phản ánh</h1>
        <p className="text-slate-500">Nhập mã tra cứu để theo dõi tiến độ xử lý phản ánh của bạn</p>
      </div>

      <Card className="shadow-lg border-slate-200 mb-10 overflow-hidden">
        <CardContent className="p-6 bg-slate-50 border-b">
          <form onSubmit={handleLookup} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="NHẬP MÃ TRA CỨU (VD: GT123456)" 
                className="pl-12 h-14 text-lg font-mono font-bold tracking-widest uppercase rounded-xl border-slate-200"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={8}
              />
            </div>
            <Button 
              type="submit" 
              className="h-14 px-8 bg-police-green hover:bg-green-800 font-bold rounded-xl uppercase shadow-none"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : 'TRA CỨU'}
            </Button>
          </form>
        </CardContent>

        {searched && !loading && (
          <CardContent className="p-0 animate-in fade-in slide-in-from-top-4 duration-500">
            {report ? (
              <div className="p-8 space-y-8">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{report.title}</h2>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar size={14} /> Gửi ngày: {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <Badge className={cn(
                    "text-xs px-4 py-1.5 uppercase font-bold rounded-full",
                    report.status === 'PENDING' ? 'bg-yellow-500' : 
                    report.status === 'PROCESSING' ? 'bg-blue-500' : 
                    report.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'
                  )}>
                    {report.status === 'PENDING' ? 'Đã tiếp nhận' : 
                     report.status === 'PROCESSING' ? 'Đang xử lý' : 
                     report.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Từ chối'}
                  </Badge>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông tin chi tiết</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start">
                        <MapPin className="text-national-red w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-500">Vị trí hiện trường</p>
                          <p className="text-sm text-slate-700">{report.address || 'Không xác định'}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-sm text-slate-600">
                        "{report.description}"
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiến độ xử lý</h3>
                    <div className="relative border-l-2 border-slate-100 ml-2 pl-6 space-y-6">
                      {report.auditLogs && report.auditLogs.length > 0 ? (
                        report.auditLogs.map((log: any, i: number) => (
                          <div key={i} className="relative">
                            <div className={cn(
                              "absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm",
                              i === 0 ? "bg-police-green scale-125" : "bg-slate-300"
                            )} />
                            <p className="text-xs font-bold text-slate-700">{log.action}</p>
                            <p className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleString('vi-VN')}</p>
                            {log.note && <p className="text-[11px] text-slate-600 mt-1 italic">"{log.note}"</p>}
                          </div>
                        ))
                      ) : (
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                          <p className="text-xs font-bold text-slate-700">Hồ sơ đã được tiếp nhận</p>
                          <p className="text-[10px] text-slate-400">{new Date(report.createdAt).toLocaleString('vi-VN')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {report.feedback && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <h4 className="text-xs font-bold text-green-700 uppercase mb-1">Kết quả từ cán bộ</h4>
                    <p className="text-sm text-green-800">{report.feedback}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 uppercase">Không tìm thấy phản ánh</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">
                  Vui lòng kiểm tra lại mã tra cứu của bạn. Mã thường gồm 8 ký tự (ví dụ: GT123456)
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6 border-slate-200"
                  onClick={() => setSearched(false)}
                >
                  Thử lại
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
        <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
          <CheckCircle2 size={16} /> Lưu ý cho người dân
        </h4>
        <ul className="text-xs text-blue-700/80 space-y-2 list-disc ml-4">
          <li>Mã tra cứu được cung cấp ngay sau khi bạn gửi phản ánh thành công.</li>
          <li>Thời gian xử lý thông thường từ 1-3 ngày làm việc tùy vào mức độ sự việc.</li>
          <li>Bạn sẽ nhận được thông báo in-app nếu đã đăng ký tài khoản và đăng nhập.</li>
        </ul>
      </div>
    </div>
  );
}
