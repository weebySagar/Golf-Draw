"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateCharityPreferences(formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const charityIdStr = formData.get("charityId") as string;
        const percentageStr = formData.get("percentage") as string;

        const percentage = parseInt(percentageStr, 10);
        if (isNaN(percentage) || percentage < 10 || percentage > 100) {
            return { error: "Percentage must be between 10 and 100." };
        }

        const data: any = {
            charityPercentage: percentage
        };

        if (charityIdStr !== undefined && charityIdStr !== null) {
            data.charityId = charityIdStr === "" || charityIdStr === "none" ? null : charityIdStr;
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "An unexpected error occurred." };
    }
}
