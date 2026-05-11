'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const statusData = [
  { name: 'Mới', value: 45, color: '#EAB308' },
  { name: 'Đang xử lý', value: 32, color: '#3B82F6' },
  { name: 'Hoàn thành', value: 85, color: '#22C55E' },
  { name: 'Từ chối', value: 12, color: '#EF4444' },
];

const categoryData = [
  { name: 'Giao thông', count: 64 },
  { name: 'An ninh', count: 42 },
  { name: 'Môi trường', count: 38 },
  { name: 'Khác', count: 21 },
];

const performanceData = [
  { name: 'T.2', reports: 12, completed: 8 },
  { name: 'T.3', reports: 19, completed: 15 },
  { name: 'T.4', reports: 15, completed: 10 },
  { name: 'T.5', reports: 22, completed: 18 },
  { name: 'T.6', reports: 30, completed: 25 },
  { name: 'T.7', reports: 10, completed: 12 },
  { name: 'CN', reports: 8, completed: 5 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-police-green uppercase">Quản trị hệ thống</h1>
        <p className="text-slate-500">Phân tích dữ liệu và giám sát hoạt động</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Tổng phản ánh" 
          value="174" 
          change="+12%" 
          icon={<FileText className="w-6 h-6 text-blue-500" />} 
        />
        <StatsCard 
          title="Đang xử lý" 
          value="32" 
          change="-5%" 
          icon={<AlertTriangle className="w-6 h-6 text-yellow-500" />} 
        />
        <StatsCard 
          title="Đã hoàn thành" 
          value="130" 
          change="+18%" 
          icon={<CheckCircle className="w-6 h-6 text-green-500" />} 
        />
        <StatsCard 
          title="Người dùng mới" 
          value="+42" 
          change="+8%" 
          icon={<Users className="w-6 h-6 text-purple-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart: Status Distribution */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tỷ lệ trạng thái phản ánh</CardTitle>
            <CardDescription>Phân bổ phản ánh theo tình trạng xử lý</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Categories */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Phản ánh theo danh mục</CardTitle>
            <CardDescription>Số lượng phản ánh phân loại theo lĩnh vực</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#1B5E20" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line/Area Chart: Performance Trend */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Hiệu suất xử lý theo tuần</CardTitle>
            <CardDescription>So sánh số lượng tiếp nhận và số lượng hoàn thành</CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
            <TrendingUp className="w-3 h-3 mr-1" /> Tăng 12%
          </Badge>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <RechartsTooltip />
              <Legend />
              <Bar name="Tiếp nhận" dataKey="reports" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar name="Hoàn thành" dataKey="completed" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
            <p className={`text-[10px] font-bold mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} <span className="text-slate-400 font-normal ml-1">so với tháng trước</span>
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-inner">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
