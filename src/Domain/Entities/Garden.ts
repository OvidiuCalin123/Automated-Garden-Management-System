export interface Garden {
  gardenId: string;
  gardenName: string;
  totalSurfaceArea: number;
  locationDescription: string;
  latitude: number | null;
  longitude: number | null;
  userId: string;
}
