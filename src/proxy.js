import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/consultant")) {
      if (token?.role !== "CONSULTANT" && token?.role !== "LEAD_CONSULTANT") {
        return NextResponse.redirect(new URL("/client", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  matcher: [
    "/client/:path*", 
    "/consultant/:path*"
  ],
};