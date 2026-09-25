"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { expenseCategories, incomeCategories } from "@/src/lib/categories";
import Link from "next/link";

export default function NewTransactionPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
    paymentMethod: "UPI",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to create transaction");
        return;
      }

      window.dispatchEvent(new Event("transactionUpdated"));
      router.push("/transactions");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/transactions" className="text-sm font-medium underline">
          ← Back to Transactions
        </Link>

        <div className="mt-5 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Add Transaction</h1>

          <p className="mt-2 text-gray-500">Record your income or expense.</p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Title */}

            <div>
              <label htmlFor="title" className="mb-2 block font-medium">
                Title
              </label>

              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Grocery Shopping"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Amount */}

            <div>
              <label htmlFor="amount" className="mb-2 block font-medium">
                Amount
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Type */}

            <div>
              <label htmlFor="type" className="mb-2 block font-medium">
                Type
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="expense">Expense</option>

                <option value="income">Income</option>
              </select>
            </div>

            {/* Category */}

            <div>
              <label htmlFor="category" className="mb-2 block font-medium">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Category</option>

                {(formData.type === "expense"
                  ? expenseCategories
                  : incomeCategories
                ).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}

            <div>
              <label htmlFor="date" className="mb-2 block font-medium">
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Payment method */}

            <div>
              <label htmlFor="paymentMethod" className="mb-2 block font-medium">
                Payment Method
              </label>

              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>

            {/* Notes */}

            <div>
              <label htmlFor="notes" className="mb-2 block font-medium">
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes"
                rows={4}
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black p-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Transaction"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
