"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function ViewTransactionPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/transactions/${id}`);

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load transaction");
          return;
        }

        setTransaction(result.data);
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading transaction...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => router.back()}
            className="mt-4 rounded-lg border px-4 py-2"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transaction Details</h1>

            <p className="mt-1 text-gray-500">View transaction information.</p>
          </div>

          <Link
            href="/transactions"
            className="rounded-lg border bg-white px-4 py-2"
          >
            Back
          </Link>
        </div>

        {/* Transaction Card */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="space-y-6">
            {/* Title */}

            <div>
              <p className="text-sm text-gray-500">Title</p>

              <p className="mt-1 text-xl font-semibold">{transaction.title}</p>
            </div>

            {/* Amount */}

            <div>
              <p className="text-sm text-gray-500">Amount</p>

              <p
                className={`mt-1 text-2xl font-bold ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}₹
                {transaction.amount.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Details */}

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="mt-1 font-medium capitalize">
                  {transaction.type}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="mt-1 font-medium">{transaction.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="mt-1 font-medium">
                  {new Date(transaction.date).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Method</p>

                <p className="mt-1 font-medium capitalize">
                  {transaction.paymentMethod || "Not specified"}
                </p>
              </div>
            </div>

            {/* Notes */}

            {transaction.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>

                <p className="mt-1 text-gray-700">{transaction.notes}</p>
              </div>
            )}

            {/* Actions */}

            <div className="flex justify-end gap-3 border-t pt-6">
              <Link
                href={`/transactions/${transaction._id}/edit`}
                className="rounded-lg bg-black px-5 py-3 font-medium text-white"
              >
                Edit Transaction
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
