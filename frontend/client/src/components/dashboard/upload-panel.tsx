import { useState, useRef } from "react";
import { useUploadCSV } from "@/hooks/use-simulation";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileType, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function UploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [isSimulation, setIsSimulation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadCSV();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    uploadMutation.mutate({ file, isSimulation });
  };

  return (
    <GlassCard className="h-full">
      <GlassCardHeader>
        <GlassCardTitle className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5 text-primary" />
          Data Ingestion
        </GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent className="space-y-6">
        <div 
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
            ${file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-white/5'}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            className="hidden" 
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-full ${file ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
              {file ? <FileType className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
            </div>
            
            <div className="space-y-1">
              <p className="font-medium">
                {file ? file.name : "Click to upload CSV"}
              </p>
              <p className="text-xs text-muted-foreground">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports transactions.csv"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 bg-secondary/50 p-3 rounded-lg">
          <div className="flex flex-col">
            <Label htmlFor="simulation-mode" className="font-medium">Simulation Mode</Label>
            <span className="text-xs text-muted-foreground">Run as test without saving</span>
          </div>
          <Switch 
            id="simulation-mode" 
            checked={isSimulation} 
            onCheckedChange={setIsSimulation} 
          />
        </div>

        {uploadMutation.isPending && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Processing...</span>
              <span>Please wait</span>
            </div>
            <Progress value={undefined} className="h-1" />
          </div>
        )}

        <Button 
          className="w-full" 
          onClick={handleUpload} 
          disabled={!file || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? "Analyzing..." : "Analyze Data"}
        </Button>

        {uploadMutation.isSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span>Analysis complete! Dashboard updated.</span>
          </div>
        )}

        {uploadMutation.isError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>Upload failed. Please try again.</span>
          </div>
        )}
      </GlassCardContent>
    </GlassCard>
  );
}
