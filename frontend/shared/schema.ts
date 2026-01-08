import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We define the shape of the data we expect from the external API here.
// Even though we aren't using a local database for these, defining them here ensures type safety.

// Dummy table to satisfy Drizzle if needed
export const _dummy = pgTable("_dummy", {
  id: serial("id").primaryKey(),
});

export const metricsSchema = z.object({
  total_transactions: z.number(),
  anomalies_detected: z.number(),
  anomaly_rate: z.number(),
  unique_accounts: z.number(),
});

export const hourlyDataSchema = z.object({
  hour: z.string(),
  count: z.number(),
});

export const riskDistributionSchema = z.object({
  range: z.string(),
  count: z.number(),
});

export const anomalyReasonSchema = z.object({
  reason: z.string(),
  count: z.number(),
});

export const transactionSchema = z.object({
  transaction_id: z.string(),
  account: z.string(),
  timestamp: z.string(),
  amount: z.number(),
  location: z.string(),
  risk_score: z.number(),
  reasons: z.array(z.string()),
});

export const simulationSummarySchema = z.object({
  total_simulations: z.number(),
  success_rate: z.number(),
  avg_processing_time: z.number(),
});

export const simulationSessionSchema = z.object({
  session_id: z.string(),
  timestamp: z.string(),
  status: z.string(),
  anomalies_found: z.number(),
});

// Export types
export type Metrics = z.infer<typeof metricsSchema>;
export type HourlyData = z.infer<typeof hourlyDataSchema>;
export type RiskDistribution = z.infer<typeof riskDistributionSchema>;
export type AnomalyReason = z.infer<typeof anomalyReasonSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type SimulationSummary = z.infer<typeof simulationSummarySchema>;
export type SimulationSession = z.infer<typeof simulationSessionSchema>;
