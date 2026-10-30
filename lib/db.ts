import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let database: NeonQueryFunction<false, false> | null = null

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured")
  }

  if (!database) {
    database = neon(connectionString)
  }

  return database
}

export type DatabaseRow = Record<string, unknown>
