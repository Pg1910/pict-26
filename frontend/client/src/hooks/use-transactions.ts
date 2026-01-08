import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { transactionSchema } from "@shared/schema";
import { z } from "zod";

export function useFlaggedTransactions() {
  return useQuery({
    queryKey: ["transactions", "flagged"],
    queryFn: async () => {
      const data = await api.getFlaggedTransactions();
      return z.array(transactionSchema).parse(data);
    },
  });
}
