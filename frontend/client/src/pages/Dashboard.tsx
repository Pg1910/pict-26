import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { UploadPanel } from "@/components/dashboard/upload-panel";
import { FlaggedTransactionsTable } from "@/components/dashboard/transactions-table";
import { useTransactionsByHour, useAnomaliesByHour } from "@/hooks/use-charts";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function ChartsSection() {
  const { data: txnData, isLoading: isLoadingTxn, isError: isTxnError, error: txnError } = useTransactionsByHour();
  const { data: anomalyData, isLoading: isLoadingAnomaly, isError: isAnomalyError, error: anomalyError } = useAnomaliesByHour();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 border border-border p-3 rounded-lg shadow-xl">
          <p className="text-xs text-muted-foreground mb-1">Hour</p>
          <p className="text-sm font-medium mb-2">{label}</p>
          <p className="text-xs text-muted-foreground">Count</p>
          <p className="text-sm text-primary font-mono font-semibold">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GlassCard className="h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 hover:shadow-xl transition-shadow">
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <GlassCardTitle>Transaction Volume (24h)</GlassCardTitle>
              <p className="text-xs text-muted-foreground mt-1">Live hourly counts from backend</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
        </GlassCardHeader>
        <GlassCardContent className="h-[320px]">
          {isLoadingTxn ? (
            <div className="h-full w-full rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 animate-pulse" />
          ) : isTxnError ? (
            <Alert variant="destructive" className="h-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
              <div className="ml-2">
                <AlertTitle>Failed to load transactions</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                  {(txnError as Error)?.message ?? "An error occurred while fetching data."}
                </AlertDescription>
              </div>
            </Alert>
          ) : !txnData || txnData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
              No transaction data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={txnData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <defs>
                  <linearGradient id="colorTxn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.01} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="hour" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickMargin={8}
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  width={40}
                  tickMargin={8}
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} wrapperStyle={{ outline: "none" }} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorTxn)" 
                  strokeWidth={2.5}
                  filter="url(#glow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </GlassCardContent>
      </GlassCard>

      <GlassCard className="h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 hover:shadow-xl transition-shadow">
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <GlassCardTitle>Anomalies Detected (24h)</GlassCardTitle>
              <p className="text-xs text-muted-foreground mt-1">Backend anomaly events per hour</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          </div>
        </GlassCardHeader>
        <GlassCardContent className="h-[320px]">
          {isLoadingAnomaly ? (
            <div className="h-full w-full rounded-lg bg-gradient-to-br from-destructive/10 to-muted/10 animate-pulse" />
          ) : isAnomalyError ? (
            <Alert variant="destructive" className="h-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
              <div className="ml-2">
                <AlertTitle>Failed to load anomalies</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                  {(anomalyError as Error)?.message ?? "An error occurred while fetching data."}
                </AlertDescription>
              </div>
            </Alert>
          ) : !anomalyData || anomalyData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
              No anomaly data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anomalyData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }} barCategoryGap={12}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="hour" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickMargin={8}
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  width={40}
                  tickMargin={8}
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} wrapperStyle={{ outline: "none" }} />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorBar)" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout 
      title="Financial Overview" 
      description="Real-time transaction monitoring and anomaly detection."
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.08),transparent_30%),radial-gradient(circle_at_50%_60%,rgba(16,185,129,0.08),transparent_32%)]" />
        <div className="space-y-8 relative z-10">
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <MetricsGrid />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ChartsSection />
            </div>
            <div className="lg:col-span-1 self-start animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
              <UploadPanel />
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <FlaggedTransactionsTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
