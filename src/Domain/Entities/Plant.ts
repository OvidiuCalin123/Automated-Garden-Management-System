export type PlantType = "VEGETABLE" | "FRUIT" | "FLOWER";

export interface Plant {
  plantId: string;
  plantName: string;
  species: string;
  plantType: PlantType;
  plantationDate: Date;
  surfaceAreaRequired: number;
  idealHumidityLevel: number;
  gardenId: string;
}
