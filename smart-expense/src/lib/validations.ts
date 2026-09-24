import { z } from "zod";

export const transactionSchema = z.object({
  title: z
    .string()
    .min(2, "Title must contain at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),

  amount: z.number().positive("Amount must be greater than 0"),

  type: z.enum(["income", "expense"]),

  category: z.string().min(2, "Category is required").max(50),

  date: z.string(),

  paymentMethod: z.string().min(2, "Payment method is required"),

  notes: z.string().max(500).optional(),
});
