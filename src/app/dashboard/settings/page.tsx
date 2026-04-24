import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CharityForm } from "@/components/dashboard/charity-form";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    const charities = await prisma.charity.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-10 max-w-2xl">
            {/* Header */}
            <div>
                <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase mb-1 font-mono">Preferences</p>
                <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                <p className="mt-2 text-sm text-muted-foreground">Manage your charity allocations and personal details.</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-foreground">Charity Allocation</h2>
                    <p className="text-xs text-muted-foreground mt-1 italic italic">
                        Minimum 10% is required. You can choose to send up to 100% of your subscription payout to your selected cause.
                    </p>
                </div>

                <CharityForm 
                    currentPercentage={user?.charityPercentage || 10} 
                    currentCharityId={user?.charityId ?? undefined} 
                    charities={charities} 
                />
            </div>

            <div className="p-4 rounded-xl border border-yellow-500/10 bg-yellow-500/5">
                <p className="text-[10px] text-yellow-600 leading-relaxed uppercase tracking-tighter font-bold">
                    * Subscription Billing
                </p>
                <p className="text-[11px] text-yellow-600/70 mt-1">
                    To manage your actual billing method or cancel, please check your email for the Stripe customer portal link.
                </p>
            </div>
        </div>
    );
}
