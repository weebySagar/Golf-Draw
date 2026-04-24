"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addScore(formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const dateStr = formData.get("date") as string;
        const valueStr = formData.get("value") as string;

        if (!dateStr || !valueStr) {
            return { error: "Missing required fields." };
        }

        const value = parseInt(valueStr, 10);
        if (isNaN(value) || value < 1 || value > 45) {
            return { error: "Invalid score. Must be between 1 and 45." };
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return { error: "Invalid date." };
        }

        // Check if score exists for date
        const existing = await prisma.score.findUnique({
            where: {
                userId_date: {
                    userId: session.user.id,
                    date: date
                }
            }
        });

        if (existing) {
            return { error: "A score for this date already exists." };
        }

        // Count existing scores
        const userScores = await prisma.score.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'asc' }, // Older first
        });

        // Enforce max 5 rule: delete oldest if we are already at 5
        if (userScores.length >= 5) {
            // Delete the oldest ones to make room for the new one (so total becomes 4 before insertion)
            const idsToDelete = userScores.slice(0, userScores.length - 4).map(s => s.id);
            await prisma.score.deleteMany({
                where: { id: { in: idsToDelete } }
            });
        }

        await prisma.score.create({
            data: {
                userId: session.user.id,
                date: date,
                value: value
            }
        });

        revalidatePath("/dashboard");
        return { success: true };

    } catch (e: any) {
        return { error: e.message || "An unexpected error occurred." };
    }
}
