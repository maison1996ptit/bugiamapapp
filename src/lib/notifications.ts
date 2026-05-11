import { prisma } from "./prisma";
import { NotificationType } from "@prisma/client";

export class NotificationService {
  /**
   * Send a notification to a specific user
   */
  static async notifyUser({
    userId,
    title,
    body,
    type = "SYSTEM_ALERT",
    relatedId,
  }: {
    userId: string;
    title: string;
    body: string;
    type?: NotificationType;
    relatedId?: string;
  }) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          body,
          type,
          relatedId,
        },
      });

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  /**
   * Notify a reporter (citizen) about a status update
   */
  static async notifyReportUpdate(reportId: string, status: string, officerName?: string) {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: { reporterId: true, lookupCode: true, title: true },
    });

    if (report?.reporterId) {
      const statusLabels: Record<string, string> = {
        PENDING: "Đã tiếp nhận",
        PROCESSING: "Đang xử lý",
        COMPLETED: "Đã hoàn thành",
        REJECTED: "Đã từ chối",
      };

      const officerInfo = officerName ? ` bởi cán bộ ${officerName}` : "";

      await this.notifyUser({
        userId: report.reporterId,
        title: `Cập nhật xử lý: ${report.lookupCode}`,
        body: `Phản ánh "${report.title}" của bạn đã được chuyển sang trạng thái: ${statusLabels[status] || status}${officerInfo}.`,
        type: "REPORT_UPDATE",
        relatedId: reportId,
      });
    }
  }

  /**
   * Broadcast notification to all users of a certain role
   */
  static async broadcastToRole(role: "ADMIN" | "OFFICER" | "CITIZEN", title: string, body: string, relatedId?: string) {
    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true },
    });

    const notifications = users.map((user) => ({
      userId: user.id,
      title,
      body,
      type: "BROADCAST" as NotificationType,
      relatedId,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });
  }

  /**
   * Broadcast notification to multiple roles
   */
  static async broadcastToRoles(roles: ("ADMIN" | "OFFICER")[], title: string, body: string, relatedId?: string) {
    const users = await prisma.user.findMany({
      where: { role: { in: roles } },
      select: { id: true },
    });

    const notifications = users.map((user) => ({
      userId: user.id,
      title,
      body,
      type: "BROADCAST" as NotificationType,
      relatedId,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });
  }
}
