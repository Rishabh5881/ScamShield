-- CreateTable
CREATE TABLE "GuestUsage" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "analysisCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestUsage_guestId_key" ON "GuestUsage"("guestId");

-- CreateIndex
CREATE INDEX "GuestUsage_guestId_idx" ON "GuestUsage"("guestId");
