import { z } from "zod";

export const updateGardenSchema = z
  .object({
    gardenName: z.string().trim().min(1).max(100).optional(),
    totalSurfaceArea: z.number().positive().optional(),
    locationDescription: z.string().trim().min(1).max(255).optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  })
  .refine(
    (data) => {
      if (data.latitude === undefined && data.longitude === undefined) {
        return true;
      }

      return data.latitude != null && data.longitude != null;
    },
    {
      message: "Latitude and longitude must be provided together.",
      path: ["latitude"],
    },
  );
