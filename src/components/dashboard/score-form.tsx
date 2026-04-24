"use client";

import { useState } from "react";
import { addScore } from "@/actions/scores";
import { DatePicker } from "@/components/ui/date-picker";

export function ScoreForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        
        try {
            const res = await addScore(formData);
            if (res?.error) {
                setError(res.error);
            } else {
                (e.target as HTMLFormElement).reset();
            }
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground" htmlFor="date">Date Played</label>
                    <DatePicker name="date" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground" htmlFor="value">Stableford Score</label>
                    <input 
                        id="value" 
                        name="value" 
                        type="number" 
                        min="1" 
                        max="45" 
                        placeholder="1-45" 
                        required 
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                    />
                </div>
            </div>
            
            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-400">
                    {error}
                </div>
            )}
            
            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-foreground text-background font-bold text-xs hover:bg-[#4ade80] hover:text-black transition-all disabled:opacity-50"
            >
                {isLoading ? "Verifying..." : "Save Score Entry"}
            </button>
        </form>
    );
}
