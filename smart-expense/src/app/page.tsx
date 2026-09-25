import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold bg-orange-500 rounded-2xl px-2 py-1.5 text-white hover:bg-orange-400">
            SmartSpend AI
          </h1>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 hover:bg-slate-800"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-blue-400">AI-Powered Financial Intelligence</p>

        <h2 className="text-5xl font-bold md:text-7xl">
          Understand your money.
        </h2>

        <h2 className="mt-2 text-5xl font-bold text-blue-400 md:text-7xl">
          Improve your spending.
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          SmartSpend AI helps you track expenses, manage budgets, understand
          spending patterns and get intelligent financial insights.
        </p>

        <Link
          href="/register"
          className="mt-8 rounded-lg bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-700"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}
