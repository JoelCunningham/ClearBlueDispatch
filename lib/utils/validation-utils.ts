import { notFound } from "next/navigation";

export function idOrUndefined(id: string | undefined): number | undefined {
  return id ? Number(id) : undefined;
}

export function idOrNotFound(id: string | undefined): number {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) notFound();
  return parsedId;
}

export function valueOrNotFound<T>(value: T | null | undefined): T {
  if (!value) notFound();
  return value;
}
