import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/competition"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(
  (auth, req) => {
    if (isAdminRoute(req)) {
      auth().protect((has) => {
        return has({ role: "org:admin" });
      });
    }

    if (isProtectedRoute(req)) {
      auth().protect();
    }
  },
  { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
