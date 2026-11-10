import test from "node:test";
import assert from "node:assert/strict";

import type { Garden } from "../src/Domain/Entities/Garden.js";
import type { Plant } from "../src/Domain/Entities/Plant.js";
import type { IGardenRepository } from "../src/Application/Interfaces/IGardenRepository.js";
import type { IPlantRepository } from "../src/Application/Interfaces/IPlantRepository.js";

import { AppError } from "../src/Application/Errors/AppError.js";

import { CreatePlantService } from "../src/Application/Services/CreatePlantService.js";
import { GetGardenPlantsService } from "../src/Application/Services/GetGardenPlantsService.js";
import { GetPlantService } from "../src/Application/Services/GetPlantService.js";
import { UpdatePlantService } from "../src/Application/Services/UpdatePlantService.js";
import { DeletePlantService } from "../src/Application/Services/DeletePlantService.js";

const garden: Garden = {
  gardenId: "garden-1",
  gardenName: "Backyard",
  totalSurfaceArea: 100,
  locationDescription: "Timisoara",
  latitude: null,
  longitude: null,
  userId: "user-1",
};

const plant: Plant = {
  plantId: "plant-1",
  plantName: "Tomato",
  species: "Solanum lycopersicum",
  plantType: "VEGETABLE",
  plantationDate: new Date("2026-04-01"),
  surfaceAreaRequired: 10,
  idealHumidityLevel: 60,
  gardenId: "garden-1",
  metric: {
    plantId: "plant-1",
    lastIrrigationStartTime: null,
    lastIrrigationEndTime: null,
    currentHumidityLevel: 50,
    updatedAt: new Date(),
  },
};

const plantData = {
  plantName: "Tomato",
  species: "Solanum lycopersicum",
  plantType: "VEGETABLE" as const,
  plantationDate: new Date("2026-04-01"),
  surfaceAreaRequired: 10,
  idealHumidityLevel: 60,
};

function createGardenRepository(
  overrides: Partial<IGardenRepository> = {},
): IGardenRepository {
  return {
    create: async () => garden,
    findById: async () => garden,
    findByUserId: async () => [garden],
    delete: async () => {},
    updateWithinCapacity: async () => ({
      status: "updated",
      garden,
    }),
    ...overrides,
  } as IGardenRepository;
}

function createPlantRepository(
  overrides: Partial<IPlantRepository> = {},
): IPlantRepository {
  return {
    createWithinCapacity: async () => ({
      status: "created",
      plant,
    }),
    findByGardenId: async () => [plant],
    findById: async () => plant,
    updateWithinCapacity: async () => ({
      status: "updated",
      plant,
    }),
    delete: async () => true,
    ...overrides,
  } as IPlantRepository;
}

// CREATE

test("owner can create a plant in their garden", async () => {
  const service = new CreatePlantService(
    createPlantRepository(),
    createGardenRepository(),
  );

  const result = await service.execute("user-1", "garden-1", plantData);

  assert.equal(result.plantId, "plant-1");
});

test("creating a plant in another user's garden returns 404", async () => {
  const service = new CreatePlantService(
    createPlantRepository(),
    createGardenRepository({
      findById: async () => ({
        ...garden,
        userId: "user-2",
      }),
    }),
  );

  await assert.rejects(
    () => service.execute("user-1", "garden-1", plantData),
    (error: unknown) => error instanceof AppError && error.statusCode === 404,
  );
});

// GET ALL

test("owner can retrieve all plants in their garden", async () => {
  const service = new GetGardenPlantsService(
    createPlantRepository(),
    createGardenRepository(),
  );

  const result = await service.execute("user-1", "garden-1");

  assert.equal(result.length, 1);
  assert.equal(result[0].plantId, "plant-1");
});

test("another user cannot retrieve plants from the garden", async () => {
  const service = new GetGardenPlantsService(
    createPlantRepository(),
    createGardenRepository({
      findById: async () => ({
        ...garden,
        userId: "user-2",
      }),
    }),
  );

  await assert.rejects(
    () => service.execute("user-1", "garden-1"),
    (error: unknown) => error instanceof AppError && error.statusCode === 404,
  );
});

// GET BY ID

test("owner can retrieve a plant by ID", async () => {
  const service = new GetPlantService(
    createPlantRepository(),
    createGardenRepository(),
  );

  const result = await service.execute("user-1", "garden-1", "plant-1");

  assert.equal(result.plantId, "plant-1");
});

test("retrieving a non-existing plant returns 404", async () => {
  const service = new GetPlantService(
    createPlantRepository({
      findById: async () => null,
    }),
    createGardenRepository(),
  );

  await assert.rejects(
    () => service.execute("user-1", "garden-1", "missing-plant"),
    (error: unknown) => error instanceof AppError && error.statusCode === 404,
  );
});

// UPDATE

test("owner can update a plant", async () => {
  const updatedPlant = {
    ...plant,
    plantName: "Updated Tomato",
  };

  const service = new UpdatePlantService(
    createPlantRepository({
      updateWithinCapacity: async () => ({
        status: "updated",
        plant: updatedPlant,
      }),
    }),
    createGardenRepository(),
  );

  const result = await service.execute("user-1", "garden-1", "plant-1", {
    plantName: "Updated Tomato",
  });

  assert.equal(result.plantName, "Updated Tomato");
});

test("updating a plant beyond garden capacity returns 409", async () => {
  const service = new UpdatePlantService(
    createPlantRepository({
      updateWithinCapacity: async () => ({
        status: "capacity_exceeded",
        availableArea: 5,
      }),
    }),
    createGardenRepository(),
  );

  await assert.rejects(
    () =>
      service.execute("user-1", "garden-1", "plant-1", {
        surfaceAreaRequired: 20,
      }),
    (error: unknown) => error instanceof AppError && error.statusCode === 409,
  );
});

// DELETE

test("owner can delete a plant", async () => {
  let deleteCalled = false;

  const service = new DeletePlantService(
    createPlantRepository({
      delete: async () => {
        deleteCalled = true;
        return true;
      },
    }),
    createGardenRepository(),
  );

  await service.execute("user-1", "garden-1", "plant-1");

  assert.equal(deleteCalled, true);
});

test("another user cannot delete a plant", async () => {
  let deleteCalled = false;

  const service = new DeletePlantService(
    createPlantRepository({
      delete: async () => {
        deleteCalled = true;
        return true;
      },
    }),
    createGardenRepository({
      findById: async () => ({
        ...garden,
        userId: "user-2",
      }),
    }),
  );

  await assert.rejects(
    () => service.execute("user-1", "garden-1", "plant-1"),
    (error: unknown) => error instanceof AppError && error.statusCode === 404,
  );

  assert.equal(deleteCalled, false);
});
