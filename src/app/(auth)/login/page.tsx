import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
                Welcome back to your account
            </p>
            <div className="mt-8 flex justify-center">
                <LoginForm />
            </div>
        </div>
    );
}
