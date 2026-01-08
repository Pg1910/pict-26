import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Search } from "lucide-react";
import { FlaggedTransactionsTable } from "@/components/dashboard/transactions-table";

export default function Investigation() {
  return (
    <DashboardLayout 
      title="Investigation Hub" 
      description="Search and analyze specific transactions or accounts."
    >
      <div className="space-y-6">
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Search Parameters</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by Transaction ID, Account Number, or Merchant..." 
                className="pl-10 h-12 bg-secondary/30 border-white/5 focus-visible:ring-primary/30 text-lg" 
              />
            </div>
          </GlassCardContent>
        </GlassCard>

        <FlaggedTransactionsTable />
      </div>
    </DashboardLayout>
  );
}
