import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { getCurrentUser } from "@/src/lib/auth";
import Transaction from "@/src/models/Transaction";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const { id } = await params;

    const transaction = await Transaction.findOne({
      _id: id,
      userId: currentUser.userId,
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("GET transaction error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch transaction" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const updatedTransaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
        userId: currentUser.userId,
      },
      body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("PUT transaction error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update transaction" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const { id } = await params;

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: currentUser.userId,
    });

    if (!deletedTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("DELETE transaction error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete transaction" },
      { status: 500 },
    );
  }
}
