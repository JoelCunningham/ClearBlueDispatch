export function getToday(): Temporal.Instant {
  return Temporal.Now.instant().toZonedDateTimeISO("Australia/Melbourne").toPlainDate().toZonedDateTime("Australia/Melbourne").toInstant();
}

export function getWeekOfYear(date: Temporal.Instant): number {
  if (!date) return 0;
  return date.toZonedDateTimeISO("Australia/Melbourne").weekOfYear ?? 0;
}

export function getDayOfMonth(date: Temporal.Instant): number {
  return date.toZonedDateTimeISO("Australia/Melbourne").day ?? 0;
}

export function dateToShortFormat(date: Temporal.Instant): string {
  return date.toLocaleString("en-AU", { day: "numeric", month: "2-digit", year: "numeric" });
}

export function dateToLongFormat(date: Temporal.Instant): string {
  return date.toLocaleString("en-AU", { weekday: "long", day: "numeric", month: "long" });
}

export function dateToLongYearFormat(date: Temporal.Instant): string {
  return date.toLocaleString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function dateToWeekFormat(date: Temporal.Instant): string {
  return `${date.toZonedDateTimeISO("Australia/Melbourne").weekOfYear} ${date.toZonedDateTimeISO("Australia/Melbourne").year}`;
}

export function dateToInputFormat(date: Temporal.Instant): string {
  return date.toZonedDateTimeISO("Australia/Melbourne").toPlainDate().toString();
}

export function inputFormatToDate(input: string): Temporal.Instant {
  return Temporal.PlainDate.from(input).toZonedDateTime({ timeZone: "Australia/Melbourne", plainTime: "00:00:00" }).toInstant();
}

export function isDatePast(date: Temporal.Instant): boolean {
  return Temporal.Instant.compare(date, getToday()) < 0;
}
