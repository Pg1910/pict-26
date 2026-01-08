import { useMetrics } from "@/hooks/use-metrics";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Activity, AlertTriangle, BarChart, Users, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MetricsGrid() {
  const { data: metrics, isLoading, isError, error } = useMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl w-full bg-card/50" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <div className="ml-2">
          <AlertTitle>Failed to load metrics</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            {(error as Error)?.message ?? "An error occurred while fetching data."}
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  if (!metrics) {
    return (
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Metrics</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="text-sm text-muted-foreground">No metrics available.</div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  const items = [
    {
      title: "Total Transactions",
      value: metrics.total_transactions.toLocaleString(),
      icon: Activity,
      color: "text-blue-500",
    },
    {
      title: "Anomalies Detected",
      value: metrics.anomalies_detected.toLocaleString(),
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      title: "Anomaly Rate",
      value: `${(metrics.anomaly_rate * 100).toFixed(2)}%`,
      icon: BarChart,
      color: "text-yellow-500",
    },
    {
      title: "Unique Accounts",
      value: metrics.unique_accounts.toLocaleString(),
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {items.map((item) => (
        <GlassCard key={item.title} variant="hoverable" className="relative overflow-hidden group">
          <GlassCardHeader className="flex flex-row items-center justify-between pb-2">
            <GlassCardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </GlassCardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-2xl font-bold font-mono tracking-tight">{item.value}</div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${item.color.split('-')[1]}-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
          </GlassCardContent>
        </GlassCard>
      ))}
    </div>
  );
}
