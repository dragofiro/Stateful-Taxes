// New York State and New York City figures for tax year 2025 (returns filed in 2026).
// Source: Form IT-201-I (2025), saved as public/state_forms/2026/new_york/new_york_IT_201_I.pdf.
// Update this file, and only this file, for a new tax year.
import type { FilingStatus } from '../../../../context/tax_reducer.ts';

export const NY_TAX_YEAR = 2025;

/** Each bracket is [upper limit of taxable income, marginal rate]. The last limit is Infinity. */
export type Brackets = ReadonlyArray<readonly [number, number]>;

type Status = Exclude<FilingStatus, ''>;

const NYS_SINGLE: Brackets = [
  [8_500, 0.04],
  [11_700, 0.045],
  [13_900, 0.0525],
  [80_650, 0.055],
  [215_400, 0.06],
  [1_077_550, 0.0685],
  [5_000_000, 0.0965],
  [25_000_000, 0.103],
  [Infinity, 0.109],
];

const NYS_JOINT: Brackets = [
  [17_150, 0.04],
  [23_600, 0.045],
  [27_900, 0.0525],
  [161_550, 0.055],
  [323_200, 0.06],
  [2_155_350, 0.0685],
  [5_000_000, 0.0965],
  [25_000_000, 0.103],
  [Infinity, 0.109],
];

const NYS_HEAD: Brackets = [
  [12_800, 0.04],
  [17_650, 0.045],
  [20_900, 0.0525],
  [107_650, 0.055],
  [269_300, 0.06],
  [1_616_450, 0.0685],
  [5_000_000, 0.0965],
  [25_000_000, 0.103],
  [Infinity, 0.109],
];

export const NYS_BRACKETS: Record<Status, Brackets> = {
  '1': NYS_SINGLE,
  '2': NYS_JOINT,
  '3': NYS_SINGLE,
  '4': NYS_HEAD,
  '5': NYS_JOINT,
};

const NYC_SINGLE: Brackets = [
  [12_000, 0.03078],
  [25_000, 0.03762],
  [50_000, 0.03819],
  [Infinity, 0.03876],
];

const NYC_JOINT: Brackets = [
  [21_600, 0.03078],
  [45_000, 0.03762],
  [90_000, 0.03819],
  [Infinity, 0.03876],
];

const NYC_HEAD: Brackets = [
  [14_400, 0.03078],
  [30_000, 0.03762],
  [60_000, 0.03819],
  [Infinity, 0.03876],
];

export const NYC_BRACKETS: Record<Status, Brackets> = {
  '1': NYC_SINGLE,
  '2': NYC_JOINT,
  '3': NYC_SINGLE,
  '4': NYC_HEAD,
  '5': NYC_JOINT,
};

export const NYS_STANDARD_DEDUCTION: Record<Status, number> = {
  '1': 8_000,
  '2': 16_050,
  '3': 8_000,
  '4': 11_200,
  '5': 16_050,
};

/** Standard deduction for a single filer whom someone else can claim as a dependent. */
export const NYS_DEPENDENT_FILER_DEDUCTION = 3_100;

/** Line 36: exemption for each dependent. */
export const NYS_DEPENDENT_EXEMPTION = 1_000;

/** Above this New York AGI, the tax comes from the tax computation worksheets (IT-201-I pages 34 to 39). */
export const NYS_SUPPLEMENTAL_TAX_THRESHOLD = 107_650;
/** At or above this New York AGI, the first worksheet taxes all income at its flat rate. */
export const NYS_FLAT_RATE_FULL_AGI = 157_650;
/** The worksheets phase each benefit back in over this much New York AGI. */
export const NYS_RECAPTURE_PHASE_IN = 50_000;

/** One tax computation worksheet with a recapture base: applies when taxable income is over `over`. */
export interface RecaptureTier {
  over: number;
  base: number;
  increment: number;
}

