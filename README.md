# Automated Garden Management System

A REST API for managing users, gardens, and plants. The system supports garden and plant management, validates available garden surface area, and maintains plant humidity metrics.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **API Documentation:** Swagger UI / OpenAPI 3.0
- **Testing:** Node.js test runner with `tsx`

## Features

### Implemented

- Create users.
- Create, retrieve, update, and delete gardens.
- Retrieve all gardens belonging to a user.
- Create, retrieve, update, and delete plants within a garden.
- Validate garden ownership when accessing or modifying resources.
- Prevent plants from exceeding the available garden surface area.
- Prevent garden capacity from being reduced below the area currently occupied by plants.
- Validate plant humidity targets between 0 and 100.
- Initialize each plant's current humidity level to 50%.
- Return consistent HTTP error responses.
- Unit tests for garden and plant application services.
- Interactive API documentation through Swagger UI.

### Theoretical Design

The assignment also asks for approaches to authentication, performance optimization, reporting, and irrigation control. These are described in the relevant sections below and are not implemented as part of the current API.

## Architecture

The application follows a layered architecture with separation of responsibilities and dependency inversion.

```text
src/
├── Application/
│   ├── DTOs/
│   ├── Errors/
│   ├── Interfaces/
│   └── Services/
│
├── Domain/
│   └── Entities/
│
├── Infrastructure/
│   ├── Database/
│   └── Repositories/
│
├── Presentation/
│   ├── Controllers/
│   ├── Documentation/
│   ├── Middleware/
│   ├── Routes/
│   └── Validators/
│
├── CompositionRoot/
├── app.ts
└── server.ts

tests/
```

### Layer Responsibilities

**Domain**

Contains the core domain entities and types, such as User, Garden, Plant, and PlantMetric. It does not depend on infrastructure or presentation frameworks.

**Application**

Contains application services and repository interfaces. Services implement business use cases, coordinate operations, and enforce application-level rules.

**Infrastructure**

Contains external concerns, including PostgreSQL access, Prisma configuration, and repository implementations. It implements the interfaces defined by the Application layer.

**Presentation**

Contains Express routes, controllers, request validation middleware, error handling, and API documentation. Controllers translate HTTP requests into application service calls and return HTTP responses.

**Composition Root**

Creates and wires dependencies, injecting repository implementations into application services.

### Design Decisions

- **Dependency Inversion:** Application services depend on repository interfaces rather than Prisma implementations.
- **Separation of Concerns:** Controllers handle HTTP concerns, services handle use cases, and repositories handle persistence.
- **Request Validation:** Zod validates incoming request data at the presentation boundary.
- **Consistent Error Handling:** Application errors are translated into appropriate HTTP status codes by centralized error-handling middleware.
- **Database Constraints:** PostgreSQL constraints provide an additional layer of data integrity.

## Data Model

The application uses the following main entities:

| Entity      | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| User        | Represents the owner of one or more gardens.                                          |
| Garden      | Belongs to a user and contains plants.                                                |
| Plant       | Belongs to a garden and defines its species, type, required area, and ideal humidity. |
| PlantMetric | Stores the current humidity and irrigation timestamps for a plant.                    |

### Relationships

- A User can own multiple Gardens.
- A Garden can contain multiple Plants.
- A Plant has one associated PlantMetric.
- Deleting a garden cascades to its plants and their metrics.
- Deleting a plant cascades to its associated metric.

Plant types are represented by an enum:

- `VEGETABLE`
- `FRUIT`
- `FLOWER`

## Business Rules

### Garden Capacity

The total surface area occupied by plants must never exceed the garden's total surface area.

When creating or updating a plant, the application checks the available area before persisting the change.

When reducing a garden's total surface area, the new capacity must still accommodate all existing plants.

Capacity checks are performed within database transactions. The garden row is locked during the operation to prevent concurrent plant modifications from exceeding the available capacity.

If the requested operation exceeds the available capacity, the API returns `409 Conflict`.

### Ownership

Garden operations verify that the requested garden belongs to the specified user.

Plant operations verify both garden ownership and that the plant belongs to the requested garden.

Resources that do not exist or do not belong to the requesting user are returned as `404 Not Found`.

### Humidity

- Every newly created plant starts with a current humidity level of 50%.
- The ideal humidity level must be an integer between 0 and 100.
- Current humidity is stored in the associated PlantMetric record.

