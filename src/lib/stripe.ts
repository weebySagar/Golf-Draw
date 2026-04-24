import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia", // specify latest API version or your chosen one
    appInfo: {
        name: "Golf Draw & Charity App",
        version: "0.1.0"
    }
});
