import { z } from "zod";

export const summaryQuerySchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});