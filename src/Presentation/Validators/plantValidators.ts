import { z } from "zod";

export const createPlantSchema = z.object({
  plantName: z.string().trim().min(1).max(100),

  species: z.string().trim().min(1).max(150),

  plantType: z.enum(["VEGETABLE", "FRUIT", "FLOWER"]),

  plantationDate: z.coerce.date(),

  surfaceAreaRequired: z.number().positive(),

  idealHumidityLevel: z.number().int().min(0).max(100),
});

export const updatePlantSchema = z
  .object({
    plantName: z.string().trim().min(1).max(100).optional(),

    species: z.string().trim().min(1).max(150).optional(),

    plantType: z.enum(["VEGETABLE", "FRUIT", "FLOWER"]).optional(),

    plantationDate: z.coerce.date().optional(),

    surfaceAreaRequired: z.number().positive().optional(),

    idealHumidityLevel: z.number().int().min(0).max(100).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });
