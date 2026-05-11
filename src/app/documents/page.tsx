'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Search, FileDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents');
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    doc.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-police-green uppercase">Tài liệu & Biểu mẫu</h1>
          <p className="text-slate-500 mt-2">Tải về các biểu mẫu hướng dẫn và văn bản pháp luật</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Tìm kiếm tài liệu..." 
            className="pl-10 h-11 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-2xl" />
          ))}
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="hover:border-police-green/30 transition-colors border-slate-200 shadow-none overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex items-center p-5">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-national-red mr-5 shrink-0 group-hover:bg-red-100 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-[16px] text-slate-800 line-clamp-1 group-hover:text-police-green transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center">
                      <span className="truncate">{doc.fileName}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}</span>
                    </p>
                  </div>
                  <div className="ml-4 shrink-0">
                    <a href={doc.fileUrl} download>
                      <Button 
                        variant="outline" 
                        className="border-slate-200 text-slate-600 hover:text-police-green hover:border-police-green rounded-xl h-10 px-4"
                      >
                        <Download size={16} className="mr-2" />
                        Tải về
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center">
          <FileDown size={48} className="text-slate-200 mb-4" />
          <p className="text-slate-400">Không tìm thấy tài liệu nào phù hợp</p>
        </div>
      )}
    </div>
  );
}
