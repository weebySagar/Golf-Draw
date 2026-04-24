import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { WinningCard } from "@/components/dashboard/winning-card";

export default async function WinningsPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/login");

    const winnings = await prisma.winnings.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            prizePool: {
                include: { draw: true }
            }
        }
    });

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Winnings</h1>
                <p className="text-muted-foreground mt-1">
                    Upload proof from your golf platform to claim your prize money.
                </p>
            </div>

            {winnings.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border rounded-lg">
                    <p className="text-4xl mb-3">🏌️</p>
                    <p className="font-medium">No winnings yet.</p>
                    <p className="text-sm">Keep submitting scores and participating in draws!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {winnings.map((w) => (
                        <WinningCard key={w.id} winning={w} />
                    ))}
                </div>
            )}
        </div>
    );
}