export interface RecaptureSchedule {
  /** First worksheet (1, 7 or 12): flat rate for taxable income up to `flatLimit`. */
  flatRate: number;
  flatLimit: number;
  /** Later worksheets, lowest first. */
  tiers: readonly RecaptureTier[];
}

const RECAPTURE_JOINT: RecaptureSchedule = {
  flatRate: 0.055,
  flatLimit: 161_550,
  tiers: [
    { over: 161_550, base: 333, increment: 807 },
    { over: 323_200, base: 1_140, increment: 2_747 },
    { over: 2_155_350, base: 3_887, increment: 60_350 },
    { over: 5_000_000, base: 64_237, increment: 32_500 },
  ],
};

const RECAPTURE_SINGLE: RecaptureSchedule = {
  flatRate: 0.06,
  flatLimit: 215_400,
  tiers: [
    { over: 215_400, base: 568, increment: 1_831 },
    { over: 1_077_550, base: 2_399, increment: 30_172 },
    { over: 5_000_000, base: 32_571, increment: 32_500 },
  ],
};

const RECAPTURE_HEAD: RecaptureSchedule = {
  flatRate: 0.06,
  flatLimit: 269_300,
  tiers: [
    { over: 269_300, base: 787, increment: 2_289 },
    { over: 1_616_450, base: 3_076, increment: 45_261 },
    { over: 5_000_000, base: 48_337, increment: 32_500 },
  ],
};

export const NYS_RECAPTURE: Record<Status, RecaptureSchedule> = {
  '1': RECAPTURE_SINGLE,
  '2': RECAPTURE_JOINT,
  '3': RECAPTURE_SINGLE,
  '4': RECAPTURE_HEAD,
  '5': RECAPTURE_JOINT,
};

/** Above this New York AGI, all taxable income is taxed at the top rate. */
export const NYS_FLAT_TOP_THRESHOLD = 25_000_000;
export const NYS_TOP_RATE = 0.109;

/** The New York State EITC is this share of the federal EIC, less the household credit. */
export const NYS_EITC_RATE = 0.3;

/** Yonkers resident income tax surcharge, as a share of net New York State tax. */
export const YONKERS_SURCHARGE_RATE = 0.1675;

/**
 * Household credit table row: applies when federal AGI is not over `upTo`.
 * `amounts[i]` is the credit for i + 1 people (the filer, a spouse on a joint return, and dependents).
 * `extra` is added for each person over the last column. A table with one amount ignores household size.
 */
export interface HouseholdCreditRow {
  upTo: number;
  amounts: readonly number[];
  extra: number;
}
export type HouseholdCreditTable = readonly HouseholdCreditRow[];

const row = (upTo: number, amounts: number[], extra = 0): HouseholdCreditRow => ({ upTo, amounts, extra });

/** NYS household credit, line 40. Table 1 (single), table 2 (joint, head of household, QSS), table 3 (separate). */
export const NYS_HOUSEHOLD_CREDIT: Record<Status, HouseholdCreditTable> = {
  '1': [row(5_000, [75]), row(6_000, [60]), row(7_000, [50]), row(20_000, [45]), row(25_000, [40]), row(28_000, [20])],
  '2': [
    row(5_000, [90, 105, 120, 135, 150, 165, 180], 15),
    row(6_000, [75, 90, 105, 120, 135, 150, 165], 15),
    row(7_000, [65, 80, 95, 110, 125, 140, 155], 15),
    row(20_000, [60, 75, 90, 105, 120, 135, 150], 15),
    row(22_000, [60, 70, 80, 90, 100, 110, 120], 10),
    row(25_000, [50, 60, 70, 80, 90, 100, 110], 10),
    row(28_000, [40, 45, 50, 55, 60, 65, 70], 5),
    row(32_000, [20, 25, 30, 35, 40, 45, 50], 5),
  ],
  '3': [
    row(5_000, [45, 53, 60, 68, 75, 83, 90], 8),
    row(6_000, [38, 45, 53, 60, 68, 75, 83], 8),
    row(7_000, [33, 40, 48, 55, 63, 70, 78], 8),
    row(20_000, [30, 38, 45, 53, 60, 68, 75], 8),
    row(22_000, [30, 35, 40, 45, 50, 55, 60], 5),
    row(25_000, [25, 30, 35, 40, 45, 50, 55], 5),
    row(28_000, [20, 23, 25, 28, 30, 33, 35], 3),
    row(32_000, [10, 13, 15, 18, 20, 23, 25], 3),
  ],
  '4': [],
  '5': [],
};
NYS_HOUSEHOLD_CREDIT['4'] = NYS_HOUSEHOLD_CREDIT['2'];
NYS_HOUSEHOLD_CREDIT['5'] = NYS_HOUSEHOLD_CREDIT['2'];

