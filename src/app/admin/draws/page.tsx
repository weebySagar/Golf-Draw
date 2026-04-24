import prisma from "@/lib/prisma";
import { DrawControls, PublishButton } from "@/components/admin/draw-controls";

export default async function AdminDrawsPage() {
    const draws = await prisma.draw.findMany({
        orderBy: { executedAt: "desc" },
        include: {
            prizePool: {
                include: {
                    _count: { select: { winnings: true } }
                }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-border">
                <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase mb-1">Management</p>
                <h1 className="text-2xl font-bold text-foreground">Monthly Draws</h1>
                <p className="text-xs text-muted-foreground mt-1">Execute the monthly lottery draw and publish results.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <DrawControls />

                {/* Draw History */}
                <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <div className="px-5 py-3 border-b border-border bg-accent/20">
                        <p className="text-[11px] tracking-widest uppercase text-muted-foreground">Draw History</p>
                    </div>
                    <div className="divide-y divide-border max-h-[500px] overflow-auto">
                        {draws.length === 0 ? (
                            <p className="px-5 py-8 text-xs text-muted-foreground text-center">No draws run yet.</p>
                        ) : (
                            draws.map((draw) => (
                                <div key={draw.id} className="px-5 py-4 hover:bg-accent/40 transition-colors">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <p className="text-sm text-foreground font-medium">
                                                {new Date(draw.month).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                Run: {new Date(draw.executedAt).toLocaleDateString("en-GB")}
                                            </p>
                                        </div>
                                        <PublishButton drawId={draw.id} isPublished={draw.isPublished} />
                                    </div>
                                    <div className="flex gap-1 flex-wrap mb-2">
                                        {draw.numbers.map((n) => (
                                            <span key={n} className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border text-muted-foreground text-xs font-bold bg-background">
                                                {n}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 text-[11px] text-muted-foreground">
                                        <span>Pool: £{draw.prizePool?.totalAmount.toFixed(2) ?? "0.00"}</span>
                                        <span>Winners: {draw.prizePool?._count.winnings ?? 0}</span>
                                        {draw.prizePool?.rolledOver && <span className="text-yellow-600">Rolled Over</span>}
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
