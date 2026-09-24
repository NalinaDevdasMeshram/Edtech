import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Transaction from "@/src/models/Transaction";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: transaction,
    });
  } catch (error) {
    console.error("GET transaction error:", error);

    return NextResponse.json(
      { message: "Failed to fetch transaction" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const updatedTransaction = await Transaction.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTransaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("PUT transaction error:", error);

    return NextResponse.json(
      { message: "Failed to update transaction" },
      { status: 500 },
    );
  }
}
