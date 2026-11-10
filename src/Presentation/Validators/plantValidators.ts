import { z } from "zod";

export const createPlantSchema = z.object({
  plantName: z.string().trim().min(1).max(100),

  species: z.string().trim().min(1).max(150),

  plantType: z.enum(["VEGETABLE", "FRUIT", "FLOWER"]),

  plantationDate: z.coerce.date(),

  surfaceAreaRequired: z.number().positive(),

  idealHumidityLevel: z.number().int().min(0).max(100),
});
