-- CreateEnum
CREATE TYPE "Bias" AS ENUM ('BULLISH', 'BEARISH', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "DayType" AS ENUM ('TREND_UP', 'TREND_DOWN', 'RANGE', 'GRIND');

-- CreateEnum
CREATE TYPE "MacroIndicatorType" AS ENUM ('TREASURY_10Y', 'VIX', 'DXY', 'OIL', 'CREDIT_SPREADS');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('VWAP_INTERACTION', 'LIQUIDITY_SWEEP', 'VOLUME_EXPANSION', 'BREAK_OF_STRUCTURE', 'ORB');

-- CreateEnum
CREATE TYPE "TradeDirection" AS ENUM ('LONG', 'SHORT');

-- CreateTable
CREATE TABLE "DailySession" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "riskScore" INTEGER,
    "dailyBias" "Bias",
    "confidenceLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MacroIndicator" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "indicator" "MacroIndicatorType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "previousValue" DOUBLE PRECISION NOT NULL,
    "isRiskOff" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MacroIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OvernightStructure" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "esTrend" TEXT NOT NULL,
    "nqTrend" TEXT NOT NULL,
    "preMarketVwap" DOUBLE PRECISION,
    "overnightHigh" DOUBLE PRECISION,
    "overnightLow" DOUBLE PRECISION,
    "keyLevels" JSONB,
    "majorNews" TEXT,
    "scheduledReports" TEXT,

    CONSTRAINT "OvernightStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntradaySignal" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "signalType" "SignalType" NOT NULL,
    "description" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntradaySignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "direction" "TradeDirection" NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "exitPrice" DOUBLE PRECISION,
    "stopPrice" DOUBLE PRECISION NOT NULL,
    "isAlignedWithBias" BOOLEAN NOT NULL,
    "qualificationScore" INTEGER NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostTradeReview" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "dayType" "DayType" NOT NULL,
    "macroAligned" BOOLEAN NOT NULL,
    "tradesFollowedBias" BOOLEAN NOT NULL,
    "effectiveSignals" TEXT,
    "mistakes" TEXT,

    CONSTRAINT "PostTradeReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailySession_date_key" ON "DailySession"("date");

-- CreateIndex
CREATE UNIQUE INDEX "MacroIndicator_sessionId_indicator_key" ON "MacroIndicator"("sessionId", "indicator");

-- CreateIndex
CREATE UNIQUE INDEX "OvernightStructure_sessionId_key" ON "OvernightStructure"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "PostTradeReview_sessionId_key" ON "PostTradeReview"("sessionId");

-- AddForeignKey
ALTER TABLE "MacroIndicator" ADD CONSTRAINT "MacroIndicator_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DailySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OvernightStructure" ADD CONSTRAINT "OvernightStructure_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DailySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntradaySignal" ADD CONSTRAINT "IntradaySignal_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DailySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DailySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTradeReview" ADD CONSTRAINT "PostTradeReview_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DailySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
