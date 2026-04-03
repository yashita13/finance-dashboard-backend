import { z } from "zod";

const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
});

export const createRecordSchema = z.object({
    amount: z.number().positive("Amount must be positive"),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(1, "Category is required"),
    date: dateSchema,
    notes: z.string().optional(),
});

export const updateRecordSchema = z.object({
    amount: z.number().positive().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1).optional(),
    date: dateSchema.optional(),
    notes: z.string().optional(),
});