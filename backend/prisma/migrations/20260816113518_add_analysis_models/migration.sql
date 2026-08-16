-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "originalInput" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisResult" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "scamType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "redFlags" TEXT[],
    "attackPattern" TEXT[],
    "recommendedActions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Analysis_userId_idx" ON "Analysis"("userId");

-- CreateIndex
CREATE INDEX "Analysis_userId_createdAt_idx" ON "Analysis"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Analysis_inputType_idx" ON "Analysis"("inputType");

-- CreateIndex
CREATE INDEX "Analysis_status_idx" ON "Analysis"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisResult_analysisId_key" ON "AnalysisResult"("analysisId");

-- CreateIndex
CREATE INDEX "AnalysisResult_classification_idx" ON "AnalysisResult"("classification");

-- CreateIndex
CREATE INDEX "AnalysisResult_riskScore_idx" ON "AnalysisResult"("riskScore");

-- CreateIndex
CREATE INDEX "AnalysisResult_scamType_idx" ON "AnalysisResult"("scamType");

-- CreateIndex
CREATE INDEX "AnalysisResult_severity_idx" ON "AnalysisResult"("severity");

-- CreateIndex
CREATE INDEX "AnalysisResult_createdAt_idx" ON "AnalysisResult"("createdAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisResult" ADD CONSTRAINT "AnalysisResult_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
