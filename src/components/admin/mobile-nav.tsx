"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart2, Dices, Trophy, Users, Heart, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/admin", label: "Analytics", Icon: BarChart2 },
    { href: "/admin/draws", label: "Draws", Icon: Dices },
    { href: "/admin/winnings", label: "Winnings", Icon: Trophy },
    { href: "/admin/users", label: "Users", Icon: Users },
    { href: "/admin/charities", label: "Charities", Icon: Heart },
];

interface AdminMobileNavProps {
    userName?: string | null;
    userEmail?: string | null;
}

export function AdminMobileNav({ userName, userEmail }: AdminMobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await authClient.signOut();
            router.push("/login");
            router.refresh();
        } catch {
            setIsSigningOut(false);
        }
    };

    return (
        <>
            {/* Mobile Top Header */}
            <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden shrink-0">
                <div>
                    <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase font-mono leading-none">Admin</p>
                    <p className="text-sm font-bold text-foreground leading-tight">Golf Draw</p>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Drawer Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-in Drawer */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background border-r border-border transition-transform duration-300 ease-in-out lg:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-border">
                    <div>
                        <p className="text-[10px] tracking-[0.3em] text-[#4ade80] uppercase font-mono">Admin Console</p>
                        <p className="text-base font-bold text-foreground mt-0.5">Golf Draw</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map(({ href, label, Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm group"
                        >
                            <Icon className="h-4 w-4 text-[#4ade80] shrink-0 group-hover:scale-110 transition-transform" />
                            {label}
                        </Link>
                    ))}
                    <div className="pt-2 border-t border-border mt-2">
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm group"
                        >
                            <LayoutDashboard className="h-4 w-4 text-[#4ade80] shrink-0" />
                            User Dashboard
                        </Link>
                    </div>
                </nav>

                {/* User Card + Sign Out */}
                <div className="px-4 py-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-card border border-border p-3">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#4ade80] to-emerald-600 flex items-center justify-center text-xs font-bold text-black uppercase">
                            {userName?.[0] || "A"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-xs font-medium text-foreground">{userName}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{userEmail}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                        {isSigningOut ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <LogOut className="h-4 w-4 shrink-0" />
                        )}
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
