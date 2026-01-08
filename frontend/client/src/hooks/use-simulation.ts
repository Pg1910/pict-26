import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { simulationSummarySchema, simulationSessionSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export function useSimulationSummary() {
  return useQuery({
    queryKey: ["simulation", "summary"],
    queryFn: async () => {
      const data = await api.getSimulationSummary();
      return simulationSummarySchema.parse(data);
    },
  });
}

export function useSimulationSessions() {
  return useQuery({
    queryKey: ["simulation", "sessions"],
    queryFn: async () => {
      const data = await api.getSimulationSessions();
      return z.array(simulationSessionSchema).parse(data);
    },
  });
}

export function useUploadCSV() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, isSimulation }: { file: File; isSimulation: boolean }) => {
      return api.uploadCSV(file, isSimulation);
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: data.message || "File processed successfully.",
        variant: "default",
      });
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["charts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["simulation"] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.response?.data?.message || error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });
}
