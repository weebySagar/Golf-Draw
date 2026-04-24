import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                
                // Find user by stripeCustomerId
                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: subscription.customer as string }
                });

                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            subscriptionId: subscription.id,
                            subscriptionStatus: subscription.status
                        }
                    });
                }
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                
                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: subscription.customer as string }
                });

                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            subscriptionStatus: "canceled"
                        }
                    });
                }
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error("Webhook processing error:", err);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
