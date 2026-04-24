"use client";

import { useState } from "react";
import { approveWinning, rejectWinning } from "@/actions/winnings";

const STATUS_STYLES: Record<string, string> = {
    PENDING: "text-yellow-500",
    ADMIN_REVIEW: "text-blue-400",
    PAID: "text-[#4ade80]",
    REJECTED: "text-red-400",
};

export function WinningsReviewTable({ winnings }: { winnings: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    const handleApprove = async (id: string) => {
        setLoadingId(id);
        await approveWinning(id);
        setLoadingId(null);
    };

    const handleReject = async (id: string) => {
        setLoadingId(id);
        await rejectWinning(id);
        setLoadingId(null);
    };

    return (
        <>
            <div className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-accent/20">
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">User</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Match</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Amount</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Status</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Proof</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {winnings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-xs">No winnings to review.</td>
                            </tr>
                        ) : (
                            winnings.map((w) => (
                                <tr key={w.id} className="hover:bg-accent/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="text-foreground">{w.user.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{w.user.email}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-muted-foreground/80">{w.matchType}-Match</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[#4ade80] font-bold tabular-nums">£{w.amount.toFixed(2)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] uppercase tracking-wider ${STATUS_STYLES[w.status] ?? "text-muted-foreground"}`}>
                                            {w.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {w.proofImage ? (
                                            <button
                                                onClick={() => setSelectedProof(w.proofImage)}
                                                className="text-[11px] text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 underline underline-offset-2"
                                            >
                                                View Proof
                                            </button>
                                        ) : (
                                            <span className="text-muted-foreground text-[11px]">Not submitted</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {w.status === "ADMIN_REVIEW" ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(w.id)}
                                                    disabled={loadingId === w.id}
                                                    className="text-[11px] px-3 py-1 rounded border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors disabled:opacity-40"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(w.id)}
                                                    disabled={loadingId === w.id}
                                                    className="text-[11px] px-3 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground/60 text-[11px]">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Proof Image Lightbox */}
            {selectedProof && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
                    onClick={() => setSelectedProof(null)}
                >
                    <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedProof(null)}
                            className="absolute -top-10 right-0 text-white text-sm hover:text-[#4ade80]"
                        >
                            ✕ Close
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedProof} alt="Winner Proof" className="w-full rounded-lg border border-[#2a2a2a]" />
                    </div>
                </div>
            )}
        </>
    );
}
