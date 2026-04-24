"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/actions/stripe";

export function SubscribeButton({ priceId }: { priceId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const res = await createCheckoutSession(priceId);
            if (res.error) {
                alert(res.error);
                setIsLoading(false);
                return;
            }
            if (res.url) {
                window.location.href = res.url;
            }
        } catch (error) {
            console.error("Subscription error:", error);
            setIsLoading(false);
        }
    };

    return (
        <button 
            onClick={handleSubscribe} 
            disabled={isLoading} 
            className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#4ade80] transition-all disabled:opacity-50"
        >
            {isLoading ? "Redirecting to Stripe..." : "Upgrade to Pro →"}
        </button>
    );
}
