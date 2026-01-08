import { useFlaggedTransactions } from "@/hooks/use-transactions";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { useState, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function FlaggedTransactionsTable() {
  const { data: transactions, isLoading, isError, error } = useFlaggedTransactions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<typeof transactions extends Array<infer T> ? T | null : any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-64 rounded-xl" />;
  }

  return (
    <>
      <GlassCard className="col-span-full">
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Recent High-Risk Transactions
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <div className="ml-2">
              <AlertTitle>Failed to load flagged transactions</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                {(error as Error)?.message ?? "An error occurred while fetching data."}
              </AlertDescription>
            </div>
          </Alert>
        )}
        <div className="rounded-md border border-white/5 overflow-hidden">
          <Table className="min-w-[1000px]">
            <TableHeader className="bg-secondary/70 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-secondary/60">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="font-mono text-xs uppercase">Transaction ID</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Reasons</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions && transactions.length > 0 ? (
                transactions.map((tx) => {
                  const isSelected = selectedId === tx.transaction_id;
                  const isExpanded = expandedId === tx.transaction_id;
                  const canExpand = tx.reasons && tx.reasons.length > 0;
                  return (
                    <>
                      <TableRow
                        key={tx.transaction_id}
                        data-state={isSelected ? "selected" : undefined}
                        tabIndex={0}
                        onClick={() => {
                          toggleSelect(tx.transaction_id);
                          setSelectedTx(tx);
                          setIsSheetOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleSelect(tx.transaction_id);
                            setSelectedTx(tx);
                            setIsSheetOpen(true);
                          }
                          if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && canExpand) {
                            e.preventDefault();
                            toggleExpand(tx.transaction_id);
                          }
                        }}
                        className="border-white/5 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors duration-150"
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {tx.transaction_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">{tx.account}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(tx.timestamp), "MMM d, HH:mm")}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          ${tx.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{tx.location}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${tx.risk_score > 0.8 ? 'border-red-500/50 text-red-400 bg-red-500/10' : 
                                tx.risk_score > 0.5 ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' : 
                                'border-green-500/50 text-green-400 bg-green-500/10'}
                            `}
                          >
                            {(tx.risk_score * 100).toFixed(0)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {tx.reasons.map((reason, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                {reason}
                              </span>
                            ))}
                          </div>
                          {canExpand && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); toggleExpand(tx.transaction_id); }}
                              className="mt-2 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                              aria-expanded={isExpanded}
                              aria-controls={`row-details-${tx.transaction_id}`}
                            >
                              {isExpanded ? "Hide details" : "View details"}
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                      {canExpand && isExpanded && (
                        <TableRow className="border-white/5 bg-white/5/20">
                          <TableCell colSpan={7} className="p-4">
                            <div id={`row-details-${tx.transaction_id}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-xs text-muted-foreground">Full Transaction ID</div>
                                <div className="font-mono break-all">{tx.transaction_id}</div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Reasons</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {tx.reasons.map((reason, i) => (
                                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                      {reason}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Timestamp</div>
                                <div className="text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No flagged transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </GlassCardContent>
    </GlassCard>
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>All available fields are shown. Missing fields are marked as Not available.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <div className="text-xs text-muted-foreground">Transaction ID</div>
            <div className="font-mono break-all">{selectedTx?.transaction_id ?? "Not available"}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Account</div>
              <div className="">{selectedTx?.account ?? "Not available"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Amount</div>
              <div className="font-mono">{typeof selectedTx?.amount === "number" ? `$${selectedTx.amount.toFixed(2)}` : "Not available"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Location</div>
              <div className="">{selectedTx?.location ?? "Not available"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
              <div className="font-mono">{typeof selectedTx?.risk_score === "number" ? (selectedTx.risk_score * 100).toFixed(0) : "Not available"}</div>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Timestamp</div>
            <div className="">{selectedTx?.timestamp ? new Date(selectedTx.timestamp).toLocaleString() : "Not available"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Reasons</div>
            {Array.isArray(selectedTx?.reasons) && selectedTx!.reasons.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedTx!.reasons.map((reason: string, i: number) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {reason}
                  </span>
                ))}
              </div>
            ) : (
              <div>Not available</div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
    </>
  );
}
