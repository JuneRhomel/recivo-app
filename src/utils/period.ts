const CUTOFF_DAY = 20;

/**
 * Collection period label for a date, e.g. "2026-07". Periods run the 21st
 * of one month through the 20th of the next -- so June 21-31 belongs to the
 * July period, not June.
 *
 * Uses UTC getters deliberately: receipt dates come from a plain date
 * picker (no time-of-day) and are stored/transmitted as UTC-midnight of
 * the entered calendar day, so recovering "which day was actually picked"
 * must read the UTC components -- local getters would shift the day
 * depending on the viewer's browser timezone.
 */
export function getPeriodMonth(date: Date): string {
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + (day > CUTOFF_DAY ? 1 : 0);
  const period = new Date(Date.UTC(date.getUTCFullYear(), month, 1));
  return `${period.getUTCFullYear()}-${String(period.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Today's period, anchored to the viewer's own local calendar date. */
export function getCurrentPeriodMonth(): string {
  const now = new Date();
  return getPeriodMonth(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

/** Human-readable label for a "YYYY-MM" period, e.g. "July 2026". */
export function formatPeriodLabel(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
