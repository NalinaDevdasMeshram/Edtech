import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import { getCurrentUser } from "@/src/lib/auth";
import Budget from "@/src/models/Budget";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Connect database
    await connectDB();

    // Get budget ID
    const { id } = await params;

    // Find and delete only the current user's budget
    const deletedBudget = await Budget.findOneAndDelete({
      _id: id,
      userId: currentUser.userId,
    });

    // Budget not found
    if (!deletedBudget) {
      return NextResponse.json(
        {
          success: false,
          message: "Budget not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("DELETE budget error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete budget",
      },
      {
        status: 500,
      },
    );
  }
}
