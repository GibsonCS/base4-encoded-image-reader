import { z } from "zod";

export const measurementSchema = z.object({
  image: z.string().base64(),
  customer_code: z.string(),
  measure_datetime: z.string().datetime({
    message: "Data precisa ser do formato datetime (YYYY-MM-DDTHH:mm:ssZ)",
  }),
  measure_type: z
    .string()
    .refine((t) => t.toLowerCase() === "water" || t.toLowerCase() === "gas", {
      message: "Você precisa escolher somente entre WATER ou GAS",
    }),
});

export const confirMeasurementSchema = z.object({
  measure_uuid: z.string().uuid(),
  confirmed_value: z.number().int(),
});

export type Measurement = z.infer<typeof measurementSchema>;
export type ConfirmMeasurement = z.infer<typeof confirMeasurementSchema>;
