import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ScoreForm } from "@/components/dashboard/score-form";
import { SubscribeButton } from "@/components/dashboard/subscribe-button";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { charity: true, scores: { orderBy: { date: 'desc' }, take: 5 } }
    });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase mb-1 font-mono">Overview</p>
                <h1 className="text-3xl font-bold text-foreground">Player Dashboard</h1>
            </div>

            {/* Top Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Active Charity Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#4ade80]/50">
                        <div className="pointer-events-none absolute right-[-20px] top-[-20px] text-6xl opacity-[0.03]">🌍</div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-4">Active Charity</p>
                        <p className="text-2xl font-bold text-foreground">{user?.charity?.name || "None Selected"}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {user?.charityPercentage}% of your subscription supports {user?.charity?.name || "a good cause"}.
                        </p>
                        <a href="/dashboard/settings" className="mt-4 inline-block text-[10px] text-[#4ade80] hover:underline uppercase tracking-widest font-bold">Manage Cause →</a>
                    </div>

                    {/* Subscription Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#4ade80]/50">
                        <div className="pointer-events-none absolute right-[-20px] top-[-20px] text-6xl opacity-[0.03]">💎</div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-4">Subscription</p>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-foreground">{user?.subscriptionStatus === 'active' ? 'Active Pro' : 'Inactive'}</p>
                            {user?.subscriptionStatus === 'active' && (
                                <span className="inline-flex h-2 w-2 rounded-full bg-[#4ade80] animate-pulse" />
                            )}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {user?.subscriptionStatus === 'active' ? 'You are fully eligible for this month\'s draw.' : 'Subscribe now to enter the monthly draw.'}
                        </p>
                        {user?.subscriptionStatus !== 'active' && (
                            <div className="mt-4">
                                <SubscribeButton priceId={process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!} />
                            </div>
                        )}
                    </div>

                    {/* Draw Ticket Status */}
                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#4ade80]/50">
                        <div className="pointer-events-none absolute right-[-20px] top-[-20px] text-6xl opacity-[0.03]">🎫</div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-4">Draw Ticket</p>
                        <p className="text-2xl font-bold text-foreground">{user?.scores.length}/5</p>
                        <div className="mt-2 flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= (user?.scores.length || 0) ? "bg-[#4ade80]" : "bg-black/10 dark:bg-white/5"}`} />
                            ))}
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                            {user?.scores.length === 5 ? "Full ticket active." : `Add ${5 - (user?.scores.length || 0)} more scores to maximize your win chance.`}
                        </p>
                    </div>
                </div>

                {/* Score Management Section */}
                <div className="grid gap-8 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-border bg-card p-6 h-full">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-6">Log Score</p>
                            <ScoreForm />
                            <div className="mt-8 p-4 rounded-xl bg-card border border-border">
                                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                    * Your Stableford score should be between 1 and 45. We favor rare scores in algorithmic draws!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="rounded-2xl border border-border bg-card p-6 h-full">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-6">Draw Entry History (Latest 5)</p>
                            {user?.scores.length === 0 ? (
                                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                                    No scores logged yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {user?.scores.map(score => (
                                        <div key={score.id} className="flex items-center justify-between p-4 rounded-xl bg-accent/20 border border-border group hover:border-border transition-colors">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{new Date(score.date).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">Verified Score Entry</p>
                                            </div>
                                            <div className="text-2xl font-black text-[#4ade80]">{score.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="mt-6 text-[10px] text-center text-muted-foreground">
                                Only your 5 most recent scores are used for the active monthly draw.
                            </p>
                        </div>
                    </div>
            </div>
        </div>
    );
}
