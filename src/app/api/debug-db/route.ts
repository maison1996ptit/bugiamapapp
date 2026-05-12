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
      status: "Connected",
      userCount,
      existingUsers: users,
      databaseHost: "ipv4.db.usqtfymjbwrkyvfttrbc.supabase.co",
      message: "Nếu bạn thấy danh sách email ở đây, nghĩa là kết nối DB đã OK."
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "Error",
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
