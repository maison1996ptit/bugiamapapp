'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // 1. Mark as read if it's not
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // 2. Navigate if there's a relatedId
    if (notification.relatedId) {
      const userRole = (session?.user as any)?.role;
      
      if (userRole === 'OFFICER' || userRole === 'ADMIN' || userRole === 'DEPARTMENT_HEAD') {
        // If it's a staff member, go to the officer management detail
        router.push(`/officer/reports/${notification.relatedId}`);
      } else {
        // If it's a citizen, we need the lookup code. 
        // For simplicity and immediate fix, we'll fetch the report code first
        try {
          const res = await fetch(`/api/officer/reports/${notification.relatedId}`);
          if (res.ok) {
            const reportData = await res.json();
            if (reportData.lookupCode) {
              router.push(`/lookup?code=${reportData.lookupCode}`);
            }
          }
        } catch (e) {
          // Fallback or handle error
          router.push('/lookup');
        }
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-9 w-9">
        <Bell className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] min-w-[18px] flex justify-center"
          >
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-bold text-sm">Thông báo</h3>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 border-b hover:bg-slate-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-blue-700' : 'text-slate-700'}`}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {notification.body}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              Không có thông báo nào
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t text-center">
          <Button variant="ghost" size="sm" className="text-xs w-full text-police-green">
            Xem tất cả
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
