import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Thử đếm số lượng user trong DB
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: { email: true, role: true },
      take: 5
    });

    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    const DATA_DIR = process.env.VERCEL 
      ? path.join(os.tmpdir(), 'data')
      : path.join(process.cwd(), 'data');

    return NextResponse.json({
      status: "Connected (LOCAL STORAGE MODE)",
      userCount,
      existingUsers: users,
      databaseHost: "Local JSON Files",
      dataDir: DATA_DIR,
      isVercel: !!process.env.VERCEL,
      message: "Hệ thống đang chạy chế độ lưu trữ file cục bộ (với hỗ trợ /tmp trên Vercel)."
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "Error",
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
