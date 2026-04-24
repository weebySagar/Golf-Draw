import prisma from "@/lib/prisma";
import { WinningsReviewTable } from "@/components/admin/winnings-review";

export default async function AdminWinningsPage() {
    const winnings = await prisma.winnings.findMany({
        orderBy: [
            // ADMIN_REVIEW first, then others
            { status: "asc" },
            { createdAt: "desc" }
        ],
        include: {
            user: { select: { name: true, email: true } },
            prizePool: { include: { draw: { select: { month: true } } } }
        }
    });

    const pendingCount = winnings.filter(w => w.status === "ADMIN_REVIEW").length;

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-border flex items-start justify-between">
                <div>
                    <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase mb-1">Management</p>
                    <h1 className="text-2xl font-bold text-foreground">Winner Verification</h1>
                    <p className="text-xs text-muted-foreground mt-1">Review submitted proof and approve or reject prize claims.</p>
                </div>
                {pendingCount > 0 && (
                    <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg px-4 py-2 text-center">
                        <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
                        <p className="text-[10px] text-yellow-600 uppercase tracking-wider">Awaiting Review</p>
                    </div>
                )}
            </div>

            <WinningsReviewTable winnings={winnings} />
        </div>
    );
}
