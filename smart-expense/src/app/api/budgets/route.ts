import { NextResponse } from "next/server";

import { connectDB } from "@/src/lib/db";
import { getCurrentUser } from "@/src/lib/auth";
import Budget from "@/src/models/Budget";
import Transaction from "@/src/models/Transaction";

export async function GET() {
  try {
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

    const currentMonth = new Date().toISOString().slice(0, 7);

    const budgets = await Budget.find({
      userId: currentUser.userId,
      month: currentMonth,
    }).lean();

    const transactions = await Transaction.find({
      userId: currentUser.userId,
      type: "expense",
    }).lean();

    const data = budgets.map((budget) => {
      const spent = transactions
        .filter((transaction) => {
          const transactionMonth = new Date(transaction.date)
            .toISOString()
            .slice(0, 7);

          return (
            transaction.category === budget.category &&
            transactionMonth === budget.month
          );
        })
        .reduce((total, transaction) => {
          return total + transaction.amount;
        }, 0);

      return {
        _id: budget._id.toString(),
        category: budget.category,
        limit: budget.limit,
        month: budget.month,
        spent,
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Budgets GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load budgets",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

    // Get request data
    const body = await request.json();

    const { category, limit, month } = body;

    // Validate required fields
    if (!category || limit === undefined || !month) {
      return NextResponse.json(
        {
          success: false,
          message: "Category, limit and month are required",
        },
        { status: 400 },
      );
    }

    // Validate limit
    if (Number(limit) <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Budget limit must be greater than 0",
        },
        { status: 400 },
      );
    }

    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      userId: currentUser.userId,
      category,
      month,
    });

    if (existingBudget) {
      return NextResponse.json(
        {
          success: false,
          message: `Budget for ${category} already exists for this month`,
        },
        { status: 400 },
      );
    }

    // Create budget
    const budget = await Budget.create({
      userId: currentUser.userId,
      category,
      limit: Number(limit),
      month,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Budget created successfully",
        data: {
          _id: budget._id.toString(),
          category: budget.category,
          limit: budget.limit,
          month: budget.month,
          spent: 0,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Budgets POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create budget",
      },
      { status: 500 },
    );
  }
}
