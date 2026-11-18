import { AuthGate } from "@/components/auth/auth-gate";
import { Nav } from "@/components/nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="flex min-h-dvh w-full flex-col">
        <Nav />
        <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 pb-24 md:pb-10">{children}</main>
      </div>
    </AuthGate>
  );
}
