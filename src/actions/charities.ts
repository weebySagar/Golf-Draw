"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createCharity(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "ADMIN") return { error: "Forbidden" };

    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();

    if (!name) return { error: "Charity name is required." };

    await prisma.charity.create({ data: { name, description } });

    revalidatePath("/admin/charities");
    return { success: true };
}

export async function toggleCharityStatus(charityId: string, active: boolean) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { error: "Unauthorized" };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "ADMIN") return { error: "Forbidden" };

    await prisma.charity.update({ where: { id: charityId }, data: { active } });
    revalidatePath("/admin/charities");
    return { success: true };
}