/** NYC household credit, line 48. Table 4 (single), table 5 (joint, head of household, QSS), table 6 (separate). */
export const NYC_HOUSEHOLD_CREDIT: Record<Status, HouseholdCreditTable> = {
  '1': [row(10_000, [15]), row(12_500, [10])],
  '2': [
    row(15_000, [30, 60, 90, 120, 150, 180, 210], 30),
    row(17_500, [25, 50, 75, 100, 125, 150, 175], 25),
    row(20_000, [15, 30, 45, 60, 75, 90, 105], 15),
    row(22_500, [10, 20, 30, 40, 50, 60, 70], 10),
  ],
  '3': [
    row(15_000, [15, 30, 45, 60, 75, 90, 105], 15),
    row(17_500, [13, 25, 38, 50, 63, 75, 88], 13),
    row(20_000, [8, 15, 23, 30, 38, 45, 53], 8),
    row(22_500, [5, 10, 15, 20, 25, 30, 35], 5),
  ],
  '4': [],
  '5': [],
};
NYC_HOUSEHOLD_CREDIT['4'] = NYC_HOUSEHOLD_CREDIT['2'];
NYC_HOUSEHOLD_CREDIT['5'] = NYC_HOUSEHOLD_CREDIT['2'];

/** New York City school tax credit (fixed amount, line 69) for income of $250,000 or less. */
export const NYC_SCHOOL_CREDIT: Record<Status, number> = {
  '1': 63,
  '2': 125,
  '3': 63,
  '4': 63,
  '5': 125,
};
export const NYC_SCHOOL_CREDIT_INCOME_LIMIT = 250_000;

/** Line 69, table 2: the fixed credit for part-year city residents, by months of city residence (index 0 is 1 month). */
export const NYC_SCHOOL_CREDIT_PRORATED = {
  single: [5, 10, 16, 21, 26, 31, 36, 42, 47, 52, 57, 63],
  joint: [10, 21, 31, 42, 52, 63, 73, 83, 94, 104, 115, 125],
} as const;

/** Line 69a: NYC school tax credit (rate reduction amount), from New York City taxable income. */
export interface RateReductionSchedule {
  /** Up to this taxable income, the credit is `lowRate` of taxable income. */
  breakpoint: number;
  base: number;
  lowRate: number;
  highRate: number;
}
const rateReduction = (breakpoint: number, base: number): RateReductionSchedule => ({
  breakpoint,
  base,
  lowRate: 0.00171,
  highRate: 0.00228,
});
export const NYC_SCHOOL_RATE_REDUCTION: Record<Status, RateReductionSchedule> = {
  '1': rateReduction(12_000, 21),
  '2': rateReduction(21_600, 37),
  '3': rateReduction(12_000, 21),
  '4': rateReduction(14_400, 25),
  '5': rateReduction(21_600, 37),
};
/** No rate reduction credit when New York City taxable income is over this amount. */
export const NYC_SCHOOL_RATE_REDUCTION_LIMIT = 500_000;

/** Pension and annuity income exclusion (line 29), per person aged 59½ or older. */
export const NYS_PENSION_EXCLUSION_LIMIT = 20_000;

/** NY 529 college savings deduction (line 30). */
export const NYS_529_LIMIT_SINGLE = 5_000;
export const NYS_529_LIMIT_JOINT = 10_000;
