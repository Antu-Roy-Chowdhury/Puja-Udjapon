import { createClient } from "@supabase/supabase-js"

import { normalizeActivity } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function getActivities(limit?: number) {
  try {
    const { data, error } = await supabase.from("activities").select("*")
    if (error) {
      console.error("[v0] Failed to fetch activities:", error)
      return []
    }

    const activities = (data || []).map((activity) => normalizeActivity(activity)).sort((a, b) => a.name.localeCompare(b.name))
    return limit ? activities.slice(0, limit) : activities
  } catch (error) {
    console.error("[v0] Error in getActivities:", error)
    return []
  }
}
