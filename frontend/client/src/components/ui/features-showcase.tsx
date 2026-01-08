'use client'

import { Activity, ArrowRight, UploadCloud, Search, LineChart, Shield, AlertTriangle, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui/card'
import { useMetrics } from '@/hooks/use-metrics'
import { useTransactionsByHour } from '@/hooks/use-charts'
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

export default function FeaturesShowcase() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Live Metrics Card */}
          <LiveMetricsCard />

          {/* Transaction Activity Chart */}
          <TransactionActivityChart />

          {/* Feature Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-6 md:col-span-2">
            <FeatureCard
              icon={<UploadCloud className="w-4 h-4" />}
              title="CSV Ingestion"
              subtitle="Upload & Process"
              description="Drag and drop transaction files for instant backend validation and analysis."
            />
            <FeatureCard
              icon={<Search className="w-4 h-4" />}
              title="Explainable AI"
              subtitle="Understand Why"
              description="Every flagged transaction includes human-readable reasons and confidence scores."
            />
            <FeatureCard
              icon={<LineChart className="w-4 h-4" />}
              title="Visual Analytics"
              subtitle="Real-Time Insights"
              description="Interactive charts showing transaction patterns, risk distributions, and trends."
            />
            <FeatureCard
              icon={<Shield className="w-4 h-4" />}
              title="Risk Scoring"
              subtitle="ML-Powered"
              description="Advanced algorithms categorize transactions by severity for prioritized investigation."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ----------------- Feature Card Component -------------------
function FeatureCard({ 
  icon, 
  title, 
  subtitle, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
}) {
  return (
    <div className="relative flex flex-col gap-3 p-6 glass-panel rounded-2xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <div className="text-primary">{icon}</div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block mb-1">{title}</span>
          <h3 className="text-lg font-semibold text-foreground mb-2">{subtitle}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="absolute bottom-3 right-3 p-2 flex items-center justify-center border border-border rounded-full hover:rotate-45 transition-transform bg-background/80 backdrop-blur-sm">
        <ArrowRight className="w-3 h-3 text-primary" />
      </div>
    </div>
  )
}

// ----------------- Live Metrics Card -------------------
function LiveMetricsCard() {
  const { data: metrics, isLoading } = useMetrics()

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Activity className="w-4 h-4" />
        Live System Metrics
      </div>
      <h3 className="text-xl font-semibold text-foreground">
        Real-time monitoring{" "}
        <span className="text-muted-foreground">from your backend API</span>
      </h3>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <MetricBlock
            icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
            value={metrics.total_transactions.toLocaleString()}
            label="Total Transactions"
          />
          <MetricBlock
            icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
            value={metrics.anomalies_detected.toLocaleString()}
            label="Anomalies Detected"
          />
          <MetricBlock
            icon={<Shield className="w-5 h-5 text-red-500" />}
            value={metrics.unique_accounts.toLocaleString()}
            label="Unique Accounts"
          />
          <MetricBlock
            icon={<Activity className="w-5 h-5 text-green-500" />}
            value={(metrics.anomaly_rate * 100).toFixed(2) + '%'}
            label="Anomaly Rate"
          />
        </div>
      ) : (
        <div className="text-sm text-muted-foreground py-8 text-center">
          Connect backend to view live metrics
        </div>
      )}
    </div>
  )
}

function MetricBlock({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-background/50 border border-border rounded-lg">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

// ----------------- Transaction Activity Chart -------------------
const chartConfig = {
  count: {
    label: 'Transactions',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

function TransactionActivityChart() {
  const { data: hourlyData, isLoading } = useTransactionsByHour()

  // Transform data for chart
  const chartData = React.useMemo(() => {
    if (!hourlyData) return []
    return hourlyData.map((item) => ({
      hour: item.hour.toString(),
      count: item.count,
    }))
  }, [hourlyData])

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <LineChart className="w-4 h-4" />
        Transaction Activity
      </div>
      <h3 className="text-xl font-semibold text-foreground">
        Hourly patterns{" "}
        <span className="text-muted-foreground">tracked in real-time</span>
      </h3>

      {isLoading ? (
        <div className="h-48 bg-muted rounded-lg animate-pulse" />
      ) : chartData.length > 0 ? (
        <ChartContainer className="h-48 aspect-auto" config={chartConfig}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-count)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="hour" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis hide />
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area 
              strokeWidth={2} 
              dataKey="count" 
              type="monotone" 
              fill="url(#fillCount)" 
              stroke="var(--color-count)" 
            />
          </AreaChart>
        </ChartContainer>
      ) : (
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
          No transaction data available
        </div>
      )}
    </div>
  )
}

// ----------------- Chart Components (Inline) -------------------
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color,
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  {
    active?: boolean
    payload?: Array<any>
    label?: React.ReactNode
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
  } & React.ComponentProps<"div">
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
    },
    ref,
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!hideLabel && label && (
          <div className="font-medium">{label}</div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const itemConfig = config[item.dataKey as keyof typeof config]
            const indicatorColor = item.color

            return (
              <div
                key={index}
                className="flex w-full items-center gap-2"
              >
                {!hideIndicator && (
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: indicatorColor }}
                  />
                )}
                <div className="flex flex-1 justify-between">
                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltip"

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartStyle }
