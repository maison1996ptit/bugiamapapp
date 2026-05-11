'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Phone, IdCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cccd, setCccd] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cccd.length !== 12) {
      toast.error('Số CCCD phải đủ 12 chữ số');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phoneNumber, cccd }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Đăng ký tài khoản thành công!');
        router.push('/login');
      } else {
        toast.error('Đăng ký thất bại: ' + (data.error || 'Lỗi không xác định'));
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Đăng ký thất bại: Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white pb-20">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleRegister} className="space-y-8">
          {/* Section 1: Personal Info */}
          <div>
            <h2 className="text-[13px] font-[900] text-police-green uppercase mb-6">
              THÔNG TIN CÁ NHÂN
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                  </div>
                  <Input 
                    id="name" 
                    placeholder="Nguyễn Văn A" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cccd">Số CCCD (12 chữ số)</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <IdCard size={18} />
                    </div>
                    <Input 
                      id="cccd" 
                      placeholder="012345678901" 
                      value={cccd}
                      onChange={(e) => setCccd(e.target.value)}
                      maxLength={12}
                      className="pl-10 h-12"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone size={18} />
                    </div>
                    <Input 
                      id="phone" 
                      placeholder="0987654321" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 h-12"
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Account Info */}
          <div>
            <h2 className="text-[13px] font-[900] text-police-green uppercase mb-6">
              THÔNG TIN TÀI KHOẢN
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email đăng nhập</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full h-14 bg-police-green hover:bg-green-800 text-white font-bold text-[16px] rounded-[12px] shadow-none uppercase" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ĐANG XỬ LÝ...
                </>
              ) : (
                'ĐĂNG KÝ TÀI KHOẢN'
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-police-green font-bold hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
