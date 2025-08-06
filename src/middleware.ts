import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { orgId, has } = await auth();

  if (isPublicRoute(req)) {
    return;
  }

  // check if user with organization has a billing plan
  if (
    orgId &&
    (!has({ plan: "org:starter" }) &&
      !has({ plan: "org:pro" }) &&
      !has({ plan: "org:enterprise" })) &&
    !req.url.includes("/billing")
  ) {
    return NextResponse.redirect(new URL("/billing", req.url));
  }

  // check if user has an organization
  if (!orgId && !req.url.includes("/organization")) {
    return NextResponse.redirect(new URL("/organization", req.url));
  }

  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
