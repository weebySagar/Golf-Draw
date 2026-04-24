import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { BarChart2, Dices, Trophy, Users, Heart } from "lucide-react";
import { AdminMobileNav } from "@/components/admin/mobile-nav";

const NAV_ITEMS = [
    { href: "/admin", label: "Analytics", icon: BarChart2 },
    { href: "/admin/draws", label: "Draws", icon: Dices },
    { href: "/admin/winnings", label: "Winnings", icon: Trophy },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/charities", label: "Charities", icon: Heart },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/login");

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "ADMIN") redirect("/dashboard");

    return (
        <div className="flex min-h-screen bg-background text-foreground font-mono">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-60 shrink-0 border-r border-border flex-col bg-background">
                <div className="px-5 py-6 border-b border-border flex justify-between items-center">
                    <div>
                        <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase">Admin Console</p>
                        <p className="text-lg font-bold mt-1 text-foreground">Golf Draw</p>
                    </div>
                    <ThemeSwitcher />
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm group"
                            >
                                <Icon className="h-4 w-4 text-[#4ade80] shrink-0 group-hover:scale-110 transition-transform" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-4 py-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-card border border-border p-3">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#4ade80] to-emerald-600 flex items-center justify-center text-xs font-bold text-black uppercase">
                            {user?.name?.[0] || "A"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-xs font-medium text-foreground">{user?.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <Link href="/dashboard" className="block text-[11px] text-[#4ade80] hover:text-[#86efac] transition-colors px-1">
                        ← User Dashboard
                    </Link>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main content column */}
            <div className="flex flex-1 flex-col min-w-0">
                {/* Mobile Navigation (header + slide drawer) */}
                <AdminMobileNav userName={user?.name} userEmail={user?.email} />

                <main className="flex-1 overflow-auto">
                    <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
