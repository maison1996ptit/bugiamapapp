import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: any) {
  const secret = process.env.NEXTAUTH_SECRET || "bugiamap_super_secret_key_2026_mps_gov_vn";
  
  const token = await getToken({ 
    req, 
    secret,
    raw: false
  });

  const cookieHeader = req.headers.get('cookie') || '';

  return NextResponse.json({
    message: "Auth Diagnosis",
    hasToken: !!token,
    tokenDetails: token ? {
      email: token.email,
      role: token.role,
      name: token.name
    } : null,
    cookiesFound: cookieHeader.split(';').map((c: string) => c.trim().split('=')[0]),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: !!process.env.VERCEL
  });
}
