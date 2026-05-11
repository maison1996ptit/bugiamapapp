import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NotificationService } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const { name, email, password, phoneNumber, cccd } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        cccd,
        role: "CITIZEN",
      },
    });

    // Send welcome notification to the user
    await NotificationService.notifyUser({
      userId: user.id,
      title: "Chào mừng bạn đến với Hệ thống Phản ánh Công dân",
      body: `Chào ${name}, cảm ơn bạn đã đăng ký tài khoản. Bạn có thể bắt đầu gửi phản ánh ngay bây giờ.`,
      type: "SYSTEM_ALERT",
    });

    // Notify admins about the new registration
    await NotificationService.broadcastToRole(
      "ADMIN",
      "Người dùng mới đăng ký",
      `Người dùng ${name} (${email}) vừa đăng ký tài khoản mới.`
    );

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
