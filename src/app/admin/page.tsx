import prisma from "@/lib/prisma";

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
    return (
        <div className={`border rounded-lg p-5 space-y-2 ${accent ? "border-[#4ade80]/50 bg-[#4ade80]/10" : "border-border bg-card"}`}>
            <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">{label}</p>
            <p className={`text-3xl font-bold tabular-nums ${accent ? "text-[#4ade80]" : "text-foreground"}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
    );
}

export default async function AdminPage() {
    const [
        totalUsers,
        activeSubscribers,
        totalCharities,
        totalDraws,
        pendingWinnings,
        recentWinnings,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { subscriptionStatus: "active" } }),
        prisma.charity.count({ where: { active: true } }),
        prisma.draw.count(),
        prisma.winnings.count({ where: { status: "ADMIN_REVIEW" } }),
        prisma.winnings.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } }
        }),
    ]);

    // Estimate MRR: active subscribers × £9.99
    const estimatedMRR = (activeSubscribers * 9.99).toFixed(2);
    const estimatedCharityPool = (activeSubscribers * 9.99 * 0.10).toFixed(2);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                    <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase mb-1">Overview</p>
                    <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                </div>
                <div className="sm:text-right">
                    <p className="text-[11px] text-muted-foreground">Last updated</p>
                    <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="Total Users" value={totalUsers} />
                <StatCard label="Active Subscribers" value={activeSubscribers} accent />
                <StatCard label="Est. Monthly Revenue" value={`£${estimatedMRR}`} sub="Based on £9.99/mo × active subscribers" />
                <StatCard label="Charity Pool (10%)" value={`£${estimatedCharityPool}`} sub="Minimum monthly allocation" />
                <StatCard label="Total Draws Run" value={totalDraws} />
                <StatCard label="Winnings Pending Review" value={pendingWinnings} accent={pendingWinnings > 0} />
            </div>

            {/* Active Charities & Recent Winnings */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Active Charities */}
                <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-accent/20">
                        <p className="text-xs tracking-widest uppercase text-muted-foreground">Active Charities</p>
                        <span className="text-[11px] text-[#4ade80]">{totalCharities} total</span>
                    </div>
                    <CharityList />
                </div>

                {/* Recent Winnings */}
                <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-accent/20">
                        <p className="text-xs tracking-widest uppercase text-muted-foreground">Recent Winnings</p>
                        <a href="/admin/winnings" className="text-[11px] text-[#4ade80] hover:text-[#86efac]">View all →</a>
                    </div>
                    <div className="divide-y divide-border">
                        {recentWinnings.length === 0 ? (
                            <p className="px-5 py-6 text-xs text-muted-foreground">No winnings recorded yet.</p>
                        ) : (
                            recentWinnings.map((w) => (
                                <div key={w.id} className="px-5 py-3 flex items-center justify-between hover:bg-accent/40 transition-colors">
                                    <div>
                                        <p className="text-sm text-foreground">{w.user.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{w.matchType}-Match · {new Date(w.createdAt).toLocaleDateString("en-GB")}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[#4ade80]">£{w.amount.toFixed(2)}</p>
                                        <StatusPill status={w.status} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

async function CharityList() {
    const charities = await prisma.charity.findMany({ where: { active: true }, take: 5, orderBy: { name: "asc" } });
    return (
        <div className="divide-y divide-border">
            {charities.length === 0 ? (
                <p className="px-5 py-6 text-xs text-muted-foreground">No charities added yet.</p>
            ) : (
                charities.map((c) => (
                    <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-accent/40 transition-colors">
                        <p className="text-sm text-foreground">{c.name}</p>
                        <span className="text-[11px] text-[#4ade80]">Active</span>
                    </div>
                ))
            )}
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        PENDING: "text-yellow-500",
        ADMIN_REVIEW: "text-blue-400",
        PAID: "text-[#4ade80]",
        REJECTED: "text-red-400",
    };
    return <span className={`text-[10px] uppercase tracking-wider ${map[status] ?? "text-muted-foreground"}`}>{status.replace("_", " ")}</span>;
}
