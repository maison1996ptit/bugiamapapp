'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Info } from 'lucide-react';

export default function HeatmapPage() {
  const [points, setPoints] = useState<any[]>([]);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "your_google_maps_key",
    libraries: ['visualization'] as any,
  });

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch('/api/reports');
        if (response.ok) {
          const reports = await response.json();
          const heatmapPoints = reports.map((report: any) => {
            if (report.latitude && report.longitude) {
              return new google.maps.LatLng(report.latitude, report.longitude);
            }
            return null;
          }).filter((p: any) => p !== null);
          
          setPoints(heatmapPoints);
        }
      } catch (error) {
        console.error("Error fetching heatmap points:", error);
      }
    };

    if (isLoaded) {
      fetchPoints();
    }
  }, [isLoaded]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-police-green uppercase">Bản đồ nhiệt phản ánh</h1>
          <p className="text-slate-500 text-sm">Trực quan hóa mật độ các vấn đề xã hội trên địa bàn</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="flex gap-1 py-1 px-3">
            <Info className="w-3 h-3" /> {points.length} Điểm dữ liệu
          </Badge>
        </div>
      </div>

      <Card className="flex-grow shadow-sm border-slate-200 overflow-hidden relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: 21.0285, lng: 105.8542 }}
            zoom={13}
          >
            {points.length > 0 && (
              <HeatmapLayer
                data={points}
                options={{
                  radius: 20,
                  opacity: 0.6,
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-police-green border-t-transparent rounded-full animate-spin"></div>
              <p className="font-medium">Đang tải bản đồ...</p>
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg border border-slate-200 z-10 w-48">
          <h4 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
            <Layers className="w-3 h-3" /> Chú giải
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-[10px] text-slate-600">Mật độ cao</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-[10px] text-slate-600">Mật độ trung bình</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-[10px] text-slate-600">Mật độ thấp</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
