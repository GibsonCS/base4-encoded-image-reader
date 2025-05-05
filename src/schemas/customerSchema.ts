import { z } from 'zod';

export const customerSchema = z.object({
  customer_code: z.string(),
});

export type Customer = z.infer<typeof customerSchema>;
