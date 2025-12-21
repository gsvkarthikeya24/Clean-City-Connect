import { useReport, useUpdateReportStatus, useDeleteReport } from "@/hooks/use-reports";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, ArrowLeft, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useRoute, Link, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function ReportDetail() {
  const [, params] = useRoute("/report/:id");
  const [, setLocation] = useLocation();
  const id = Number(params?.id);
  const { data: report, isLoading } = useReport(id);
  const { user } = useAuth();
  
  const updateStatus = useUpdateReportStatus();
  const deleteReport = useDeleteReport();

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!report) return <div className="text-center p-10">Report not found</div>;

  const handleDelete = async () => {
    await deleteReport.mutateAsync(id);
    setLocation("/");
  };

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    in_progress: "bg-amber-100 text-amber-700",
    resolved: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
      <Link href="/">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="aspect-video bg-muted rounded-2xl overflow-hidden border border-border shadow-sm">
            {report.mediaUrls && report.mediaUrls.length > 0 ? (
              <img src={report.mediaUrls[0]} alt={report.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
            )}
          </div>
          
          {/* Thumbnails if multiple images */}
          {report.mediaUrls && report.mediaUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {report.mediaUrls.map((url, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={url} alt={`View ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge className={cn("px-3 py-1 text-sm capitalize", statusColors[report.status as keyof typeof statusColors])}>
                {report.status.replace("_", " ")}
              </Badge>
              <span className="text-sm text-muted-foreground">#{report.id}</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">{report.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{report.description}</p>
          </div>

          <Card className="p-4 bg-muted/30 border-none space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Location</p>
                <p className="text-xs text-muted-foreground">{report.address || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Reported On</p>
                <p className="text-xs text-muted-foreground">
                  {report.createdAt ? format(new Date(report.createdAt), "PPP p") : "Unknown"}
                </p>
              </div>
            </div>
          </Card>

          {/* Admin / User Actions */}
          <div className="pt-4 border-t border-border space-y-4">
             <h3 className="font-semibold text-sm text-foreground">Actions</h3>
             
             <div className="flex flex-wrap gap-2">
               {/* Status Update Buttons */}
               <Button 
                 variant={report.status === "new" ? "default" : "outline"}
                 size="sm"
                 onClick={() => updateStatus.mutate({ id, status: "new" })}
                 disabled={updateStatus.isPending}
                 className="flex-1"
               >
                 <AlertCircle className="w-3 h-3 mr-2" /> New
               </Button>
               <Button 
                 variant={report.status === "in_progress" ? "default" : "outline"}
                 size="sm"
                 onClick={() => updateStatus.mutate({ id, status: "in_progress" })}
                 disabled={updateStatus.isPending}
                 className="flex-1"
               >
                 <Clock className="w-3 h-3 mr-2" /> In Progress
               </Button>
               <Button 
                 variant={report.status === "resolved" ? "default" : "outline"}
                 size="sm"
                 onClick={() => updateStatus.mutate({ id, status: "resolved" })}
                 disabled={updateStatus.isPending}
                 className="flex-1"
               >
                 <CheckCircle2 className="w-3 h-3 mr-2" /> Resolved
               </Button>
             </div>

             <div className="pt-4">
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Report
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the report and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
