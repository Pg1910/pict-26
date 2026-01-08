import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { useRiskDistribution, useAnomalyReasons, useTransactionsByHour, useAnomaliesByHour } from "@/hooks/use-charts";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Analytics() {
  const { data: riskData, isLoading: loadingRisk, isError: riskError, error: riskErrObj } = useRiskDistribution();
  const { data: reasonData, isLoading: loadingReason, isError: reasonError, error: reasonErrObj } = useAnomalyReasons();
  const { data: txnData, isLoading: loadingTxn, isError: txnError, error: txnErrObj } = useTransactionsByHour();
  const { data: anomalyData, isLoading: loadingAnom, isError: anomError, error: anomErrObj } = useAnomaliesByHour();

  const COLORS = ['#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Derived summaries (render only when data exists)
  const totalTransactions = txnData ? txnData.reduce((sum, d) => sum + (d.count ?? 0), 0) : undefined;
  const totalAnomalies = anomalyData ? anomalyData.reduce((sum, d) => sum + (d.count ?? 0), 0) : undefined;
  const riskBuckets = riskData ? riskData.length : undefined;
  const reasonCategories = reasonData ? reasonData.length : undefined;

  const anyLoading = loadingRisk || loadingReason || loadingTxn || loadingAnom;
  const firstError = txnError ? txnErrObj : anomError ? anomErrObj : riskError ? riskErrObj : reasonError ? reasonErrObj : undefined;
  const allError = txnError && anomError && riskError && reasonError;

  return (
    <DashboardLayout 
      title="Analytics Engine" 
      description="Deep dive into anomaly patterns and risk factors."
    >
      {/* Summary Blocks */}
      {anyLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl w-full bg-card/50" />
          ))}
        </div>
      ) : firstError ? (
        <div className="mb-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div className="ml-2">
              <AlertTitle>{allError ? "Backend not connected" : "Failed to load analytics"}</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                {allError
                  ? "Unable to reach the API. Check VITE_API_BASE_URL and ensure the backend is running."
                  : (firstError as Error)?.message ?? "An error occurred while fetching data."}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard>
            <GlassCardHeader className="pb-2"><GlassCardTitle className="text-sm text-muted-foreground">Transactions (24h)</GlassCardTitle></GlassCardHeader>
            <GlassCardContent>
              {typeof totalTransactions === 'number' ? (
                <div className="text-2xl font-mono font-semibold">{totalTransactions.toLocaleString()}</div>
              ) : (
                <div className="text-sm text-muted-foreground">No data available.</div>
              )}
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardHeader className="pb-2"><GlassCardTitle className="text-sm text-muted-foreground">Anomalies (24h)</GlassCardTitle></GlassCardHeader>
            <GlassCardContent>
              {typeof totalAnomalies === 'number' ? (
                <div className="text-2xl font-mono font-semibold">{totalAnomalies.toLocaleString()}</div>
              ) : (
                <div className="text-sm text-muted-foreground">No data available.</div>
              )}
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardHeader className="pb-2"><GlassCardTitle className="text-sm text-muted-foreground">Risk Buckets</GlassCardTitle></GlassCardHeader>
            <GlassCardContent>
              {typeof riskBuckets === 'number' ? (
                <div className="text-2xl font-mono font-semibold">{riskBuckets}</div>
              ) : (
                <div className="text-sm text-muted-foreground">No data available.</div>
              )}
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardHeader className="pb-2"><GlassCardTitle className="text-sm text-muted-foreground">Reason Categories</GlassCardTitle></GlassCardHeader>
            <GlassCardContent>
              {typeof reasonCategories === 'number' ? (
                <div className="text-2xl font-mono font-semibold">{reasonCategories}</div>
              ) : (
                <div className="text-sm text-muted-foreground">No data available.</div>
              )}
            </GlassCardContent>
          </GlassCard>
        </div>
      )}

      {/* Trend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard className="h-[400px]">
          <GlassCardHeader>
            <GlassCardTitle>Transactions by Hour</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="h-[320px]">
            {loadingTxn ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : txnError ? (
              <Alert variant="destructive" className="h-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5" />
                <div className="ml-2">
                  <AlertTitle>Failed to load transactions</AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground">{(txnErrObj as Error)?.message ?? "An error occurred."}</AlertDescription>
                </div>
              </Alert>
            ) : !txnData || txnData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">No transaction data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={txnData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <defs>
                    <linearGradient id="colorTxnAnalytics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickMargin={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} width={40} tickMargin={8} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTxnAnalytics)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </GlassCardContent>
        </GlassCard>

        <GlassCard className="h-[400px]">
          <GlassCardHeader>
            <GlassCardTitle>Anomalies by Hour</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="h-[320px]">
            {loadingAnom ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : anomError ? (
              <Alert variant="destructive" className="h-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5" />
                <div className="ml-2">
                  <AlertTitle>Failed to load anomalies</AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground">{(anomErrObj as Error)?.message ?? "An error occurred."}</AlertDescription>
                </div>
              </Alert>
            ) : !anomalyData || anomalyData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">No anomaly data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={anomalyData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }} barCategoryGap={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickMargin={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} width={40} tickMargin={8} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="h-[500px]">
          <GlassCardHeader>
            <GlassCardTitle>Risk Score Distribution</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="h-[420px] flex items-center justify-center">
            {loadingRisk ? (
              <Skeleton className="h-[300px] w-[300px] rounded-full" />
            ) : riskError ? (
              <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <div className="ml-2">
                  <AlertTitle>Failed to load risk distribution</AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground">{(riskErrObj as Error)?.message ?? "An error occurred."}</AlertDescription>
                </div>
              </Alert>
            ) : !riskData || riskData.length === 0 ? (
              <div className="text-sm text-muted-foreground">No distribution data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="range"
                  >
                    {riskData?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </GlassCardContent>
        </GlassCard>

        <GlassCard className="h-[500px]">
          <GlassCardHeader>
            <GlassCardTitle>Anomaly Reasons Breakdown</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="h-[420px]">
            {loadingReason ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : reasonError ? (
              <Alert variant="destructive" className="h-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5" />
                <div className="ml-2">
                  <AlertTitle>Failed to load anomaly reasons</AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground">{(reasonErrObj as Error)?.message ?? "An error occurred."}</AlertDescription>
                </div>
              </Alert>
            ) : !reasonData || reasonData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">No reasons available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reasonData} layout="vertical" margin={{ left: 20, right: 8, top: 8, bottom: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="reason" 
                    type="category" 
                    width={160} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
