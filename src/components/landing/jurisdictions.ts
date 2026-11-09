// Names and filing status for every shape on the landing-page map.

export const JURISDICTION_NAMES: Readonly<Record<string, string>> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky',
  LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  PR: 'Puerto Rico',
};

/** States with no state income tax on wages. Residents do not file a state income tax return. */
export const NO_INCOME_TAX: ReadonlySet<string> = new Set(['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY']);

/** Shown on the map, but filing is not supported yet. */
export const COMING_SOON: ReadonlySet<string> = new Set(['PR']);

export type JurisdictionKind = 'file' | 'no-tax' | 'coming-soon';

export function jurisdictionKind(code: string): JurisdictionKind {
  if (COMING_SOON.has(code)) return 'coming-soon';
  if (NO_INCOME_TAX.has(code)) return 'no-tax';
  return 'file';
}

export function jurisdictionName(code: string): string {
  return JURISDICTION_NAMES[code] ?? code;
}

export function flagUrl(code: string): string {
  return `${import.meta.env.BASE_URL}flags/us-${code.toLowerCase()}.webp`;
}
