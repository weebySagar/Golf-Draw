"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
            <Link href="/" className="flex flex-col">
                <p className="text-[10px] tracking-[0.4em] text-[#4ade80] uppercase font-mono">Golf Draw</p>
                <p className="text-lg font-bold -mt-0.5 text-white">& Charity</p>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
                <Link href="/draws" className="text-sm text-[#888] hover:text-white transition-colors">Results</Link>
                <Link href="/login" className="text-sm text-[#888] hover:text-white transition-colors">Sign In</Link>
                <Link
                    href="/register"
                    className="text-sm px-5 py-2.5 rounded-full border border-[#4ade80]/40 text-[#4ade80] hover:bg-[#4ade80]/10 transition-all hover:border-[#4ade80]/80 bg-[#4ade80]/5"
                >
                    Get Started →
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Dropdown */}
            <div
                className={cn(
                    "absolute top-full left-0 right-0 mt-2 mx-4 p-4 rounded-2xl bg-[#0d1117] border border-white/10 shadow-2xl transition-all duration-300 transform origin-top md:hidden",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
                )}
            >
                <div className="flex flex-col gap-4">
                    <Link
                        href="/draws"
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-[#888] hover:text-white transition-colors px-2 py-2"
                    >
                        Results
                    </Link>
                    <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-[#888] hover:text-white transition-colors px-2 py-2"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center w-full px-5 py-3 rounded-xl bg-[#4ade80] text-black font-bold text-sm hover:bg-[#86efac] transition-all"
                    >
                        Get Started →
                    </Link>
                </div>
            </div>
        </nav>
    );
}
