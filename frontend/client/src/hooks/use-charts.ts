import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { 
  hourlyDataSchema, 
  riskDistributionSchema, 
  anomalyReasonSchema 
} from "@shared/schema";
import { z } from "zod";

export function useTransactionsByHour() {
  return useQuery({
    queryKey: ["charts", "transactions-by-hour"],
    queryFn: async () => {
      const data = await api.getTransactionsByHour();
      return z.array(hourlyDataSchema).parse(data);
    },
  });
}

export function useAnomaliesByHour() {
  return useQuery({
    queryKey: ["charts", "anomalies-by-hour"],
    queryFn: async () => {
      const data = await api.getAnomaliesByHour();
      return z.array(hourlyDataSchema).parse(data);
    },
  });
}

export function useRiskDistribution() {
  return useQuery({
    queryKey: ["charts", "risk-distribution"],
    queryFn: async () => {
      const data = await api.getRiskDistribution();
      return z.array(riskDistributionSchema).parse(data);
    },
  });
}

export function useAnomalyReasons() {
  return useQuery({
    queryKey: ["charts", "anomaly-reasons"],
    queryFn: async () => {
      const data = await api.getAnomalyReasons();
      return z.array(anomalyReasonSchema).parse(data);
    },
  });
}
