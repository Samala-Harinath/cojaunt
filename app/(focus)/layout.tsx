import { AuthGate } from "@/components/auth/auth-gate";

/** Full-attention screens (onboarding, chat threads, Trip Mode, reflection) have no tab bar. */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col">{children}</div>
    </AuthGate>
  );
}
