// middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  // 1초 지연
//   await new Promise((resolve) => setTimeout(resolve, 6000));
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", // 특정 페이지만
    "/api/:path*", // API 라우트만
    "/((?!_next/static|_next/image|favicon.ico).*)", // 정적 파일 제외
  ],
};
