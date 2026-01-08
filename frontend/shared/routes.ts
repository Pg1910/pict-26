import { z } from 'zod';
import { 
  metricsSchema, 
  hourlyDataSchema, 
  riskDistributionSchema, 
  anomalyReasonSchema, 
  transactionSchema,
  simulationSummarySchema,
  simulationSessionSchema
} from './schema';

// This file defines the API contract for the frontend to use.
// These match the external API endpoints expected.

export const api = {
  upload: {
    csv: {
      method: 'POST' as const,
      path: '/upload', // Relative to VITE_API_BASE_URL
      responses: {
        200: z.object({ message: z.string(), session_id: z.string().optional() }),
      },
    },
  },
  metrics: {
    get: {
      method: 'GET' as const,
      path: '/metrics',
      responses: {
        200: metricsSchema,
      },
    },
  },
  charts: {
    transactionsByHour: {
      method: 'GET' as const,
      path: '/charts/transactions-by-hour',
      responses: {
        200: z.array(hourlyDataSchema),
      },
    },
    anomaliesByHour: {
      method: 'GET' as const,
      path: '/charts/anomalies-by-hour',
      responses: {
        200: z.array(hourlyDataSchema),
      },
    },
    riskDistribution: {
      method: 'GET' as const,
      path: '/charts/risk-distribution',
      responses: {
        200: z.array(riskDistributionSchema),
      },
    },
    anomalyReasons: {
      method: 'GET' as const,
      path: '/charts/anomaly-reasons',
      responses: {
        200: z.array(anomalyReasonSchema),
      },
    },
  },
  transactions: {
    flagged: {
      method: 'GET' as const,
      path: '/transactions/flagged',
      responses: {
        200: z.array(transactionSchema),
      },
    },
  },
  simulation: {
    summary: {
      method: 'GET' as const,
      path: '/simulation/summary',
      responses: {
        200: simulationSummarySchema,
      },
    },
    sessions: {
      method: 'GET' as const,
      path: '/simulation/sessions',
      responses: {
        200: z.array(simulationSessionSchema),
      },
    },
  },
};
