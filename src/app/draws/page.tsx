import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DrawsPage() {
    const draws = await prisma.draw.findMany({
        where: { isPublished: true },
        orderBy: { month: "desc" },
        include: {
            prizePool: {
                include: {
                    winnings: {
                        include: { user: { select: { name: true } } }
                    }
                }
            }
        }
    });

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Monthly Draw Results</h1>
                    <p className="text-muted-foreground">Published results from our monthly prize draws.</p>
                </div>

                {draws.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border rounded-xl">
                        <p className="text-5xl mb-4">🎱</p>
                        <p className="text-xl font-medium">No draws published yet.</p>
                        <p className="text-sm mt-1">Check back after the next monthly draw!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {draws.map((draw) => {
                            const winners = draw.prizePool?.winnings ?? [];
                            const match3 = winners.filter(w => w.matchType === 3);
                            const match4 = winners.filter(w => w.matchType === 4);
                            const match5 = winners.filter(w => w.matchType === 5);

                            return (
                                <div key={draw.id} className="border rounded-xl overflow-hidden">
                                    {/* Draw Header */}
                                    <div className="bg-primary text-primary-foreground px-6 py-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <h2 className="text-xl font-bold">
                                                {new Date(draw.month).toLocaleDateString("en-GB", { month: "long", year: "numeric" })} Draw
                                            </h2>
                                            <div>
                                                <p className="text-primary-foreground/70 text-xs">Prize Pool</p>
                                                <p className="text-2xl font-bold">
                                                    £{draw.prizePool?.totalAmount.toFixed(2) ?? "0.00"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Winning Numbers */}
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-2">Draw Numbers</p>
                                            <div className="flex gap-2 flex-wrap">
                                                {draw.numbers.map((n) => (
                                                    <span key={n} className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground font-bold text-base shadow">
                                                        {n}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Rollover Banner */}
                                        {draw.prizePool?.rolledOver && (
                                            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 px-4 py-3 text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                                                🔁 Jackpot rolled over — no 5-match winner this month! The 40% jackpot has been added to next month's prize pool.
                                            </div>
                                        )}

                                        {/* Winners */}
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            {[
                                                { tier: "Match 3", share: "25%", winners: match3, amount: draw.prizePool?.match3Share },
                                                { tier: "Match 4", share: "35%", winners: match4, amount: draw.prizePool?.match4Share },
                                                { tier: "Match 5 🏆", share: "40%", winners: match5, amount: draw.prizePool?.match5Share },
                                            ].map(({ tier, share, winners: tierWinners, amount }) => (
                                                <div key={tier} className="rounded-lg border p-4 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold text-sm">{tier}</p>
                                                        <span className="text-xs bg-muted rounded-full px-2 py-0.5">{share}</span>
                                                    </div>
                                                    <p className="text-lg font-bold">£{amount?.toFixed(2) ?? "0.00"}</p>
                                                    {tierWinners.length === 0 ? (
                                                        <p className="text-xs text-muted-foreground">No winners</p>
                                                    ) : (
                                                        <ul className="text-xs text-muted-foreground space-y-0.5">
                                                            {tierWinners.map((w) => (
                                                                <li key={w.id}>🏌️ {w.user.name}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
