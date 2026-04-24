import prisma from "@/lib/prisma";
import { CharityManagement } from "@/components/admin/charity-management";

export default async function AdminCharitiesPage() {
    const charities = await prisma.charity.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-border">
                <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase mb-1">Management</p>
                <h1 className="text-2xl font-bold text-foreground">Charities</h1>
                <p className="text-xs text-muted-foreground mt-1">Create and manage the charities available for users to support.</p>
            </div>
            <CharityManagement charities={charities} />
        </div>
    );
}
