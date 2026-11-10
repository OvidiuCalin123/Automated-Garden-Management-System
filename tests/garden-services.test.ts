import test from "node:test";
import assert from "node:assert/strict";

import type { Garden } from "../src/Domain/Entities/Garden.js";
import type { IGardenRepository } from "../src/Application/Interfaces/IGardenRepository.js";

import { AppError } from "../src/Application/Errors/AppError.js";
import { GetGardenService } from "../src/Application/Services/GetGardenService.js";
import { UpdateGardenService } from "../src/Application/Services/UpdateGardenService.js";
import { DeleteGardenService } from "../src/Application/Services/DeleteGardenService.js";

const garden: Garden = {
  gardenId: "garden-1",
  gardenName: "Backyard",
  totalSurfaceArea: 100,
  locationDescription: "Timisoara",
  latitude: null,
  longitude: null,
  userId: "user-1",
};

function createRepository(
  overrides: Partial<IGardenRepository> = {},
): IGardenRepository {
  const repository: IGardenRepository = {
    create: async () => garden,
    findById: async () => garden,
    findByUserId: async () => [garden],
    delete: async () => {},
    updateWithinCapacity: async () => ({
      status: "updated",
      garden,
    }),
    ...overrides,
  };

  return repository;
}

test("owner can retrieve their garden", async () => {
  const service = new GetGardenService(createRepository());

  const result = await service.execute("user-1", "garden-1");

  assert.equal(result.gardenId, "garden-1");
});

test("another user cannot retrieve the garden", async () => {
  const service = new GetGardenService(createRepository());

  await assert.rejects(
    () => service.execute("user-2", "garden-1"),
    (error: unknown) => error instanceof AppError && error.statusCode === 404,
  );
});

test("retrieving a non-existing garden returns 404", async () => {
  const repository = createRepository({
    findById: async () => null,
  });

  const service = new GetGardenService(repository);

  await assert.rejects(
    () => service.execute("user-1", "missing-garden"),
    (error: unknown) => error instanceof AppError && error.statusCode === 404,
  );
});

test("owner can update their garden within capacity", async () => {
  const updatedGarden = {
    ...garden,
    totalSurfaceArea: 80,
  };

  const repository = createRepository({
    updateWithinCapacity: async () => ({
      status: "updated",
      garden: updatedGarden,
    }),
  });

  const service = new UpdateGardenService(repository);

  const result = await service.execute("user-1", "garden-1", {
    totalSurfaceArea: 80,
  });

  assert.equal(result.totalSurfaceArea, 80);
});

test("updating below occupied area returns 409", async () => {
  const repository = createRepository({
    updateWithinCapacity: async () => ({
      status: "capacity_exceeded",
      usedArea: 70,
    }),
  });

  const service = new UpdateGardenService(repository);

  await assert.rejects(
    () => service.execute("user-1", "garden-1", { totalSurfaceArea: 60 }),
    (error: unknown) => error instanceof AppError && error.statusCode === 409,
  );
});

test("another user cannot update the garden", async () => {
  let updateCalled = false;

  const repository = createRepository({
    updateWithinCapacity: async () => {
      updateCalled = true;
      return {
        status: "updated",
        garden,
      };
    },
  });

  const service = new UpdateGardenService(repository);

  await assert.rejects(
    () => service.execute("user-2", "garden-1", { gardenName: "Changed" }),
    (error: unknown) => error instanceof AppError && error.statusCode === 404,
  );

  assert.equal(updateCalled, false);
});

test("owner can delete their garden", async () => {
  let deleteCalled = false;

  const repository = createRepository({
    delete: async () => {
      deleteCalled = true;
    },
  });

  const service = new DeleteGardenService(repository);

  await service.execute("user-1", "garden-1");

  assert.equal(deleteCalled, true);
});

test("another user cannot delete the garden", async () => {
  let deleteCalled = false;

  const repository = createRepository({
    delete: async () => {
      deleteCalled = true;
    },
  });

  const service = new DeleteGardenService(repository);

  await assert.rejects(
    () => service.execute("user-2", "garden-1"),
    (error: unknown) => error instanceof AppError && error.statusCode === 404,
  );

  assert.equal(deleteCalled, false);
});
