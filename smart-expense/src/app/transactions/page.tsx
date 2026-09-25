"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Transaction = {
  _id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  paymentMethod?: string;
  notes?: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // --------------------------------
  // Fetch transactions
  // --------------------------------

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/transactions");

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to load transactions");
        return;
      }

      setTransactions(result.data || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --------------------------------
  // Delete transaction
  // --------------------------------

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        console.error("Delete API returned non-JSON:", text);
        alert("Delete failed. Server returned an invalid response.");
        return;
      }

      if (!response.ok) {
        alert(result.message || "Delete failed");
        return;
      }

      window.dispatchEvent(new Event("transactionUpdated"));

      setTransactions((previous) =>
        previous.filter((transaction) => transaction._id !== id),
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete transaction");
    }
  };

  // --------------------------------
  // Filter + Search + Sort
  // --------------------------------

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search
    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((transaction) =>
        `${transaction.title} ${transaction.category} ${transaction.notes || ""}`
          .toLowerCase()
          .includes(searchText),
      );
    }

    // Type
    if (typeFilter !== "all") {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Category
    if (categoryFilter !== "all") {
      result = result.filter(
        (transaction) => transaction.category === categoryFilter,
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      if (sortBy === "highest") {
        return b.amount - a.amount;
      }

      if (sortBy === "lowest") {
        return a.amount - b.amount;
      }

      return 0;
    });

    return result;
  }, [transactions, search, typeFilter, categoryFilter, sortBy]);

  // --------------------------------
  // Pagination
  // --------------------------------

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // --------------------------------
  //  Categories
  // --------------------------------

  const categories = Array.from(
    new Set(transactions.map((transaction) => transaction.category)),
  );

  // --------------------------------
  //  Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading transactions...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>

            <p className="mt-1 text-gray-500">
              Search and manage your financial activity.
            </p>
          </div>

          <Link
            href="/transactions/new"
            className="rounded-xl bg-black px-5 py-3 text-center font-semibold text-white"
          >
            + Add Transaction
          </Link>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}

            <div className="md:col-span-1">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium"
              >
                Search
              </label>

              <input
                id="search"
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border p-3 outline-none focus:ring-2"
              />
            </div>

            {/* Type */}

            <div>
              <label htmlFor="type" className="mb-2 block text-sm font-medium">
                Type
              </label>

              <select
                id="type"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border p-3"
              >
                <option value="all">All</option>

                <option value="income">Income</option>

                <option value="expense">Expense</option>
              </select>
            </div>

            {/*Category*/}

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
              >
                Category
              </label>

              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border p-3"
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}

            <div>
              <label htmlFor="sort" className="mb-2 block text-sm font-medium">
                Sort
              </label>

              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border p-3"
              >
                <option value="newest">Newest</option>

                <option value="oldest">Oldest</option>

                <option value="highest">Highest Amount</option>

                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction list */}

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          {paginatedTransactions.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-xl font-semibold">No transactions found</h2>

              <p className="mt-2 text-gray-500">
                Try changing your filters or add a new transaction.
              </p>

              <Link
                href="/transactions/new"
                className="mt-5 inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
              >
                Add Transaction
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Transaction
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium">{transaction.title}</p>

                        {transaction.notes && (
                          <p className="mt-1 text-xs text-gray-500">
                            {transaction.notes}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {transaction.category}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            transaction.type === "income"
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                              : "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                          }
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(transaction.date).toLocaleDateString("en-IN")}
                      </td>

                      <td
                        className={
                          transaction.type === "income"
                            ? "px-6 py-4 text-right font-semibold text-green-600"
                            : "px-6 py-4 text-right font-semibold text-red-600"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/transactions/${transaction._id}/edit`}
                            className="rounded-lg border px-3 py-2 text-sm"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(transaction._id)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="rounded-lg border bg-white px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "rounded-lg bg-black px-4 py-2 text-white"
                      : "rounded-lg border bg-white px-4 py-2"
                  }
                >
                  {page}
                </button>
              ),
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="rounded-lg border bg-white px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
