"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function EditTransactionPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
    paymentMethod: "",
    notes: "",
  });

  // --------------------------------
  // Fetch single transaction
  // --------------------------------

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/transactions/${id}`);

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load transaction");
          return;
        }

        const transaction: Transaction = result.data;

        setFormData({
          title: transaction.title,
          amount: String(transaction.amount),
          type: transaction.type,
          category: transaction.category,
          date: transaction.date
            ? new Date(transaction.date).toISOString().split("T")[0]
            : "",
          paymentMethod: transaction.paymentMethod || "",
          notes: transaction.notes || "",
        });
      } catch (error) {
        console.error(error);
        setError("Unable to load transaction");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]);

  // --------------------------------
  // Handle input changes
  // --------------------------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------
  // Update transaction
  // --------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
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
        setError(result.message || "Failed to update transaction");
        return;
      }

      router.push("/transactions");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Unable to update transaction");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading transaction...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Transaction</h1>

          <p className="mt-1 text-gray-500">Update your transaction details.</p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {/* Title */}

            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3 outline-none focus:ring-2"
              />
            </div>

            {/* Amount */}

            <div>
              <label className="mb-2 block text-sm font-medium">Amount</label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-lg border p-3 outline-none focus:ring-2"
              />
            </div>

            {/* Type */}

            <div>
              <label className="mb-2 block text-sm font-medium">Type</label>

              <select
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
              <label className="mb-2 block text-sm font-medium">Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3 outline-none focus:ring-2"
              />
            </div>

            {/* Date */}

            <div>
              <label className="mb-2 block text-sm font-medium">Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Payment Method */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Payment Method
              </label>

              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {/* Notes */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border p-3 outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/transactions")}
              className="rounded-lg border px-5 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Transaction"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
