"use client";

import { withBasePath } from "@/lib/base-path";

export function LoginForm({ next, label }: { next: string; label: string }) {
  return (
    <form action={withBasePath("/api/session")} method="post" className="mt-6">
      <input type="hidden" name="next" value={next} />
      <button className="btn-orange h-10 px-4" type="submit">
        {label}
      </button>
    </form>
  );
}
