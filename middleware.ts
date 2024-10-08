import { NextRequest, NextResponse } from "next/server";
import { ADMIN, SUPERADMIN, USER } from "./constants/roles";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req });

    if (!token) {
      // Redirigir a "/signin" si no hay token
      return NextResponse.rewrite(new URL("/signin", req.url));
    }

    // Redirigir desde "/" a "/dashboard" si está autenticado
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Verificar accesos según el rol del usuario
    if (token.role === USER) {
      // Permitir acceso a /receipts y /receipts/[id] solo para USER
      if (
        pathname === "/receipts" ||
        pathname.startsWith("/receipts/") ||
        pathname === "/onboarding"
      ) {
        // Permitir acceso
        return NextResponse.next();
      } else {
        // Bloquear acceso a otras rutas
        return NextResponse.rewrite(new URL("/receipts", req.url));
      }
    }

    // Permitir acceso completo a ADMIN y SUPERADMIN
    if (token.role === ADMIN || token.role === SUPERADMIN) {
      return NextResponse.next();
    }

    // Bloquear acceso a cualquier ruta no cubierta para roles inesperados (opcional)
    return NextResponse.rewrite(new URL("/signin", req.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/receipts/:path*", "/onboarding"],
};
