import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
    return (
        <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Register</h1>
            <p className="text-sm text-muted-foreground">
                Join our platform to track scores and win prizes!
            </p>
            <div className="mt-8 flex justify-center">
                <RegisterForm />
            </div>
        </div>
    );
}
