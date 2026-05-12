'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
      } else {
        toast.success('Đăng nhập thành công!');
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Official Logo with clean circular treatment */}
        <div className="p-2 bg-white rounded-full shadow-[0_0_15px_3px_rgba(0,0,0,0.1)] mb-6 z-10">
          <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Logo Công An" 
              fill
              sizes="100px"
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="text-[20px] font-bold text-police-green tracking-[1.0px] uppercase mb-2 text-center">
          ĐĂNG NHẬP HỆ THỐNG
        </h1>
        <p className="text-[14px] text-slate-500 mb-10">
          Vui lòng đăng nhập để tiếp tục
        </p>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
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

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-14 bg-police-green hover:bg-green-800 text-white font-bold text-[16px] rounded-[12px] shadow-none"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ĐANG ĐĂNG NHẬP...
                </>
              ) : (
                'ĐĂNG NHẬP'
              )}
            </Button>
          </div>

          <div className="text-center pt-4">
            <Link 
              href="/register" 
              className="text-[14px] text-police-green font-medium hover:underline"
            >
              Chưa có tài khoản? Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
