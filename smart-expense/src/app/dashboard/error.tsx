"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <h2 className="text-2xl font-bold text-red-600">
          Something went wrong!
        </h2>

        <p className="mt-3 text-gray-600">We couldn't load the dashboard.</p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-black px-5 py-3 font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
