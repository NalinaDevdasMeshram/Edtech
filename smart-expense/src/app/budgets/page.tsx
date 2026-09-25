"use client";

import { useEffect, useState } from "react";
import { expenseCategories } from "@/src/lib/categories";

type Budget = {
  _id: string;
  category: string;
  limit: number;
  month: string;
  spent: number;
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const totalBudget = budgets.reduce(
    (total, budget) => total + budget.limit,
    0,
  );

  const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0);

  const remaining = totalBudget - totalSpent;

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        return;
      }

      setBudgets(result.data || []);
    } catch (error) {
      console.error("Failed to load budgets:", error);
    }
  };

  // Load budgets when page opens
  useEffect(() => {
    fetchBudgets();
  }, []);

  // Refresh budgets when transaction changes
  useEffect(() => {
    const handleTransactionUpdate = () => {
      fetchBudgets();
    };

    window.addEventListener("transactionUpdated", handleTransactionUpdate);

    return () => {
      window.removeEventListener("transactionUpdated", handleTransactionUpdate);
    };
  }, []);

  // Add budget
  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !limit) {
      alert("Please select a category and enter a budget limit.");
      return;
    }

    try {
      const month = new Date().toISOString().slice(0, 7);

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          limit: Number(limit),
          month,
        }),
      });

      const responseText = await response.text();

      let result;

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        console.error("Invalid JSON response:", error);
        alert("Server returned an invalid response.");
        return;
      }

      if (!response.ok) {
        alert(result.message || "Failed to create budget");
        return;
      }

      await fetchBudgets();

      setCategory("");
      setLimit("");
      setShowForm(false);

      alert("Budget created successfully");
    } catch (error) {
      console.error("Add budget error:", error);
      alert("Something went wrong");
    }
  };

  // Delete budget
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      const responseText = await response.text();

      let result;

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        console.error("Delete budget returned non-JSON:", responseText);
        alert("Server returned an invalid response.");
        return;
      }

      if (!response.ok) {
        alert(result.message || "Failed to delete budget");
        return;
      }

      setBudgets((prev) => prev.filter((budget) => budget._id !== id));

      alert("Budget deleted successfully");
    } catch (error) {
      console.error("Delete budget error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>

            <p className="mt-1 text-gray-500">
              Manage your monthly spending limits
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            {showForm ? "Cancel" : "+ Add Budget"}
          </button>
        </div>

        {/* Add Budget Form */}
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Add New Budget
            </h2>

            <form
              onSubmit={handleAddBudget}
              className="grid gap-5 md:grid-cols-2"
            >
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                >
                  <option value="">Select Category</option>

                  {expenseCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Limit */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Monthly Budget Limit
                </label>

                <input
                  type="number"
                  min="1"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="Enter budget amount"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
                >
                  Create Budget
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          {/* Total Budget */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Budget</p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              ₹{totalBudget.toLocaleString("en-IN")}
            </h2>
          </div>

          {/* Total Spent */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Spent</p>

            <h2 className="mt-2 text-2xl font-bold text-red-600">
              ₹{totalSpent.toLocaleString("en-IN")}
            </h2>
          </div>

          {/* Remaining */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Remaining</p>

            <h2
              className={`mt-2 text-2xl font-bold ${
                remaining >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{remaining.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        {/* Budget List */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly Budgets
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track your spending against each category
            </p>
          </div>

          {budgets.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-500">No budgets created yet.</p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-3 font-medium text-black underline"
              >
                Create your first budget
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {budgets.map((budget) => {
                const percentage =
                  budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;

                const progress = Math.min(percentage, 100);

                return (
                  <div
                    key={budget._id}
                    className="rounded-xl border border-gray-200 p-5"
                  >
                    {/* Budget Header */}
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {budget.category}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹{budget.spent.toLocaleString("en-IN")} spent of ₹
                          {budget.limit.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
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

                    {/* Budget Details */}
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {Math.round(percentage)}% used
                      </span>

                      <span
                        className={
                          budget.limit - budget.spent >= 0
                            ? "font-medium text-green-600"
                            : "font-medium text-red-600"
                        }
                      >
                        ₹
                        {Math.max(
                          budget.limit - budget.spent,
                          0,
                        ).toLocaleString("en-IN")}{" "}
                        remaining
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
