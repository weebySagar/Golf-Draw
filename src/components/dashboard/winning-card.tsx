"use client";

import { useState } from "react";
import { uploadWinningProof } from "@/actions/winnings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Awaiting Proof Upload", color: "text-yellow-600" },
    ADMIN_REVIEW: { label: "Under Admin Review", color: "text-blue-600" },
    PAID: { label: "Paid ✓", color: "text-green-600" },
    REJECTED: { label: "Rejected", color: "text-red-600" },
};

export function WinningCard({ winning }: { winning: any }) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const statusInfo = STATUS_LABELS[winning.status] ?? { label: winning.status, color: "text-gray-500" };

    const handleProofUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.set("winningsId", winning.id);

        try {
            const res = await uploadWinningProof(formData);
            if (res?.error) {
                setError(res.error);
            } else {
                setSuccess(true);
            }
        } catch (err: any) {
            setError(err.message || "Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        {winning.matchType}-Match Winner 🏆
                    </CardTitle>
                    <span className={`text-sm font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                </div>
                <CardDescription>
                    Draw: {new Date(winning.prizePool.draw.month).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Prize Amount</p>
                        <p className="text-2xl font-bold text-primary">£{winning.amount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Draw Numbers</p>
                        <div className="flex gap-1 mt-1 justify-end">
                            {winning.prizePool.draw.numbers.map((n: number) => (
                                <span key={n} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                    {n}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upload proof section — only for PENDING winners */}
                {winning.status === "PENDING" && !success && (
                    <div className="border rounded-lg p-4 space-y-3">
                        <p className="text-sm font-medium">
                            Upload proof from your golf platform to claim your prize.
                        </p>
                        <form onSubmit={handleProofUpload} className="flex flex-col gap-2">
                            <input
                                type="file"
                                name="proof"
                                accept="image/*"
                                required
                                className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                            />
                            {error && <p className="text-xs text-red-500">{error}</p>}
                            <Button type="submit" size="sm" disabled={isUploading} className="w-fit">
                                {isUploading ? "Uploading..." : "Submit Proof"}
                            </Button>
                        </form>
                    </div>
                )}

                {(winning.status === "ADMIN_REVIEW" || success) && (
                    <div className="text-sm p-3 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        Your proof has been submitted. Our team will review it within 48 hours.
                    </div>
                )}

                {winning.proofImage && (
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Submitted Proof</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={winning.proofImage} alt="Proof" className="w-full max-h-48 object-cover rounded-md border" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
