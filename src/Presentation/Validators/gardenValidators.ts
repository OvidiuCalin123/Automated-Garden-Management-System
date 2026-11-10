import { z } from "zod";

export const createGardenSchema = z
  .object({
    gardenName: z.string().trim().min(1).max(100),
    totalSurfaceArea: z.number().positive(),
    locationDescription: z.string().trim().min(1).max(255),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
  })
  .refine((data) => (data.latitude == null) === (data.longitude == null), {
    message:
      "Latitude and longitude must either both be provided or both be omitted.",
    path: ["latitude"],
  });
