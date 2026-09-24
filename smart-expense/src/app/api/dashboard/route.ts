import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/db";
import { getCurrentUser } from "@/src/lib/auth";
import Transaction from "@/src/models/Transaction";

export async function GET() {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    await connectDB();

    // Get user's transactions
    const transactions = await Transaction.find({
      userId: currentUser.userId,
    })
      .sort({ date: -1 })
      .lean();

    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const transaction of transactions) {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    }

    const balance = totalIncome - totalExpenses;

    // Calculate savings rate
    const savingsRate =
      totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

    // Category breakdown
    const categoryMap: Record<string, number> = {};

    for (const transaction of transactions) {
      if (transaction.type === "expense") {
        const category = transaction.category;

        categoryMap[category] =
          (categoryMap[category] || 0) + transaction.amount;
      }
    }

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Recent transactions
    const recentTransactions = transactions.slice(0, 5).map((transaction) => ({
      id: transaction._id.toString(),
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance,
        savingsRate: Number(savingsRate),
        categoryBreakdown,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard",
      },
      { status: 500 },
    );
  }
}
