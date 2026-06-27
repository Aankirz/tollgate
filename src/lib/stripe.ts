import Stripe from "stripe";

// Tollgate Stripe client (TEST mode only).
// When STRIPE_SECRET_KEY is unset, `stripe` is null and the payments module
// falls back to a stub top-up so the app stays demoable without keys.
const secretKey = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured: boolean = Boolean(secretKey);

export const stripe: Stripe | null = secretKey
  ? new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" })
  : null;
