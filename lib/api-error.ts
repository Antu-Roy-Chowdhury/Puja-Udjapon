import { NextResponse } from "next/server"

import { AuthorizationError } from "@/lib/auth"

export function apiError(error: unknown, fallback: string) {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  const message = error instanceof Error ? error.message : fallback
  return NextResponse.json({ error: message }, { status: 500 })
}
