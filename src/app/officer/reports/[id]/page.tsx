'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "your_google_maps_key",
    libraries: ['visualization'] as any,
  });

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/officer/reports/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReport(data);
        } else {
          toast.error('Không tìm thấy phản ánh');
          router.push('/officer/reports');
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, router]);

  const updateStatus = async (status: string) => {
    if (!feedback) {
      toast.error('Vui lòng nhập phản hồi xử lý');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/officer/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedback }),
      });

      if (response.ok) {
        const updatedReport = await response.json();
        setReport(updatedReport);
        toast.success('Cập nhật trạng thái thành công');
        setFeedback('');
        // Refresh to get full data with include
        router.refresh();
      } else {
        toast.error('Lỗi khi cập nhật');
      }
    } catch (error: any) {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải chi tiết phản ánh...</div>;
  if (!report) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5 mr-1" /> Quay lại
        </Button>
        <h1 className="text-2xl font-bold text-police-green">CHI TIẾT PHẢN ÁNH #{report.lookupCode}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Images */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-police-green">{report.title}</CardTitle>
                <Badge className={cn(
                  "uppercase text-[10px] font-bold px-3 py-1",
                  report.status === 'PENDING' ? 'bg-yellow-500' : 
                  report.status === 'PROCESSING' ? 'bg-blue-500' : 
                  report.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'
                )}>
                  {report.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" /> 
                  <span>Gửi ngày: {new Date(report.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4" /> 
                  <span>Người gửi: {report.reporter?.name || 'Ẩn danh'}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-500 uppercase text-[10px] font-bold">Nội dung phản ánh</Label>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 italic">
                  "{report.description}"
                </p>
              </div>

              {report.images && report.images.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-slate-500 uppercase text-[10px] font-bold">Hình ảnh hiện trường</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {report.images.map((img: any, i: number) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden border border-slate-200">
                        <img src={img.url} alt={`Evidence ${i}`} className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Process Section */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-police-green" /> Xử lý phản ánh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Nội dung phản hồi / Chỉ đạo</Label>
                <textarea 
                  id="feedback" 
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Nhập nội dung phản hồi cho người dân hoặc ghi chú nội bộ..."
                  className="w-full p-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => updateStatus('REJECTED')}
                disabled={isUpdating}
              >
                <XCircle className="w-4 h-4 mr-2" /> Từ chối
              </Button>
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => updateStatus('PROCESSING')}
                disabled={isUpdating}
              >
                <Clock className="w-4 h-4 mr-2" /> Đang xử lý
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => updateStatus('COMPLETED')}
                disabled={isUpdating}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Hoàn thành
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Map & History */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4 text-national-red" /> Vị trí sự việc
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[250px] w-full">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: report.latitude, lng: report.longitude }}
                    zoom={16}
                    options={{ disableDefaultUI: true }}
                  >
                    <Marker position={{ lat: report.latitude, lng: report.longitude }} />
                  </GoogleMap>
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-100">Đang tải bản đồ...</div>
                )}
              </div>
              <div className="p-4 text-xs text-slate-500">
                Tọa độ: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Lịch sử xử lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.auditLogs && report.auditLogs.length > 0 ? (
                <div className="relative border-l-2 border-slate-100 ml-2 pl-6 space-y-6">
                  {report.auditLogs.map((log: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white shadow-sm" />
                      <p className="text-xs font-bold text-slate-700">{log.action}</p>
                      <p className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleString('vi-VN')}</p>
                      {log.note && <p className="text-[11px] text-slate-600 mt-1 italic">"{log.note}"</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có lịch sử xử lý</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
