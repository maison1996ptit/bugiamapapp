'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MapPin, Camera, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { AppSectionHeader, AppCard } from '@/components/ui/common-ui';
import Link from 'next/link';

const formSchema = z.object({
  description: z.string().min(10, 'Mô tả phải ít nhất 10 ký tự'),
  category: z.string().min(1, 'Vui lòng chọn loại sự việc'),
  address: z.string().min(5, 'Vui lòng nhập địa chỉ'),
  contactInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES = [
  'An ninh trật tự',
  'Giao thông',
  'Môi trường',
  'Tư pháp',
  'Truyền thông',
  'Xây dựng',
  'Hạ tầng',
  'Khác',
];

export default function ReportForm() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState('Chưa lấy vị trí');
  const [isLocating, setIsLocating] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  
  const { data: session } = useSession();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      category: '',
      address: '',
      contactInfo: '',
    }
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "your_google_maps_key",
    libraries: ['visualization'] as any,
  });

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLoc);
          setLocationStatus('Đã xác định vị trí');
          setValue('address', `Tọa độ: ${newLoc.lat.toFixed(5)}, ${newLoc.lng.toFixed(5)} (Bù Gia Mập)`);
          setIsLocating(false);
        },
        () => {
          setLocationStatus('Không lấy được vị trí');
          setIsLocating(false);
          toast.error('Không thể lấy vị trí hiện tại');
        }
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Simulation of report submission
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.description.substring(0, 30) + '...',
          description: data.description,
          category: data.category,
          latitude: location?.lat || 0,
          longitude: location?.lng || 0,
          address: data.address,
          imageUrls: previews, // Mock
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmittedCode(result.lookupCode);
        toast.success('Gửi phản ánh thành công!');
      } else {
        toast.error('Lỗi khi gửi phản ánh: ' + (result.error || 'Lỗi không xác định'));
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Lỗi khi gửi phản ánh: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedCode) {
    return (
      <div className="max-w-md mx-auto py-10">
        <AppCard className="p-8 text-center flex flex-col items-center">
          <div className="text-green-500 mb-6">
            <CheckCircle2 size={64} />
          </div>
          <h2 className="text-[20px] font-[900] text-green-600 uppercase mb-4">GỬI TIN THÀNH CÔNG</h2>
          <p className="text-[14px] text-slate-600 mb-6">
            Cảm ơn bạn đã tin báo. Thông tin của bạn đã được tiếp nhận và đang được xử lý.
          </p>
          <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Mã tra cứu của bạn</p>
            <p className="text-[32px] font-mono font-bold tracking-widest text-national-red">
              {submittedCode}
            </p>
          </div>
          <p className="text-[12px] text-slate-400 mb-8 italic">
            Cán bộ phụ trách sẽ liên hệ với bạn nếu cần thêm thông tin.
          </p>
          <Link href="/" className="w-full block">
            <Button className="w-full h-12 bg-police-green hover:bg-green-800 font-bold rounded-xl">
              ĐÓNG
            </Button>
          </Link>
        </AppCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Nội dung sự việc */}
        <div>
          <AppSectionHeader title="Nội dung sự việc" />
          <AppCard className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-police-green" />
                Loại sự việc
              </Label>
              <select 
                id="category" 
                {...register('category')}
                className="w-full h-12 px-4 rounded-xl border border-[#E0E2E5] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-police-green/20"
              >
                <option value="">-- Chọn loại sự việc --</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-police-green" />
                Mô tả ngắn gọn sự việc
              </Label>
              <textarea 
                id="description" 
                rows={4}
                placeholder="VD: Có tai nạn giao thông, mất trật tự..."
                className="w-full p-4 rounded-xl border border-[#E0E2E5] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-police-green/20"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </AppCard>
        </div>

        {/* Section 2: Vị trí hiện trường */}
        <div>
          <AppSectionHeader title="Vị trí hiện trường" />
          <AppCard className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-national-red" />
                Địa chỉ cụ thể
              </Label>
              <div className="relative">
                <Input 
                  id="address" 
                  placeholder="Nhập địa chỉ hoặc lấy vị trí GPS"
                  {...register('address')}
                  className="pr-12 h-12 rounded-xl border-[#E0E2E5]"
                />
                <button 
                  type="button"
                  onClick={getCurrentLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                >
                  {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                </button>
              </div>
              {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span>Trạng thái GPS:</span>
              <span className={location ? "text-green-600" : "text-orange-500"}>
                {locationStatus}
              </span>
            </div>

            {isLoaded && location && (
              <div className="h-[200px] w-full rounded-xl overflow-hidden border border-[#E0E2E5]">
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={location}
                  zoom={15}
                  onClick={(e) => {
                    if (e.latLng) {
                      const newLoc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                      setLocation(newLoc);
                      setValue('address', `Tọa độ: ${newLoc.lat.toFixed(5)}, ${newLoc.lng.toFixed(5)} (Bù Gia Mập)`);
                    }
                  }}
                >
                  <Marker position={location} />
                </GoogleMap>
              </div>
            )}
          </AppCard>
        </div>

        {/* Section 3: Hình ảnh thực tế */}
        <div>
          <AppSectionHeader title="Hình ảnh thực tế" />
          <AppCard className="p-4">
            <div className="flex flex-wrap gap-3">
              {previews.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E0E2E5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-national-red text-white rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#E0E2E5] bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <Camera className="w-6 h-6 text-slate-400" />
                  <span className="text-[10px] text-slate-400 mt-1">Thêm ảnh</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </AppCard>
        </div>

        {!session && (
          <div>
            <AppSectionHeader title="Thông tin liên hệ bắt buộc" />
            <AppCard className="p-4">
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Số điện thoại / Họ tên</Label>
                <Input 
                  id="contactInfo" 
                  placeholder="Để cán bộ liên hệ khi cần thiết"
                  {...register('contactInfo')}
                  className="h-12 rounded-xl border-[#E0E2E5]"
                />
              </div>
            </AppCard>
          </div>
        )}

        <div className="pt-6">
          <Button 
            type="submit" 
            className="w-full h-14 bg-national-red hover:bg-red-700 text-white font-[900] text-[16px] rounded-[12px] shadow-none uppercase" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ĐANG GỬI...
              </>
            ) : (
              'GỬI TIN BÁO TIN NGAY'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
