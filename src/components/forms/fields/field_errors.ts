// Shared helpers for the field groups.

/** Problems keyed by field path, for example 'personalInfo.ssn'. */
export type FieldErrors = Record<string, string>;

/** Formats digits as 123-45-6789 while the user types. */
export function formatSsn(text: string): string {
  const d = text.replace(/\D/g, '').slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

/** Formats digits as 12-3456789 while the user types. */
export function formatEin(text: string): string {
  const d = text.replace(/\D/g, '').slice(0, 9);
  return d.length <= 2 ? d : `${d.slice(0, 2)}-${d.slice(2)}`;
}

/** Shows only the last four digits of an SSN. */
export function maskSsn(ssn: string): string {
  const d = ssn.replace(/\D/g, '');
  return d.length >= 4 ? `•••-••-${d.slice(-4)}` : '';
}

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
}
