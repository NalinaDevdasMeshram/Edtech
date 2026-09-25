export const dynamic = "force-dynamic";
export const revalidate = 0;
import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/db";
import { getCurrentUser } from "@/src/lib/auth";
import Transaction from "@/src/models/Transaction";
import Budget from "@/src/models/Budget";

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
    console.log("DASHBOARD USER:", currentUser.userId);
    console.log("DASHBOARD TRANSACTIONS:", transactions);
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

    // Balance
    const balance = totalIncome - totalExpenses;

    // Savings rate
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

    // ==========================================
    // BUDGET OVERVIEW
    // ==========================================

    // Current month
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Get current user's budgets
    const budgets = await Budget.find({
      userId: currentUser.userId,
      month: currentMonth,
    }).lean();

    // Calculate spending for every budget
    const budgetOverview = budgets.map((budget) => {
      const spent = transactions
        .filter((transaction) => {
          const transactionMonth = new Date(transaction.date)
            .toISOString()
            .slice(0, 7);

          return (
            transaction.type === "expense" &&
            transaction.category === budget.category &&
            transactionMonth === budget.month
          );
        })
        .reduce((total, transaction) => {
          return total + transaction.amount;
        }, 0);

      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

      return {
        id: budget._id.toString(),
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining: Math.max(budget.limit - spent, 0),
        percentage: Math.round(percentage),
      };
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    console.log("DASHBOARD TOTALS:", {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
    });
    return NextResponse.json({
      success: true,

      data: {
        totalIncome,
        totalExpenses,
        balance,
        savingsRate: Number(savingsRate),

        categoryBreakdown,

        recentTransactions,

        budgetOverview,
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
