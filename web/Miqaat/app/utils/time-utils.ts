
export function formatTime(
  timeStr: string,
  format: "12h" | "24h",
  locale: string = "en"
): string {
  const parts = timeStr.split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  const s = parts[2] ? Number(parts[2]) : undefined;

  if (format === "24h") {
    let res = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    if (s !== undefined) res += `:${String(s).padStart(2, "0")}`;
    return res;
  }

  const h12 = h % 12 || 12;
  const mm = String(m).padStart(2, "0");
  const ss = s !== undefined ? `:${String(s).padStart(2, "0")}` : "";

  let period = h >= 12 ? "PM" : "AM";
  if (locale === "ar") {
    period = h >= 12 ? "مساءً" : "صباحاً";
  }

  return `${h12}:${mm}${ss} ${period}`;
}

export function formatMinutesToTime(
  totalMinutes: number,
  format: "12h" | "24h",
  locale: string = "en"
): string {
  const roundedMinutes = Math.round(totalMinutes);
  const normalized = ((roundedMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;

  const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return formatTime(timeStr, format, locale);
}
