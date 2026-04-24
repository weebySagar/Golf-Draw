"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
    /** compact = icon-only button (for user dashboard avatar card) */
    compact?: boolean;
}

export function SignOutButton({ compact = false }: SignOutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await authClient.signOut();
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Failed to sign out:", error);
            setIsLoading(false);
        }
    };

    if (compact) {
        return (
            <button
                onClick={handleSignOut}
                disabled={isLoading}
                title="Sign Out"
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border border-border",
                    "text-muted-foreground hover:text-red-400 hover:border-red-400/40 hover:bg-red-500/10",
                    "transition-all disabled:opacity-50"
                )}
            >
                {isLoading ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    <LogOut className="h-3.5 w-3.5" />
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={isLoading}
            className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2",
                "text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10",
                "transition-all disabled:opacity-50"
            )}
        >
            {isLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                <LogOut className="h-4 w-4 shrink-0" />
            )}
            Sign Out
        </button>
    );
}
