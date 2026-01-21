import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_time", { ascending: true })

    if (error) {
      console.error("[v0] Failed to fetch events:", error)
      return []
    }

    return (data || []).map((event) => {
      const dateObj = new Date(event.start_time)
      const startTime = new Date(event.start_time)
      const endTime = new Date(event.end_time)

      return {
        ...event,
        month: dateObj.toLocaleString("en-US", { month: "long" }),
        time: `${startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
      }
    })
  } catch (error) {
    console.error("[v0] Error in getEvents:", error)
    return []
  }
}
