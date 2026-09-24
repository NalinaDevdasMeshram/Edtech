import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/src/lib/db";
import { getCurrentUser } from "@/src/lib/auth";
import Transaction from "@/src/models/Transaction";
import { transactionSchema } from "@/src/lib/validations";

// GET all transactions for logged-in user
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

    const transactions = await Transaction.find({
      userId: currentUser.userId,
    })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("GET transactions error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch transactions",
      },
      { status: 500 },
    );
  }
}

// CREATE transaction
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const validation = transactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const transaction = await Transaction.create({
      ...validation.data,

      userId: new mongoose.Types.ObjectId(currentUser.userId),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Transaction created successfully",
        data: transaction,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST transaction error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create transaction",
      },
      { status: 500 },
    );
  }
}
