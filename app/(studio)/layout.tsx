import { AuthGate } from "@/components/auth/auth-gate";

/** Host Studio is a full-width workspace with its own header, so it has no tab bar. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-dvh w-full">{children}</div>
    </AuthGate>
  );
}
