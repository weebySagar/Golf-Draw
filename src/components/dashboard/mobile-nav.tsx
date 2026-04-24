"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, Settings, LogOut, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/dashboard/winnings", label: "My Winnings", Icon: Trophy },
    { href: "/dashboard/settings", label: "Settings", Icon: Settings },
];

export function MobileUserNav({ userName }: { userName?: string | null }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSigningOut, setIsSigningOut] = useState(false);

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
        /* Fixed bottom navigation bar for mobile */
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t border-border">
            <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
                {NAV_ITEMS.map(({ href, label, Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-1 transition-all min-w-[64px] relative",
                                isActive ? "text-[#4ade80]" : "text-muted-foreground hover:text-[#4ade80]"
                            )}
                        >
                            {isActive && (
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#4ade80] rounded-full" />
                            )}
                            <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
                            <span className="text-[10px] font-bold tracking-wide">{label}</span>
                        </Link>
                    );
                })}
                <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-red-400 transition-colors min-w-[60px] disabled:opacity-50"
                >
                    {isSigningOut ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                        <LogOut className="h-5 w-5" />
                    )}
                    <span className="text-[10px] font-medium tracking-wide">Sign Out</span>
                </button>
            </div>
        </nav>
    );
}
