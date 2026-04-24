"use client";

import { useState } from "react";
import { runMonthlyDraw, publishDraw, simulateTestWinner } from "@/actions/draw";
import type { DrawMode } from "@/lib/draw-engine";

export function DrawControls() {
    const [mode, setMode] = useState<DrawMode>("random");
    const [isRunning, setIsRunning] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleRun = async () => {
        setIsRunning(true);
        setError("");
        setResult(null);

        const res = await runMonthlyDraw(mode);
        if (res.error) {
            setError(res.error);
        } else {
            setResult(res);
        }
        setIsRunning(false);
    };

    const handleSimulate = async () => {
        setIsSimulating(true);
        setError("");
        setResult(null);
        const res = await simulateTestWinner();
        if (res.error) {
            setError(res.error);
        } else {
            setResult({ winnersCount: 1, rollover: false, message: "Winner Simulated Successfully" });
        }
        setIsSimulating(false);
    };

    return (
        <div className="space-y-4">
            <div className="border border-border rounded-lg p-5 space-y-4 bg-card">
                <p className="text-xs tracking-widest uppercase text-muted-foreground">Run New Draw</p>

                <div className="flex gap-2">
                    {(["random", "frequency"] as DrawMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`text-xs px-4 py-2 rounded border transition-colors capitalize ${mode === m
                                ? "bg-[#4ade80]/10 border-[#4ade80]/40 text-[#4ade80]"
                                : "border-border text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {m} draw
                        </button>
                    ))}
                </div>

                <div className="text-[11px] text-muted-foreground/70 space-y-1">
                    <p><span className="text-muted-foreground">Random:</span> Equal probability for all numbers 1–45.</p>
                    <p><span className="text-muted-foreground">Frequency:</span> Rare user scores are drawn more often — harder to win, bigger rollovers.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleRun}
                        disabled={isRunning || isSimulating}
                        className="flex-1 py-2.5 text-sm font-semibold rounded border border-[#4ade80]/40 text-[#4ade80] bg-[#4ade80]/5 hover:bg-[#4ade80]/15 transition-colors disabled:opacity-40"
                    >
                        {isRunning ? "⌛ Running draw..." : "▶ Execute Draw"}
                    </button>

                    <button
                        onClick={handleSimulate}
                        disabled={isRunning || isSimulating}
                        className="flex-1 py-2.5 text-sm font-semibold rounded border border-purple-500/40 text-purple-500 bg-purple-500/5 hover:bg-purple-500/15 transition-colors disabled:opacity-40"
                    >
                        {isSimulating ? "⌛ Simulating..." : "★ Simulate Winner"}
                    </button>
                </div>

                {error && (
                    <div className="text-xs text-red-400 border border-red-400/20 rounded p-3">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="border border-[#4ade80]/20 rounded-lg p-4 space-y-3 bg-[#4ade80]/5">
                        <p className="text-xs text-[#4ade80] tracking-widest uppercase">Draw Complete</p>
                        {result.drawNumbers && (
                            <div className="flex gap-2 flex-wrap">
                                {result.drawNumbers.map((n: number) => (
                                    <span key={n} className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#4ade80]/40 text-[#4ade80] font-bold text-sm">
                                        {n}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <p className="text-muted-foreground">Winners Found</p>
                                <p className="text-foreground font-bold text-lg">{result.winnersCount}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Jackpot (5-match)</p>
                                <p className={`font-bold text-lg ${result.rollover ? "text-yellow-500" : "text-[#4ade80]"}`}>
                                    {result.rollover ? "Rolled Over 🔁" : "Won!"}
                                </p>
                            </div>
                        </div>
                        {result.drawId && <p className="text-[11px] text-muted-foreground">Draw ID: {result.drawId}</p>}
                        {result.message && <p className="text-[11px] text-[#4ade80] font-bold">{result.message}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export function PublishButton({ drawId, isPublished }: { drawId: string; isPublished: boolean }) {
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        setLoading(true);
        await publishDraw(drawId);
        setLoading(false);
    };

    if (isPublished) {
        return <span className="text-[10px] uppercase text-[#4ade80] tracking-wider">Published</span>;
    }

    return (
        <button
            onClick={handlePublish}
            disabled={loading}
            className="text-[11px] px-3 py-1 rounded border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors disabled:opacity-40"
        >
            {loading ? "..." : "Publish"}
        </button>
    );
}
