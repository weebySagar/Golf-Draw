"use client";

import { useState } from "react";
import { updateCharityPreferences } from "@/actions/charity";

export function CharityForm({
    currentPercentage,
    currentCharityId,
    charities
}: {
    currentPercentage: number;
    currentCharityId: string | null | undefined;
    charities: any[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        
        try {
            const res = await updateCharityPreferences(formData);
            if (res?.error) {
                setError(res.error);
            } else {
                setSuccess(true);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground" htmlFor="charityId">Select Partner Charity</label>
                <select 
                    id="charityId" 
                    name="charityId" 
                    defaultValue={currentCharityId || ""} 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#4ade80]/50 transition-colors appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23555\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                >
                    <option value="">-- No Specific Charity --</option>
                    {charities.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground" htmlFor="percentage">Donation Percentage (Min 10%)</label>
                <div className="relative">
                    <input 
                        id="percentage" 
                        name="percentage" 
                        type="number" 
                        min="10" 
                        max="100" 
                        defaultValue={currentPercentage} 
                        required 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#4ade80]">%</span>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-400">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/20 text-[10px] text-[#4ade80]">
                    Preferences updated successfully.
                </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold text-xs hover:bg-[#4ade80] hover:text-black transition-all disabled:opacity-50"
            >
                {isLoading ? "Saving Settings..." : "Apply Preferences →"}
            </button>
        </form>
    );
}
