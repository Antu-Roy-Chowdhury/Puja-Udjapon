import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  if (request.cookies.has("puja_session")) return NextResponse.next()

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("returnTo", `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/admin/:path*", "/profile"],
}
