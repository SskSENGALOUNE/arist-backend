/*
  Warnings:

  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('DOMESTIC', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "LaoProvince" AS ENUM ('VIENTIANE_CAPITAL', 'PHONGSALI', 'LUANG_NAMTHA', 'OUDOMXAI', 'BOKEO', 'LUANG_PRABANG', 'HUAPHANH', 'XAYABOULI', 'XIANGKHOUANG', 'VIENTIANE', 'BORIKHAMXAI', 'KHAMMOUANE', 'SAVANNAKHET', 'SALAVAN', 'SEKONG', 'CHAMPASAK', 'ATTAPEU', 'XAISOMBOUN');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('DRAFT', 'PENDING', 'VERIFIED', 'REJECTED');

-- DropTable
DROP TABLE "transactions";

-- DropEnum
DROP TYPE "BankType";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "business_trips" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "trip_type" "TripType" NOT NULL,
    "destination_province" "LaoProvince",
    "destination_country" "Country",
    "departure_date" DATE NOT NULL,
    "return_date" DATE NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_at" TIMESTAMP(3),
    "verified_at" TIMESTAMP(3),
    "verified_by_id" UUID,
    "rejection_reason" TEXT,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_trips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_trips_user_id_idx" ON "business_trips"("user_id");

-- CreateIndex
CREATE INDEX "business_trips_status_idx" ON "business_trips"("status");

-- CreateIndex
CREATE INDEX "business_trips_departure_date_idx" ON "business_trips"("departure_date");

-- AddForeignKey
ALTER TABLE "business_trips" ADD CONSTRAINT "business_trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_trips" ADD CONSTRAINT "business_trips_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
