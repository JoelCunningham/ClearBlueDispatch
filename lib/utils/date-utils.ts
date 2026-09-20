import { getISOWeek } from "date-fns/fp/getISOWeek";

export function getToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Melbourne"
  }).format(new Date());
}

export function dateToLongFormat(dateString: string): string {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

export function dateToLongYearFormat(dateString: string): string {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function dateToWeekFormat(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return `${getISOWeek(date)} ${date.getFullYear()}`;
}
