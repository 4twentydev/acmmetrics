"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-slate-50 transition hover:border-white hover:bg-white/10"
    >
      Sign out
    </button>
  );
}
