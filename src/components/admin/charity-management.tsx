"use client";

import { useState } from "react";
import { createCharity, toggleCharityStatus } from "@/actions/charities";

export function CharityManagement({ charities }: { charities: any[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const res = await createCharity(formData);

        if (res?.error) {
            setError(res.error);
        } else {
            setIsAdding(false);
            (e.target as HTMLFormElement).reset();
        }
        setIsLoading(false);
    };

    const handleToggle = async (id: string, currentActive: boolean) => {
        await toggleCharityStatus(id, !currentActive);
    };

    return (
        <div className="space-y-4">
            {/* Add new charity */}
            <div className="flex justify-end">
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-xs border border-[#4ade80]/40 text-[#4ade80] px-4 py-2 rounded hover:bg-[#4ade80]/10 transition-colors"
                >
                    {isAdding ? "✕ Cancel" : "+ Add Charity"}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleCreate} className="border border-border rounded-lg p-5 space-y-3 bg-card">
                    <p className="text-xs tracking-widest uppercase text-muted-foreground">New Charity</p>
                    <input
                        name="name"
                        required
                        placeholder="Charity Name"
                        className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-[#4ade80]/50"
                    />
                    <textarea
                        name="description"
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-[#4ade80]/50 resize-none"
                    />
                    {error && <p className="text-xs text-red-400">{error}</p>}
                    <button type="submit" disabled={isLoading} className="text-xs bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30 px-4 py-2 rounded hover:bg-[#4ade80]/20 transition-colors disabled:opacity-40">
                        {isLoading ? "Saving..." : "Create Charity"}
                    </button>
                </form>
            )}

            {/* Charity Table */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-accent/20">
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Name</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Description</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Status</th>
                            <th className="text-left px-4 py-3 text-[11px] tracking-widest uppercase text-muted-foreground font-normal">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {charities.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground text-xs">No charities added yet.</td>
                            </tr>
                        ) : (
                            charities.map((c) => (
                                <tr key={c.id} className="hover:bg-accent/40 transition-colors">
                                    <td className="px-4 py-3 text-foreground">{c.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs truncate">{c.description ?? "—"}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] uppercase tracking-wider ${c.active ? "text-[#4ade80]" : "text-muted-foreground"}`}>
                                            {c.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleToggle(c.id, c.active)}
                                            className={`text-[11px] px-3 py-1 rounded border transition-colors ${c.active
                                                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                : "border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10"
                                                }`}
                                        >
                                            {c.active ? "Deactivate" : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}
