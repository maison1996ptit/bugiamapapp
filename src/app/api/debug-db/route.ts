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

    return NextResponse.json({
      status: "Connected (LOCAL STORAGE MODE)",
      userCount,
      existingUsers: users,
      databaseHost: "Local JSON Files (data/*.json)",
      message: "Hệ thống đang chạy chế độ lưu trữ file cục bộ để đảm bảo ổn định cho Demo."
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "Error",
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