## API Documentation

Once the application is running, interactive API documentation is available at:

`http://localhost:3000`

But it also depends on your .env variables the example above was used for development

The API uses nested resource routes

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Automated-Garden-Management-System
npm install
```

Create a `.env` file with the appropiate variables:

```bash
PORT=
DATABASE_URL=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
NODE_ENV=
API_BASE_URL=
API_ENVIRONMENT=
```

Configure the PostgreSQL connection string and application settings in `.env`.

Example:

```env
PORT=3000
NODE_ENV=development

API_BASE_URL=http://localhost:3000
API_ENVIRONMENT=Development

DATABASE_URL="postgresql://garden_user:YOUR_PASSWORD@localhost:5432/garden_db?schema=public"
```

### Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate dev
```

### Run the Application

Start the development server:

```bash
npm run dev
```

The API will be available at:

`http://localhost:3000`

Health check:

`GET /health`

Swagger documentation:

`http://localhost:3000`

### Production Build

Compile the TypeScript application:

```bash
npm run build
```

Start the compiled application:

```bash
npm start
```

## Testing

Run the unit tests:

```bash
npm test
```

The tests focus on application service behavior, including:

- Resource ownership.
- Missing resources.
- Successful garden and plant operations.
- Garden capacity restrictions.
- Capacity validation when updating existing resources.

Repository implementations and PostgreSQL behavior are not covered by the current unit test suite.

## Theoretical Design

### Authentication and Authorization

A production implementation could introduce registration and login endpoints using email and password credentials.

Passwords should never be stored in plain text. They should be hashed using a password-hashing algorithm such as Argon2id, with a unique salt handled by the algorithm.

After successful authentication, the server could issue a short-lived JWT containing the user's identifier and relevant claims.

Protected endpoints would use authentication middleware to validate the token and extract the authenticated user's identity. Authorization would then verify that the requested garden belongs to that user.

An OAuth2 or OpenID Connect provider could alternatively handle authentication through a third-party identity provider.

Additional capabilities could include email verification, password recovery, token refresh, and account deletion.

### Performance Considerations

For a production system with frequent API requests, several optimizations could be introduced:

- **Database indexing:** Index frequently queried foreign keys and fields used in filtering.
- **Pagination:** Paginate garden and plant collections to avoid returning unnecessarily large datasets.
- **Efficient queries:** Retrieve only the required fields and use Prisma relations to avoid unnecessary database round trips.
- **Caching:** Cache frequently requested, relatively stable data where appropriate, with clear invalidation rules.
- **Connection pooling:** Reuse database connections rather than creating new connections for individual requests.
- **Monitoring:** Track request latency, database query duration, and error rates to identify bottlenecks.

These optimizations should be guided by actual usage patterns and profiling rather than introduced prematurely.

### Irrigation Command and Reporting System

The irrigation system could be implemented as an independent service responsible for monitoring humidity and issuing commands to individual irrigation lines.

Each plant would have an independently addressable irrigation line.

The simulation rules defined in the assignment could be used by this service:

| Plant Type | Humidity decrease per minute | Humidity increase per 2-minute watering cycle |
| ---------- | ---------------------------: | --------------------------------------------: |
| Vegetable  |                           1% |                                           16% |
| Fruit      |                           3% |                                           18% |
| Flower     |                           4% |                                           20% |

Every plant starts at 50% humidity. When its current humidity drops below its ideal humidity level, the system should initiate watering.

A possible design:

1. A scheduled worker periodically evaluates the latest humidity readings.
2. It identifies plants that require watering.
3. It sends a command containing the plant identifier to an irrigation controller.
4. The controller activates only the irrigation line associated with that plant.
5. Once watering finishes, the system records the start and end timestamps and updates the humidity metric.

The irrigation controller could be represented by an interface, allowing a mocked implementation for development and a hardware-specific implementation in production.

For reliability, commands should be idempotent, failures should be retried with appropriate limits, and concurrent watering commands for the same plant should be prevented.

A reporting component could consume irrigation events and metrics to provide information such as watering history, current humidity, and plants requiring attention.

## Future Improvements

- Authentication and authorization middleware.
- Automated irrigation simulation and hardware integration.
- Reporting endpoints and historical metric tracking.
- Database integration tests.
- Pagination and caching for larger datasets.
- Production deployment configuration and monitoring.
