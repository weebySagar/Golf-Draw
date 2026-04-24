import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LayoutDashboard, Trophy, Settings } from "lucide-react";
import { MobileUserNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-border bg-background lg:flex lg:flex-col">
                <div className="flex h-16 items-center justify-between border-b border-border px-6">
                    <Link href="/" className="flex flex-col">
                        <p className="text-[10px] tracking-[0.4em] text-[#4ade80] uppercase font-mono">Golf Draw</p>
                        <p className="text-sm font-bold -mt-0.5">Member Portal</p>
                    </Link>
                    <ThemeSwitcher />
                </div>

                <nav className="flex flex-col gap-1 p-4 flex-1">
                    {[
                        { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
                        { href: "/dashboard/winnings", label: "My Winnings", Icon: Trophy },
                        { href: "/dashboard/settings", label: "Settings", Icon: Settings },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground group"
                        >
                            <item.Icon className="h-4 w-4 shrink-0 text-[#4ade80] group-hover:scale-110 transition-transform" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="border-t border-border p-4">
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-card border border-border p-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#4ade80] to-emerald-600 flex items-center justify-center text-xs font-bold text-black uppercase">
                                {session.user.name?.[0] || "U"}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-xs font-medium text-foreground">{session.user.name}</p>
                                <p className="truncate text-[10px] text-muted-foreground">{session.user.email}</p>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <SignOutButton compact />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col lg:pl-64">
                {/* Mobile Header */}
                <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
                    <Link href="/" className="flex flex-col">
                        <p className="text-[10px] tracking-[0.4em] text-[#4ade80] uppercase font-mono leading-none">Golf Draw</p>
                        <p className="text-xs font-bold text-foreground leading-tight">Member Portal</p>
                    </Link>
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher />
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4ade80] to-emerald-600 flex items-center justify-center text-xs font-bold text-black uppercase">
                            {session.user.name?.[0] || "U"}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 pb-24 lg:p-10 lg:pb-10">
                    <div className="mx-auto max-w-5xl">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileUserNav userName={session.user.name} />
        </div>
    );
}
