'use client';

import React, { useState, useEffect } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  lookupCode: string;
  title: string;
  category: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
}

const columnHelper = createColumnHelper<Report>();

const columns = [
  columnHelper.accessor('lookupCode', {
    header: 'Mã tra cứu',
    cell: info => <span className="font-mono font-bold text-national-red">{info.getValue()}</span>,
  }),
  columnHelper.accessor('title', {
    header: 'Tiêu đề',
    cell: info => <span className="font-medium line-clamp-1">{info.getValue()}</span>,
  }),
  columnHelper.accessor('category', {
    header: 'Danh mục',
    cell: info => <Badge variant="outline" className="capitalize">{info.getValue()}</Badge>,
  }),
  columnHelper.accessor('status', {
    header: 'Trạng thái',
    cell: info => {
      const status = info.getValue();
      const variants: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
        COMPLETED: 'bg-green-100 text-green-800 border-green-200',
        REJECTED: 'bg-red-100 text-red-800 border-red-200',
      };
      const labels: Record<string, string> = {
        PENDING: 'Mới',
        PROCESSING: 'Đang xử lý',
        COMPLETED: 'Hoàn thành',
        REJECTED: 'Từ chối',
      };
      return (
        <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase border", variants[status])}>
          {labels[status]}
        </span>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Ngày gửi',
    cell: info => {
      const date = new Date(info.getValue());
      return <span className="text-slate-500 text-xs">{date.toLocaleDateString('vi-VN')}</span>;
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Thao tác',
    cell: info => (
      <Link href={`/officer/reports/${info.row.original.id}`}> 
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-2" /> Chi tiết
        </Button>
      </Link>
    ),
  }),
];

export default function OfficerReportsPage() {
  const [data, setData] = useState<Report[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/officer/reports');
        if (response.ok) {
          const reportsData = await response.json();
          setData(reportsData);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-police-green uppercase">Danh sách phản ánh</h1>
          <p className="text-slate-500 text-sm">Quản lý và xử lý các phản ánh từ người dân</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Tìm kiếm mã, tiêu đề..." 
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="w-4 h-4" /> Lọc
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-4">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400">
                      Không tìm thấy phản ánh nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
            <div>
              Hiển thị {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} trong tổng số {data.length} phản ánh
            </div>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => table.previousPage()} 
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => table.nextPage()} 
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
