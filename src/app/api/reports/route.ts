import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NotificationService } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { title, description, category, latitude, longitude, address, imageUrls } = body;

    const lookupCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const report = await prisma.report.create({
      data: {
        title,
        description,
        category,
        latitude,
        longitude,
        address,
        lookupCode,
        status: "PENDING",
        reporterId: session?.user ? (session.user as any).id : null,    
        images: {
          create: imageUrls?.map((url: string) => ({ url })) || [],     
        },
      },
    });

    // Notify all officers and admins about the new report
    await NotificationService.broadcastToRoles(
      ["OFFICER", "ADMIN"],
      `PHẢN ÁNH MỚI: ${category}`,
      `Có một phản ánh mới về "${title}" tại ${address || 'vị trí đã đánh dấu'}. Vui lòng kiểm tra và xử lý.`,
      report.id
    );

    return NextResponse.json(report, { status: 201 });  } catch (error: any) {
    console.error("Report creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lookupCode = searchParams.get("code");

    if (lookupCode) {
      const report = await prisma.report.findUnique({
        where: { lookupCode },
        include: { images: true, auditLogs: true },
      });
      return NextResponse.json(report);
    }

    const reports = await prisma.report.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        latitude: true,
        longitude: true,
        address: true,
        createdAt: true,
        images: true,
      },
    });
    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
