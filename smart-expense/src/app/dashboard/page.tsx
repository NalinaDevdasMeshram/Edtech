"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
};

type Category = {
  category: string;
  amount: number;
};

type DashboardData = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  categoryBreakdown: Category[];
  recentTransactions: Transaction[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("/api/dashboard");

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load dashboard");
          return;
        }

        setData(result.data);
      } catch (error) {
        console.error(error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-100 p-6 text-red-700">{error}</div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SmartSpend Dashboard</h1>

            <p className="mt-1 text-gray-500">
              Understand your money. Make smarter decisions.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 md:grid-cols-4">
          {/* Balance */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Current Balance</p>

            <h2 className="mt-2 text-3xl font-bold">
              ₹{data.balance.toLocaleString("en-IN")}
            </h2>
          </div>

          {/* Income */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Income</p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              ₹{data.totalIncome.toLocaleString("en-IN")}
            </h2>
          </div>

          {/* Expenses */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Expenses</p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              ₹{data.totalExpenses.toLocaleString("en-IN")}
            </h2>
          </div>

          {/* Savings */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Savings Rate</p>

            <h2 className="mt-2 text-3xl font-bold">{data.savingsRate}%</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Category Breakdown */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Spending by Category</h2>

            {data.categoryBreakdown.length === 0 ? (
              <p className="mt-6 text-gray-500">No expense data available.</p>
            ) : (
              <div className="mt-6 space-y-5">
                {data.categoryBreakdown.map((item) => {
                  const percentage =
                    data.totalExpenses > 0
                      ? (item.amount / data.totalExpenses) * 100
                      : 0;

                  return (
                    <div key={item.category}>
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium">{item.category}</span>

                        <span className="text-gray-600">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Transactions</h2>

              <Link
                href="/transactions"
                className="text-sm font-medium underline"
              >
                View All
              </Link>
            </div>

            {data.recentTransactions.length === 0 ? (
              <p className="mt-6 text-gray-500">No transactions yet.</p>
            ) : (
              <div className="mt-5 divide-y">
                {data.recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <p className="font-medium">{transaction.title}</p>

                      <p className="text-sm text-gray-500">
                        {transaction.category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={
                          transaction.type === "income"
                            ? "font-semibold text-green-600"
                            : "font-semibold text-red-600"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString("en-IN")}
                      </p>

                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/transactions/new"
              className="rounded-xl bg-black px-5 py-3 font-medium text-white"
            >
              + Add Transaction
            </Link>

            <Link
              href="/transactions"
              className="rounded-xl border bg-white px-5 py-3 font-medium"
            >
              View Transactions
            </Link>

            <Link
              href="/budgets"
              className="rounded-xl border bg-white px-5 py-3 font-medium"
            >
              Manage Budgets
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
