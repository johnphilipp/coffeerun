import { auth as middleware } from "@/auth";

export default middleware((req) => {
  const publicPaths = ["/", "/demo"];

  if (!req.auth && !publicPaths.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
