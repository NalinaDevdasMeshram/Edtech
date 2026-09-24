"use client";

import { useState } from "react";

type Budget = {
  id: number;
  category: string;
  limit: number;
  spent: number;
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 1,
      category: "Food",
      limit: 10000,
      spent: 6500,
    },
    {
      id: 2,
      category: "Transport",
      limit: 5000,
      spent: 3200,
    },
    {
      id: 3,
      category: "Shopping",
      limit: 8000,
      spent: 7200,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const totalBudget = budgets.reduce(
    (total, budget) => total + budget.limit,
    0,
  );

  const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0);

  const remaining = totalBudget - totalSpent;

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !limit) return;

    const newBudget: Budget = {
      id: Date.now(),
      category,
      limit: Number(limit),
      spent: 0,
    };

    setBudgets((prev) => [...prev, newBudget]);

    setCategory("");
    setLimit("");
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>

            <p className="mt-1 text-gray-500">
              Set and manage your monthly spending limits.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add Budget
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Budget</p>

            <h2 className="mt-2 text-2xl font-bold">
              ₹{totalBudget.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Spent</p>

            <h2 className="mt-2 text-2xl font-bold text-red-600">
              ₹{totalSpent.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Remaining</p>

            <h2 className="mt-2 text-2xl font-bold text-green-600">
              ₹{remaining.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Add Budget Form */}
        {showForm && (
          <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Add New Budget</h2>

            <form
              onSubmit={handleAddBudget}
              className="grid gap-5 md:grid-cols-3"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills">Bills</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Budget Limit
                </label>

                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Budget List */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold">Monthly Budgets</h2>

            <p className="mt-1 text-sm text-gray-500">
              Track your spending against each category.
            </p>
          </div>

          <div className="divide-y">
            {budgets.map((budget) => {
              const percentage =
                budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;

              const progress = Math.min(percentage, 100);

              return (
                <div key={budget.id} className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {budget.category}
                      </h3>

                      <p className="text-sm text-gray-500">
                        ₹{budget.spent.toLocaleString()} spent of ₹
                        {budget.limit.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{Math.round(percentage)}%</p>

                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="mt-1 text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${
                        percentage >= 100
                          ? "bg-red-500"
                          : percentage >= 80
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>
                      Remaining: ₹
                      {Math.max(
                        budget.limit - budget.spent,
                        0,
                      ).toLocaleString()}
                    </span>

                    {percentage >= 100 && (
                      <span className="font-medium text-red-600">
                        Budget exceeded
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
