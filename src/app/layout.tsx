import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/components/providers/QueryProvider";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Hệ thống phản ánh công dân - Bộ Công An",
  description: "Cổng thông tin tiếp nhận và xử lý phản ánh của người dân về các vấn đề an ninh, trật tự và xã hội.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <NextAuthProvider>
          <QueryProvider>
            <TooltipProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster position="top-right" expand={true} richColors />
            </TooltipProvider>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
