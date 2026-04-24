import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LandingNav } from "@/components/landing-nav";

export default async function HomePage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) redirect("/dashboard");

    return (
        <main className="relative min-h-screen bg-[#080c10] text-white overflow-hidden flex flex-col">
            {/* Animated grid background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `linear-gradient(rgba(74,222,128,.6) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(74,222,128,.6) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Radial glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[600px] bg-[#4ade80]/5 rounded-full blur-[120px]" />
            <div className="pointer-events-none absolute left-1/4 bottom-0 w-[500px] h-[400px] bg-emerald-900/20 rounded-full blur-[100px]" />

            {/* Nav */}
            <LandingNav />

            {/* Hero */}
            <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-8 pb-24">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80] text-xs tracking-widest uppercase font-mono mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                    Monthly Draw Active
                </div>

                <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-6">
                    <span className="block text-white">Golf.</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-emerald-400 to-teal-400">
                        Charity.
                    </span>
                    <span className="block text-white">Win.</span>
                </h1>

                <p className="max-w-xl text-base md:text-lg text-[#666] leading-relaxed mb-10 px-4">
                    Submit your Stableford scores, support a cause you care about,
                    and enter our monthly prize draw — all in one subscription.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/register"
                        className="px-8 py-3.5 rounded-full bg-[#4ade80] text-black font-bold text-sm hover:bg-[#86efac] transition-all hover:scale-105 shadow-[0_0_40px_rgba(74,222,128,0.3)]"
                    >
                        Start for Free
                    </Link>
                    <Link
                        href="/draws"
                        className="px-8 py-3.5 rounded-full border border-white/10 text-[#888] font-medium text-sm hover:text-white hover:border-white/30 transition-all"
                    >
                        View Past Results
                    </Link>
                </div>
            </section>

            {/* Feature grid */}
            <section className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: "⛳",
                            title: "Score Tracking",
                            desc: "Log your Stableford scores (1–45). Your 5 most recent entries become your draw ticket.",
                        },
                        {
                            icon: "💚",
                            title: "Charity First",
                            desc: "Minimum 10% of every subscription goes directly to your chosen charity — you control the rest.",
                        },
                        {
                            icon: "🏆",
                            title: "Monthly Draws",
                            desc: "Match 3, 4, or all 5 numbers to win 25%, 35%, or 40% of the monthly prize pool.",
                        },
                    ].map((f) => (
                        <div
                            key={f.title}
                            className="group p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-[#4ade80]/20 hover:bg-[#4ade80]/3 transition-all"
                        >
                            <div className="text-3xl mb-4">{f.icon}</div>
                            <h3 className="font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-[#666] leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 px-6 py-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-[11px] text-[#444] font-mono">© {new Date().getFullYear()} Golf Draw & Charity</p>
                <div className="flex gap-8">
                    <Link href="/draws" className="text-[11px] text-[#444] hover:text-[#888] transition-colors">Results</Link>
                    <Link href="/login" className="text-[11px] text-[#444] hover:text-[#888] transition-colors">Login</Link>
                </div>
            </footer>
        </main>
    );
}
