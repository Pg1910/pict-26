// Network calls now live in client/src/lib/api.ts
import {
  uploadCSV,
  getMetrics,
  getTransactionsByHour,
  getAnomaliesByHour,
  getRiskDistribution,
  getAnomalyReasons,
  getFlaggedTransactions,
  getSimulationSummary,
  getSimulationSessions,
} from "@/lib/api";

// Preserve existing api object shape for callers
export const api = {
  uploadCSV,
  getMetrics,
  getTransactionsByHour,
  getAnomaliesByHour,
  getRiskDistribution,
  getAnomalyReasons,
  getFlaggedTransactions,
  getSimulationSummary,
  getSimulationSessions,
};

// Also re-export individual functions if preferred
export {
  uploadCSV,
  getMetrics,
  getTransactionsByHour,
  getAnomaliesByHour,
  getRiskDistribution,
  getAnomalyReasons,
  getFlaggedTransactions,
  getSimulationSummary,
  getSimulationSessions,
};
