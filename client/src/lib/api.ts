import axios, { AxiosError } from "axios";
import { z } from "zod";
import {
  metricsSchema,
  hourlyDataSchema,
  riskDistributionSchema,
  anomalyReasonSchema,
  transactionSchema,
  simulationSummarySchema,
  simulationSessionSchema,
} from "@shared/schema";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const uploadResponseSchema = z.object({
  message: z.string().optional(),
});

/**
 * Validates response data against a Zod schema
 * Throws if validation fails
 */
function validateResponse<T>(data: unknown, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join("; ");
    throw new Error(`Validation failed: ${errors}`);
  }

  return result.data;
}

function normalizeData(raw: unknown): unknown {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error(`Response JSON parse failed: ${(error as Error).message}`);
    }
  }
  return raw;
}

function handleError(context: string, error: unknown): never {
  if (error instanceof z.ZodError) {
    throw new Error(`${context} validation error: ${error.message}`);
  }
  if (error instanceof AxiosError) {
    throw new Error(`${context} request failed: ${error.message}`);
  }
  if (error instanceof SyntaxError) {
    throw new Error(`${context} response parse failed: ${error.message}`);
  }
  throw error;
}

/**
 * Fetches metrics data and validates against schema
 */
export async function getMetrics() {
  try {
    const response = await axiosInstance.get("/metrics");
    const payload = normalizeData(response.data);
    return validateResponse(payload, metricsSchema);
  } catch (error) {
    return handleError("Metrics", error);
  }
}

export async function uploadCSV(file: File, simulation: boolean = false) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("simulation", String(simulation));

  try {
    const response = await axiosInstance.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const payload = normalizeData(response.data);
    return validateResponse(payload, uploadResponseSchema);
  } catch (error) {
    return handleError("Upload", error);
  }
}

export async function getTransactionsByHour() {
  try {
    const response = await axiosInstance.get("/charts/transactions-by-hour");
    const payload = normalizeData(response.data);
    return validateResponse(payload, z.array(hourlyDataSchema));
  } catch (error) {
    return handleError("Transactions by hour", error);
  }
}

export async function getAnomaliesByHour() {
  try {
    const response = await axiosInstance.get("/charts/anomalies-by-hour");
    const payload = normalizeData(response.data);
    return validateResponse(payload, z.array(hourlyDataSchema));
  } catch (error) {
    return handleError("Anomalies by hour", error);
  }
}

export async function getRiskDistribution() {
  try {
    const response = await axiosInstance.get("/charts/risk-distribution");
    const payload = normalizeData(response.data);
    return validateResponse(payload, z.array(riskDistributionSchema));
  } catch (error) {
    return handleError("Risk distribution", error);
  }
}

export async function getAnomalyReasons() {
  try {
    const response = await axiosInstance.get("/charts/anomaly-reasons");
    const payload = normalizeData(response.data);
    return validateResponse(payload, z.array(anomalyReasonSchema));
  } catch (error) {
    return handleError("Anomaly reasons", error);
  }
}

export async function getFlaggedTransactions() {
  try {
    const response = await axiosInstance.get("/transactions/flagged");
    const payload = normalizeData(response.data);
    return validateResponse(payload, z.array(transactionSchema));
  } catch (error) {
    return handleError("Flagged transactions", error);
  }
}

export async function getSimulationSummary() {
  try {
    const response = await axiosInstance.get("/simulation/summary");
    const payload = normalizeData(response.data);
    return validateResponse(payload, simulationSummarySchema);
  } catch (error) {
    return handleError("Simulation summary", error);
  }
}

export async function getSimulationSessions() {
  try {
    const response = await axiosInstance.get("/simulation/sessions");
    const payload = normalizeData(response.data);
    return validateResponse(payload, z.array(simulationSessionSchema));
  } catch (error) {
    return handleError("Simulation sessions", error);
  }
}
