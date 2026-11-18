/**
 * Single source of truth for product naming.
 * The blueprint's "Saath" is a placeholder; this repo is named cojaunt, so the UI uses that.
 * Change it here and every screen follows.
 */
export const brand = {
  name: "Cojaunt",
  tagline: "Plans, not profiles.",
  /** Where the app runs. Used in copy such as "Small-group trips across India". */
  region: "India",
  platformFee: 149,
  /**
   * Plus plans, in rupees. Deliberately low, and the longer plans cost less per month.
   * PLACEHOLDER prices: they need testing with real members.
   */
  plusPlans: [
    { id: "monthly", label: "1 month", months: 1, price: 149 },
    { id: "quarterly", label: "3 months", months: 3, price: 399 },
    { id: "yearly", label: "1 year", months: 12, price: 1299 },
  ],
  /** PLACEHOLDER: the blueprint proposes a 10 to 15% take rate. Nothing has been agreed with hosts. */
  hostCommission: 0.12,
} as const;

export type PlusPlanId = (typeof brand.plusPlans)[number]["id"];
