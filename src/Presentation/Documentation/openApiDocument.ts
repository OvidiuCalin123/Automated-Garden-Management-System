export const openApiDocument = {
  openapi: "3.0.3",

  info: {
    title: "Automated Garden Management API",
    version: "1.0.0",
    description: "REST API for managing users, gardens and plants.",
  },

  servers: [
    {
      url: process.env.API_BASE_URL,
      description: process.env.API_ENVIRONMENT,
    },
  ],

  tags: [
    { name: "Users", description: "User management" },
    { name: "Gardens", description: "Garden management" },
    { name: "Plants", description: "Plant management" },
  ],

  paths: {
    "/api/users": {
      post: {
        tags: ["Users"],
        summary: "Create a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateUser",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "400": { description: "Invalid request data" },
          "409": { description: "Email already exists" },
        },
      },
    },

    "/api/users/{userId}/gardens": {
      parameters: [
        {
          $ref: "#/components/parameters/userId",
        },
      ],
      post: {
        tags: ["Gardens"],
        summary: "Create a garden",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateGarden",
              },
            },
          },
        },
        responses: {
          "201": { description: "Garden created successfully" },
          "400": { description: "Invalid request data" },
          "404": { description: "User not found" },
        },
      },
      get: {
        tags: ["Gardens"],
        summary: "Get all gardens belonging to a user",
        responses: {
          "200": {
            description: "Gardens retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Garden",
                  },
                },
              },
            },
          },
          "404": { description: "User not found" },
        },
      },
    },

    "/api/users/{userId}/gardens/{gardenId}": {
      parameters: [
        { $ref: "#/components/parameters/userId" },
        { $ref: "#/components/parameters/gardenId" },
      ],
      get: {
        tags: ["Gardens"],
        summary: "Get a garden by ID",
        responses: {
          "200": {
            description: "Garden retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Garden",
                },
              },
            },
          },
          "404": { description: "Garden not found" },
        },
      },
      put: {
        tags: ["Gardens"],
        summary: "Update a garden",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateGarden",
              },
            },
          },
        },
        responses: {
          "200": { description: "Garden updated successfully" },
          "400": { description: "Invalid request data" },
          "404": { description: "Garden not found" },
          "409": {
            description:
              "Garden area cannot be smaller than occupied plant area",
          },
        },
      },
      delete: {
        tags: ["Gardens"],
        summary: "Delete a garden",
        responses: {
          "204": { description: "Garden deleted successfully" },
          "404": { description: "Garden not found" },
        },
      },
    },

    "/api/users/{userId}/gardens/{gardenId}/plants": {
      parameters: [
        { $ref: "#/components/parameters/userId" },
        { $ref: "#/components/parameters/gardenId" },
      ],
      post: {
        tags: ["Plants"],
        summary: "Create a plant in a garden",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreatePlant",
              },
            },
          },
        },
        responses: {
          "201": { description: "Plant created successfully" },
          "400": { description: "Invalid request data" },
          "404": { description: "Garden not found" },
          "409": { description: "Garden capacity exceeded" },
        },
      },
      get: {
        tags: ["Plants"],
        summary: "Get all plants in a garden",
        responses: {
          "200": {
            description: "Plants retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Plant",
                  },
                },
              },
            },
          },
          "404": { description: "Garden not found" },
        },
      },
    },

    "/api/users/{userId}/gardens/{gardenId}/plants/{plantId}": {
      parameters: [
        { $ref: "#/components/parameters/userId" },
        { $ref: "#/components/parameters/gardenId" },
        { $ref: "#/components/parameters/plantId" },
      ],
      get: {
        tags: ["Plants"],
        summary: "Get a plant by ID",
        responses: {
          "200": {
            description: "Plant retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Plant",
                },
              },
            },
          },
          "404": { description: "Plant not found" },
        },
      },
      put: {
        tags: ["Plants"],
        summary: "Update a plant",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdatePlant",
              },
            },
          },
        },
        responses: {
          "200": { description: "Plant updated successfully" },
          "400": { description: "Invalid request data" },
          "404": { description: "Plant or garden not found" },
          "409": { description: "Garden capacity exceeded" },
        },
      },
      delete: {
        tags: ["Plants"],
        summary: "Delete a plant",
        responses: {
          "204": { description: "Plant deleted successfully" },
          "404": { description: "Plant or garden not found" },
        },
      },
    },
  },

  components: {
    parameters: {
      userId: {
        name: "userId",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
      gardenId: {
        name: "gardenId",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
      plantId: {
        name: "plantId",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
    },

    schemas: {
      CreateUser: {
        type: "object",
        required: ["firstName", "lastName", "age", "emailAddress"],
        properties: {
          firstName: { type: "string", example: "John" },
          lastName: { type: "string", example: "Doe" },
          age: { type: "integer", example: 30 },
          emailAddress: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
        },
      },

      User: {
        type: "object",
        properties: {
          userId: { type: "string", format: "uuid" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          age: { type: "integer" },
          emailAddress: { type: "string", format: "email" },
        },
      },

      CreateGarden: {
        type: "object",
        required: ["gardenName", "totalSurfaceArea", "locationDescription"],
        properties: {
          gardenName: { type: "string", example: "Backyard" },
          totalSurfaceArea: {
            type: "number",
            exclusiveMinimum: 0,
            example: 100,
          },
          locationDescription: {
            type: "string",
            example: "Timisoara",
          },
          latitude: {
            type: "number",
            minimum: -90,
            maximum: 90,
            nullable: true,
          },
          longitude: {
            type: "number",
            minimum: -180,
            maximum: 180,
            nullable: true,
          },
        },
      },

      UpdateGarden: {
        type: "object",
        minProperties: 1,
        properties: {
          gardenName: { type: "string" },
          totalSurfaceArea: {
            type: "number",
            exclusiveMinimum: 0,
          },
          locationDescription: { type: "string" },
          latitude: { type: "number", nullable: true },
          longitude: { type: "number", nullable: true },
        },
      },

      Garden: {
        type: "object",
        properties: {
          gardenId: { type: "string", format: "uuid" },
          gardenName: { type: "string" },
          totalSurfaceArea: { type: "number" },
          locationDescription: { type: "string" },
          latitude: { type: "number", nullable: true },
          longitude: { type: "number", nullable: true },
          userId: { type: "string", format: "uuid" },
        },
      },

      CreatePlant: {
        type: "object",
        required: [
          "plantName",
          "species",
          "plantType",
          "plantationDate",
          "surfaceAreaRequired",
          "idealHumidityLevel",
        ],
        properties: {
          plantName: { type: "string", example: "Tomato" },
          species: {
            type: "string",
            example: "Solanum lycopersicum",
          },
          plantType: {
            type: "string",
            enum: ["VEGETABLE", "FRUIT", "FLOWER"],
          },
          plantationDate: {
            type: "string",
            format: "date",
            example: "2026-04-01",
          },
          surfaceAreaRequired: {
            type: "number",
            exclusiveMinimum: 0,
            example: 10,
          },
          idealHumidityLevel: {
            type: "integer",
            minimum: 0,
            maximum: 100,
            example: 60,
          },
        },
      },

      UpdatePlant: {
        type: "object",
        minProperties: 1,
        properties: {
          plantName: { type: "string" },
          species: { type: "string" },
          plantType: {
            type: "string",
            enum: ["VEGETABLE", "FRUIT", "FLOWER"],
          },
          plantationDate: {
            type: "string",
            format: "date",
          },
          surfaceAreaRequired: {
            type: "number",
            exclusiveMinimum: 0,
          },
          idealHumidityLevel: {
            type: "integer",
            minimum: 0,
            maximum: 100,
          },
        },
      },

      PlantMetric: {
        type: "object",
        nullable: true,
        properties: {
          plantId: { type: "string", format: "uuid" },
          lastIrrigationStartTime: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          lastIrrigationEndTime: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          currentHumidityLevel: {
            type: "integer",
            minimum: 0,
            maximum: 100,
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },

      Plant: {
        type: "object",
        properties: {
          plantId: { type: "string", format: "uuid" },
          plantName: { type: "string" },
          species: { type: "string" },
          plantType: {
            type: "string",
            enum: ["VEGETABLE", "FRUIT", "FLOWER"],
          },
          plantationDate: {
            type: "string",
            format: "date",
          },
          surfaceAreaRequired: { type: "number" },
          idealHumidityLevel: {
            type: "integer",
            minimum: 0,
            maximum: 100,
          },
          gardenId: { type: "string", format: "uuid" },
          metric: {
            $ref: "#/components/schemas/PlantMetric",
          },
        },
      },
    },
  },
};
