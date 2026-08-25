import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-void px-6 text-center">
      <span className="label !text-signal-bright">Error / 404</span>
      <h1 className="display text-[length:var(--text-display-md)] text-bone">
        Signal lost.
      </h1>
      <p className="max-w-sm leading-relaxed text-mute">
        That route isn&rsquo;t part of the system. Head back to the main sequence.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-bone px-6 py-3 text-sm font-medium text-void transition-colors hover:bg-signal-bright"
      >
        Return home
      </Link>
    </main>
  );
}
