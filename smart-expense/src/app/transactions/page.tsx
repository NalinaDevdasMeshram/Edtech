import Link from "next/link";

export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">SmartSpend AI</h1>

          <Link href="/dashboard" className="text-blue-600">
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Transactions</h2>

            <p className="mt-2 text-slate-500">
              Manage your income and expenses.
            </p>
          </div>

          <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
            + Add Transaction
          </button>
        </div>

        <div className="mt-8 rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left">Title</th>

                  <th className="px-6 py-4 text-left">Category</th>

                  <th className="px-6 py-4 text-left">Amount</th>

                  <th className="px-6 py-4 text-left">Type</th>

                  <th className="px-6 py-4 text-left">Date</th>

                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                <TransactionRow
                  title="Swiggy"
                  category="Food"
                  amount="₹450"
                  type="Expense"
                  date="23 Sep 2026"
                />

                <TransactionRow
                  title="Salary"
                  category="Income"
                  amount="₹60,000"
                  type="Income"
                  date="01 Sep 2026"
                />

                <TransactionRow
                  title="Uber"
                  category="Travel"
                  amount="₹320"
                  type="Expense"
                  date="21 Sep 2026"
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function TransactionRow({
  title,
  category,
  amount,
  type,
  date,
}: {
  title: string;
  category: string;
  amount: string;
  type: string;
  date: string;
}) {
  return (
    <tr className="border-b">
      <td className="px-6 py-4">{title}</td>

      <td className="px-6 py-4">{category}</td>

      <td className="px-6 py-4 font-medium">{amount}</td>

      <td
        className={`px-6 py-4 ${
          type === "Income" ? "text-green-600" : "text-red-600"
        }`}
      >
        {type}
      </td>

      <td className="px-6 py-4">{date}</td>

      <td className="px-6 py-4">
        <div className="flex gap-3">
          <button className="text-blue-600">Edit</button>

          <button className="text-red-600">Delete</button>
        </div>
      </td>
    </tr>
  );
}
