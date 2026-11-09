-- CreateEnum
CREATE TYPE "PlantType" AS ENUM ('VEGETABLE', 'FRUIT', 'FLOWER');

-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Garden" (
    "gardenId" UUID NOT NULL,
    "gardenName" TEXT NOT NULL,
    "totalSurfaceArea" DECIMAL(10,2) NOT NULL,
    "locationDescription" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Garden_pkey" PRIMARY KEY ("gardenId")
);

-- CreateTable
CREATE TABLE "Plant" (
    "plantId" UUID NOT NULL,
    "plantName" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "plantType" "PlantType" NOT NULL,
    "plantationDate" DATE NOT NULL,
    "surfaceAreaRequired" DECIMAL(10,2) NOT NULL,
    "idealHumidityLevel" INTEGER NOT NULL,
    "gardenId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("plantId")
);

-- CreateTable
CREATE TABLE "PlantMetric" (
    "plantId" UUID NOT NULL,
    "lastIrrigationStartTime" TIMESTAMP(3),
    "lastIrrigationEndTime" TIMESTAMP(3),
    "currentHumidityLevel" INTEGER NOT NULL DEFAULT 50,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantMetric_pkey" PRIMARY KEY ("plantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");

-- CreateIndex
CREATE INDEX "Garden_userId_idx" ON "Garden"("userId");

-- CreateIndex
CREATE INDEX "Plant_gardenId_idx" ON "Plant"("gardenId");

-- AddForeignKey
ALTER TABLE "Garden" ADD CONSTRAINT "Garden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden"("gardenId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantMetric" ADD CONSTRAINT "PlantMetric_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("plantId") ON DELETE CASCADE ON UPDATE CASCADE;
