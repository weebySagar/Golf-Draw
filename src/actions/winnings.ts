"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { supabaseAdmin, PROOF_BUCKET } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * User Server Action: Upload proof of winning to Supabase Storage
 * and mark the winnings record as ADMIN_REVIEW.
 */
export async function uploadWinningProof(formData: FormData) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { error: "Unauthorized" };

        const winningsId = formData.get("winningsId") as string;
        const file = formData.get("proof") as File;

        if (!winningsId || !file) {
            return { error: "Missing required fields." };
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return { error: "Only image files (JPG, PNG, WEBP) are allowed." };
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return { error: "File size must be under 5MB." };
        }

        // Verify this winnings record belongs to this user
        const winnings = await prisma.winnings.findUnique({
            where: { id: winningsId }
        });

        if (!winnings || winnings.userId !== session.user.id) {
            return { error: "Winnings record not found or does not belong to you." };
        }

        if (winnings.status !== "PENDING") {
            return { error: "This record has already been submitted for review." };
        }

        // Upload to Supabase Storage
        const fileName = `${session.user.id}/${winningsId}-${Date.now()}.${file.type.split("/")[1]}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from(PROOF_BUCKET)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return { error: "Failed to upload proof image. Please try again." };
        }

        // Get the public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(PROOF_BUCKET)
            .getPublicUrl(fileName);

        // Update the winnings record
        await prisma.winnings.update({
            where: { id: winningsId },
            data: {
                proofImage: publicUrl,
                status: "ADMIN_REVIEW",
            }
        });

        revalidatePath("/dashboard/winnings");
        return { success: true };

    } catch (e: any) {
        console.error("Proof upload error:", e);
        return { error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Admin Server Action: Approve a winning claim — mark as PAID.
 */
export async function approveWinning(winningsId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { error: "Unauthorized" };

        const requestingUser = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (requestingUser?.role !== "ADMIN") return { error: "Forbidden: Admins only." };

        await prisma.winnings.update({
            where: { id: winningsId },
            data: { status: "PAID" }
        });

        revalidatePath("/admin/winnings");
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

/**
 * Admin Server Action: Reject a winning claim.
 */
export async function rejectWinning(winningsId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { error: "Unauthorized" };

        const requestingUser = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (requestingUser?.role !== "ADMIN") return { error: "Forbidden: Admins only." };

        await prisma.winnings.update({
            where: { id: winningsId },
            data: { status: "REJECTED" }
        });

        revalidatePath("/admin/winnings");
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
