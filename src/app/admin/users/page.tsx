'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, User, Shield, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DEPARTMENT_HEAD' | 'OFFICER' | 'CITIZEN';
  department: string | null;
  createdAt: string;
}

const DEPARTMENTS = [
  'Ban Chỉ huy Công an xã',
  'Tổ Công an phụ trách địa bàn',
  'Tổ Hình sự - Kinh tế - Ma túy',
  'Tổ Quản lý hành chính - TTATGT',
  'Phòng CSGT',
  'Cảnh sát Hình sự',
  'Cảnh sát Cơ động',
  'Khác'
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (id: string, role: string, department: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, department }),
      });

      if (response.ok) {
        toast.success('Cập nhật quyền hạn thành công');
        fetchUsers();
      } else {
        toast.error('Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-police-green uppercase">Quản lý người dùng</h1>
          <p className="text-slate-500 text-sm">Quản lý tài khoản, phân quyền và phòng ban</p>
        </div>
        <Button className="bg-police-green hover:bg-green-800 font-bold uppercase text-xs h-10 shadow-none rounded-xl">
          <UserPlus size={16} className="mr-2" /> Thêm người dùng mới
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Tìm kiếm theo tên, email..." 
            className="pl-10 h-10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Phòng ban / Đơn vị</th>
                  <th className="px-6 py-4">Ngày đăng ký</th>
                  <th className="px-6 py-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                      Đang tải danh sách người dùng...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <UserRow 
                      key={user.id} 
                      user={user} 
                      onUpdate={handleUpdateUser}
                      isUpdating={updatingId === user.id}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserRow({ user, onUpdate, isUpdating }: { user: UserData, onUpdate: any, isUpdating: boolean }) {
  const [role, setRole] = useState(user.role);
  const [dept, setDept] = useState(user.department || '');

  const hasChanged = role !== user.role || dept !== (user.department || '');

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            {user.role === 'ADMIN' ? <Shield size={16} className="text-national-red" /> : <User size={16} />}
          </div>
          <div>
            <p className="font-bold text-slate-700">{user.name || 'N/A'}</p>
            <p className="text-[10px] text-slate-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <select 
          className="text-xs border border-slate-200 rounded p-1 bg-white focus:outline-none focus:ring-1 focus:ring-police-green"
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
        >
          <option value="CITIZEN">Công dân</option>
          <option value="OFFICER">Cán bộ</option>
          <option value="DEPARTMENT_HEAD">Chỉ huy / Trưởng phòng</option>
          <option value="ADMIN">Quản trị viên</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <select 
          className="text-xs border border-slate-200 rounded p-1 bg-white focus:outline-none focus:ring-1 focus:ring-police-green w-48"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        >
          <option value="">-- Chọn đơn vị --</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4 text-[10px] text-slate-500">
        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
      </td>
      <td className="px-6 py-4">
        <Button 
          variant={hasChanged ? "default" : "ghost"} 
          size="sm" 
          className={`h-8 text-[10px] uppercase font-bold ${hasChanged ? 'bg-police-green text-white' : 'text-slate-400'}`}
          onClick={() => hasChanged && onUpdate(user.id, role, dept)}
          disabled={isUpdating || !hasChanged}
        >
          {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} className="mr-1" />}
          Lưu
        </Button>
      </td>
    </tr>
  );
}
