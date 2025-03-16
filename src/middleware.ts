import { auth as middleware } from "@/auth";

export default middleware((req) => {
  const publicPaths = ["/login", "/demo"];

  if (!req.auth && !publicPaths.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
