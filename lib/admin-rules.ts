export function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
}

export function validCommitteeTerm(start: unknown, end: unknown) {
  return (!start || validDate(start)) && (!end || validDate(end)) &&
    (!start || !end || (typeof start === "string" && typeof end === "string" && end >= start))
}

export function normalizeMemberEmail(value: unknown) {
  const email = String(value || "").trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}
