import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1 lg:ml-72 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gradient-primary">{title}</h1>
            {description && (
              <p className="mt-2 text-muted-foreground text-lg">{description}</p>
            )}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
