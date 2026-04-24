"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { executeDraw, DrawMode, UserTicket } from "@/lib/draw-engine";
import { revalidatePath } from "next/cache";

/**
 * Admin Server Action: Execute the monthly draw.
 *
 * 1. Fetches all active subscribers with their latest ≤5 scores.
 * 2. Calculates the prize pool from all active subscriptions.
 * 3. Runs the draw engine.
 * 4. Persists Draw, PrizePool, and Winnings records.
 * 5. Marks any previous month's rolled-over pool.
 */
export async function runMonthlyDraw(mode: DrawMode = "random") {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { error: "Unauthorized" };

        // Check admin role
        const requestingUser = await prisma.user.findUnique({
            where: { id: session.user.id }
        });
        if (requestingUser?.role !== "ADMIN") return { error: "Forbidden: Admins only." };

        // ── 1. Collect all eligible subscribers ─────────────────────────
        const subscribers = await prisma.user.findMany({
            where: { subscriptionStatus: "active" },
            include: {
                scores: {
                    orderBy: { date: "desc" },
                    take: 5,
                }
            }
        });

        // Filter to those who have at least 1 score
        const tickets: UserTicket[] = subscribers
            .filter((u) => u.scores.length > 0)
            .map((u) => ({
                userId: u.id,
                scores: u.scores.map((s) => s.value),
            }));

        if (tickets.length === 0) {
            return { error: "No eligible users with scores found." };
        }

        // ── 2. Calculate prize pool ──────────────────────────────────────
        // Count active subscribers × monthly subscription price
        // For now we use a fixed £9.99/month model — this should come from
        // Stripe product metadata in a production scenario.
        const MONTHLY_FEE = 9.99;
        const totalPool = subscribers.length * MONTHLY_FEE;

        // Check for any unresolved rollover from a prior draw
        const lastRolledDraw = await prisma.prizePool.findFirst({
            where: { rolledOver: true },
            orderBy: { draw: { executedAt: "desc" } },
            include: { draw: true }
        });
        const rolloverAmount = lastRolledDraw ? lastRolledDraw.match5Share : 0;

        // ── 3. Run the draw ──────────────────────────────────────────────
        const result = executeDraw(tickets, totalPool, mode, rolloverAmount);

        // ── 4. Persist to database (transaction) ─────────────────────────
        const now = new Date();
        const monthDate = new Date(now.getFullYear(), now.getMonth(), 1);

        const draw = await prisma.$transaction(async (tx) => {
            // Create the Draw record
            const newDraw = await tx.draw.create({
                data: {
                    month: monthDate,
                    numbers: result.drawNumbers,
                    isPublished: false,
                }
            });

            // Effective pool = base + any rollover
            const effectivePool = totalPool + rolloverAmount;

            // Create PrizePool
            const prizePool = await tx.prizePool.create({
                data: {
                    drawId: newDraw.id,
                    totalAmount: effectivePool,
                    match3Share: effectivePool * 0.25,
                    match4Share: effectivePool * 0.35,
                    match5Share: effectivePool * 0.40,
                    rolledOver: result.rollover,
                }
            });

            // Create Winnings for each winner
            if (result.winners.length > 0) {
                await tx.winnings.createMany({
                    data: result.winners.map((w) => ({
                        userId: w.userId,
                        prizePoolId: prizePool.id,
                        matchType: w.matchType,
                        amount: w.amount,
                        status: "PENDING",
                    }))
                });
            }

            return newDraw;
        });

        revalidatePath("/admin/draws");
        return {
            success: true,
            drawId: draw.id,
            drawNumbers: result.drawNumbers,
            winnersCount: result.winners.length,
            rollover: result.rollover,
        };

    } catch (e: any) {
        console.error("Draw error:", e);
        return { error: e.message || "An unexpected error occurred running the draw." };
    }
}

/**
 * Admin Server Action: Publish a completed draw so users can see results.
 */
export async function publishDraw(drawId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { error: "Unauthorized" };

        const requestingUser = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (requestingUser?.role !== "ADMIN") return { error: "Forbidden: Admins only." };

        await prisma.draw.update({
            where: { id: drawId },
            data: { isPublished: true }
        });

        revalidatePath("/admin/draws");
        revalidatePath("/draws");
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

/**
 * Admin Server Action: Simulate a test winner by creating a manual 5-match winning record
 * for an active user in the latest draw, or forcing the draw numbers to match.
 */
export async function simulateTestWinner() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { error: "Unauthorized" };

        const requestingUser = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (requestingUser?.role !== "ADMIN") return { error: "Forbidden: Admins only." };

        // 1. Find the latest draw that has a prize pool
        const latestDraw = await prisma.draw.findFirst({
            orderBy: { executedAt: "desc" },
            include: { prizePool: true }
        });

        if (!latestDraw || !latestDraw.prizePool) {
            return { error: "No executed draw found. Run a draw first." };
        }

        // 2. Give the current admin or a random user a winning record
        const winningsPoolId = latestDraw.prizePool.id;

        const amountToWin = latestDraw.prizePool.match5Share > 0 
           ? latestDraw.prizePool.match5Share 
           : 1000;

        await prisma.winnings.create({
            data: {
                userId: session.user.id,
                prizePoolId: winningsPoolId,
                matchType: 5,
                amount: amountToWin,
                status: "PENDING"
            }
        });

        // 3. Mark the pool as not rolled over now that we simulated a winner
        await prisma.prizePool.update({
            where: { id: winningsPoolId },
            data: { rolledOver: false }
        });

        revalidatePath("/admin/draws");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/winnings");
        
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Failed to simulate winner." };
    }
}
