"use client";

import { useRouter } from "next/navigation";
import { useAutoLogout } from "../lib/hooks/session";
import { signOut } from "../lib/api/session";

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    localStorage.clear();
    router.replace("/login");
  };

  useAutoLogout(handleLogout);

  return (
    <>{children}</>
  );
}