import prisma from "@/lib/prisma";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            charity: { select: { name: true } },
            _count: { select: { scores: true } },
        }
    });

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-border">
                <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase mb-1">Management</p>
                <h1 className="text-2xl font-bold text-foreground">Users</h1>
                <p className="text-xs text-muted-foreground mt-1">{users.length} total registered users</p>
            </div>

            <div className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-accent/20">
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Name</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Subscription</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Charity</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Scores</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Role</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-accent/40 transition-colors">
                                <td className="px-4 py-3">
                                    <p className="text-foreground font-medium">{user.name}</p>
                                    <p className="text-[11px] text-muted-foreground">{user.email}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <SubscriptionBadge status={user.subscriptionStatus} />
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                    {user.charity?.name ?? <span className="text-muted-foreground/50">—</span>}
                                    {user.charity && <span className="ml-1 text-muted-foreground/70">({user.charityPercentage}%)</span>}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-muted-foreground tabular-nums">{user._count.scores}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] uppercase tracking-wider ${user.role === "ADMIN" ? "text-[#4ade80]" : "text-muted-foreground"}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-[11px] text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString("en-GB")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}

function SubscriptionBadge({ status }: { status: string | null }) {
    if (!status || status === "canceled") {
        return <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Inactive</span>;
    }
    const color = status === "active" ? "text-[#4ade80]" : "text-yellow-500";
    return <span className={`text-[10px] uppercase tracking-wider ${color}`}>{status}</span>;
}
