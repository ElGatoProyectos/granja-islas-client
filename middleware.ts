import { NextRequest, NextResponse } from "next/server";
import { ADMIN, SUPERADMIN, USER } from "./constants/roles";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    console.log(pathname);
    console.log(token?.role);

    // Redirigir desde la raíz "/" a "/signin" si no está autenticado
    if (pathname === "/") {
      if (!token) {
        return NextResponse.rewrite(new URL("/signin", req.url));
      } else {
        return NextResponse.rewrite(new URL("/onboarding", req.url));
      }
    }

    // Rutas protegidas por ADMIN y SUPERADMIN
    if (pathname.startsWith("/dashboard")) {
      if (token?.role !== SUPERADMIN && token?.role !== ADMIN) {
        return NextResponse.rewrite(new URL("/signin", req.url));
      }
    }

    // Ruta específica para usuarios con rol USER y también accesible para ADMIN y SUPERADMIN
    if (pathname === "/payments") {
      if (
        token?.role !== USER &&
        token?.role !== ADMIN &&
        token?.role !== SUPERADMIN
      ) {
        return NextResponse.rewrite(new URL("/signin", req.url));
      }
    }

    // Permitir acceso a /onboarding para usuarios autenticados
    if (pathname === "/onboarding") {
      if (!token) {
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
  matcher: ["/", "/dashboard/:path*", "/payments", "/onboarding"],
};
