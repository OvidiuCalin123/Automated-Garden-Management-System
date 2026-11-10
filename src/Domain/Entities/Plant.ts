export type PlantType = "VEGETABLE" | "FRUIT" | "FLOWER";

export interface PlantMetric {
  plantId: string;
  lastIrrigationStartTime: Date | null;
  lastIrrigationEndTime: Date | null;
  currentHumidityLevel: number;
  updatedAt: Date;
}

export interface Plant {
  plantId: string;
  plantName: string;
  species: string;
  plantType: PlantType;
  plantationDate: Date;
  surfaceAreaRequired: number;
  idealHumidityLevel: number;
  gardenId: string;
  metric: PlantMetric | null;
}
