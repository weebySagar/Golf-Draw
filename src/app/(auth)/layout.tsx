import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-[#080c10] text-white flex flex-col lg:flex-row overflow-hidden">
            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
                {/* Grid bg */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(74,222,128,.6) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(74,222,128,.6) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
                <div className="pointer-events-none absolute left-0 top-0 w-full h-full bg-gradient-to-br from-emerald-900/20 to-transparent" />

                <Link href="/" className="relative z-10">
                    <p className="text-[10px] tracking-[0.4em] text-[#4ade80] uppercase font-mono">Golf Draw</p>
                    <p className="text-xl font-bold -mt-0.5">& Charity</p>
                </Link>

                <div className="relative z-10 space-y-6">
                    <div>
                        <h2 className="text-5xl font-black leading-tight text-white">
                            Play.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-teal-400">Give.</span><br />
                            Win.
                        </h2>
                        <p className="mt-4 text-[#555] text-sm max-w-xs leading-relaxed">
                            Your Stableford scores become your lottery ticket. Every subscription funds a good cause.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: "5", label: "Draw Numbers" },
                            { value: "10%", label: "Min. to Charity" },
                            { value: "£££", label: "Monthly Jackpot" },
                        ].map(({ value, label }) => (
                            <div key={label} className="border border-white/5 rounded-xl p-3 bg-white/2">
                                <p className="text-xl font-bold text-[#4ade80]">{value}</p>
                                <p className="text-[10px] text-[#444] mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-[11px] text-[#333]">© {new Date().getFullYear()} Golf Draw & Charity</p>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-16 relative">
                <div className="w-full max-w-sm space-y-2">
                    {/* Mobile logo */}
                    <Link href="/" className="flex lg:hidden mb-8">
                        <span className="text-sm font-bold">Golf Draw & Charity</span>
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
}
