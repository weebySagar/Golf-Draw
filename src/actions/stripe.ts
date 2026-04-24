"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function createCheckoutSession(priceId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        let customerId = user?.stripeCustomerId;

        // If no customer ID exists, create a Stripe Customer
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: session.user.email,
                name: session.user.name,
                metadata: {
                    userId: session.user.id
                }
            });
            customerId = customer.id;
            
            await prisma.user.update({
                where: { id: session.user.id },
                data: { stripeCustomerId: customer.id }
            });
        }

        // Create Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                }
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscribe?canceled=true`,
            metadata: {
                userId: session.user.id
            }
        });

        return { url: checkoutSession.url };

    } catch (e: any) {
        console.error("Stripe error:", e);
        return { error: e.message || "An error occurred creating the checkout session." };
    }
}
