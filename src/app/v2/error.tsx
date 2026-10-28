"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;
  return (
    <div className="card mx-auto max-w-lg p-6">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <button className="btn-orange mt-4" onClick={reset}>Retry</button>
    </div>
  );
}
