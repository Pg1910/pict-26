import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Github, BookOpen, FileText, Upload, Database, Cpu, BarChart, CheckCircle, Code2, Layers } from "lucide-react";
import { GradientBars } from "@/components/ui/gradient-bars-background";
import FeaturesShowcase from "@/components/ui/features-showcase";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">FinGuard AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 animate-in fade-in duration-1000">
        <div className="absolute inset-0">
          <GradientBars
            numBars={9}
            gradientFrom="hsl(var(--primary))"
            gradientTo="transparent"
            animationDuration={3}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-foreground">
            Real-time Financial {""}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Anomaly Detection
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
            Upload transaction data, trigger backend processing, and explore explainable anomaly insights in a clean, responsive dashboard. The frontend visualizes results — all analysis happens in the backend.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>CSV Upload</span>
            </div>
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>ML Detection</span>
            </div>
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Real-Time Insights</span>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 transition-all">
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full border-white/15 text-foreground/90 hover:bg-white/5">
                View Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Showcase with Live Data */}
      <FeaturesShowcase />

      {/* How It Works */}
      <section className="relative py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              How It{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Works
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple four-step workflow to identify fraudulent transactions in your financial data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              <div className="glass-panel rounded-2xl p-6 h-full hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                  1
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Data</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your CSV file containing transaction records. The system validates the data structure and begins processing.
                </p>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <div className="glass-panel rounded-2xl p-6 h-full hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                  2
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Backend Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Machine learning algorithms analyze patterns, calculate risk scores, and identify anomalies based on multiple features.
                </p>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-450">
              <div className="glass-panel rounded-2xl p-6 h-full hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                  3
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Explainable AI generates human-readable reasons for each flagged transaction, providing transparency into the detection logic.
                </p>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
              <div className="glass-panel rounded-2xl p-6 h-full hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                  4
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visualize Results</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive dashboards display metrics, charts, and detailed transaction information for investigation and reporting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-3">
              Built with Modern{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Technologies
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Production-ready stack ensuring performance, type safety, and maintainability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-panel rounded-xl p-4 text-center hover:border-primary/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-50 delay-100">
              <Code2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-semibold">React 18</div>
              <div className="text-xs text-muted-foreground mt-1">UI Framework</div>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center hover:border-primary/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-50 delay-200">
              <Code2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-semibold">TypeScript</div>
              <div className="text-xs text-muted-foreground mt-1">Type Safety</div>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center hover:border-primary/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-50 delay-300">
              <Layers className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-semibold">Tailwind CSS</div>
              <div className="text-xs text-muted-foreground mt-1">Styling</div>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center hover:border-primary/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-50 delay-400">
              <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-semibold">React Query</div>
              <div className="text-xs text-muted-foreground mt-1">Data Fetching</div>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center hover:border-primary/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-50 delay-500">
              <BarChart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-semibold">Recharts</div>
              <div className="text-xs text-muted-foreground mt-1">Visualization</div>
            </div>
            <div className="glass-panel rounded-xl p-4 text-center hover:border-primary/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-50 delay-600">
              <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-semibold">shadcn/ui</div>
              <div className="text-xs text-muted-foreground mt-1">Components</div>
            </div>
          </div>

          <div className="mt-12 glass-panel rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Frontend Architecture
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Component-based architecture with React hooks for state management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>TypeScript strict mode for compile-time type safety</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>React Query for server state management with automatic caching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>shadcn/ui components with Radix UI primitives for accessibility</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Backend Integration
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>RESTful API endpoints for all data operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Zod schema validation for runtime type checking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Axios HTTP client with environment-based configuration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Error handling with user-friendly feedback messages</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl tracking-tight">FinGuard AI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
                Production-grade Transaction Anomaly Detection System combining powerful backend ML algorithms with an intuitive frontend dashboard. Detect fraud, investigate patterns, and protect your financial operations with enterprise-ready security.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://github.com/soham2yu/Fingurad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Github className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-display font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard">
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
                  </Link>
                </li>
                <li>
                  <Link href="/analytics">
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
                  </Link>
                </li>
                <li>
                  <Link href="/investigation">
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">Investigation</a>
                  </Link>
                </li>
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-display font-semibold text-sm mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs">
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Documentation
                    </a>
                  </Link>
                </li>
                <li>
                  <a href="#api" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="https://github.com/soham2yu/Fingurad" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 border-t border-white/5 pt-6 text-center text-sm text-muted-foreground">
          </div>
        </div>
      </footer>
    </div>
  );
}
