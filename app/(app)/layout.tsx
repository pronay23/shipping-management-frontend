import AppShell from "../components/AppShell";
import { RequireAuth } from "../features/auth/components/RequireAuth";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}