"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error: signUpError } = await authClient.signUp.email({
                email,
                password,
                name,
            });

            if (signUpError) {
                setError(signUpError.message || "Failed to create account.");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
                <p className="text-sm text-[#555]">Enter your details to join the community.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-widest text-[#444]" htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-white/2 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-widest text-[#444]" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="w-full bg-white/2 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-widest text-[#444]" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white/2 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-[#4ade80] text-black font-bold text-sm hover:bg-[#86efac] transition-all disabled:opacity-50"
                >
                    {isLoading ? "Creating account..." : "Sign Up →"}
                </button>
            </form>

            <p className="text-center text-xs text-[#555]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#4ade80] hover:underline">Sign In</Link>
            </p>
        </div>
    );
}
