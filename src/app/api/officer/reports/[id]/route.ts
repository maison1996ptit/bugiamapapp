import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NotificationService } from "@/lib/notifications";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || ((session.user as any).role !== 'OFFICER' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, feedback } = await req.json();
    const { id } = await params;

    const report = await prisma.report.update({
      where: { id },
      data: {
        status,
        feedback,
        officerId: (session.user as any).id,
        auditLogs: {
          create: {
            action: `Updated status to ${status}`,
            note: feedback,
          },
        },
      },
    });

    // Notify the reporter about the status update with officer information
    await NotificationService.notifyReportUpdate(id, status, session.user?.name || undefined);

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("Report update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || ((session.user as any).role !== 'OFFICER' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id: id },
      include: {
        images: true,
        auditLogs: true,
        reporter: {
          select: { name: true, email: true }
        }
      },
    });

    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
