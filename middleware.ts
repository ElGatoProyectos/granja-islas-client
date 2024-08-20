import { NextRequest, NextResponse } from "next/server";
import { ADMIN, SUPERADMIN, USER } from "./constants/roles";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req });

    // Redirigir desde la raíz "/" a "/signin" si no está autenticado
    if (pathname === "/") {
      if (!token) {
        return NextResponse.rewrite(new URL("/signin", req.url));
      }
      // Redirigir usuarios autenticados según su rol
      if (token.role === SUPERADMIN || token.role === ADMIN) {
        return NextResponse.rewrite(new URL("/dashboard", req.url));
      }
      if (token.role === USER) {
        return NextResponse.rewrite(new URL("/receipts", req.url));
      }
    }

    // Rutas protegidas por ADMIN y SUPERADMIN
    if (pathname.startsWith("/dashboard")) {
      if (token?.role !== SUPERADMIN && token?.role !== ADMIN) {
        return NextResponse.rewrite(new URL("/receipts", req.url));
      }
    }

    // Ruta específica para usuarios con rol USER y también accesible para ADMIN y SUPERADMIN
    if (pathname === "/receipts") {
      if (
        token?.role !== USER &&
        token?.role !== ADMIN &&
        token?.role !== SUPERADMIN
      ) {
        return NextResponse.rewrite(new URL("/signin", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/receipts", "/onboarding"],
};
