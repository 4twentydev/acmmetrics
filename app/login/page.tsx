import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 pb-16 pt-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-black/10 bg-white p-8 shadow-sm shadow-black/5 dark:border-white/10 dark:bg-zinc-900">
        <div className="space-y-4 text-center">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200">
            ACM Weekly login
          </span>
          <h1 className="text-4xl font-semibold text-black dark:text-white">Sign in</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Username format:
            <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
              lastname-firstname
            </code>
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Trouble signing in?{" "}
          <Link href="mailto:ops@acmweekly.com" className="font-semibold text-emerald-700">
            Contact ops@acmweekly.com
          </Link>
        </p>
      </div>
    </main>
  );
}
