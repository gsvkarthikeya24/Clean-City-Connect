import { type Report } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const statusColors = {
    new: "bg-blue-100 text-blue-700 border-blue-200",
    in_progress: "bg-amber-100 text-amber-700 border-amber-200",
    resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const statusLabels = {
    new: "New",
    in_progress: "In Progress",
    resolved: "Resolved",
  };

  const categoryIcons = {
    pothole: "🚧",
    garbage: "🗑️",
    streetlight: "💡",
    other: "📝",
  };

  return (
    <Link href={`/report/${report.id}`}>
      <Card className="overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer group h-full flex flex-col">
        <div className="relative h-48 bg-muted overflow-hidden">
          {report.mediaUrls && report.mediaUrls.length > 0 ? (
            <img 
              src={report.mediaUrls[0]} 
              alt={report.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground text-4xl">
              {categoryIcons[report.category as keyof typeof categoryIcons]}
            </div>
          )}
          <div className="absolute top-3 right-3">
             <Badge className={cn("capitalize shadow-sm", statusColors[report.status as keyof typeof statusColors])}>
               {statusLabels[report.status as keyof typeof statusLabels]}
             </Badge>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
             <h3 className="font-display font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
               {report.title}
             </h3>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {report.description}
          </p>
          
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{report.address || "Location unavailable"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{report.createdAt ? formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }) : "Just now"}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 border-t border-border/50 bg-muted/20 flex justify-between items-center mt-auto">
          <Badge variant="outline" className="text-xs font-normal">
            {report.category}
          </Badge>
          <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Details <ArrowRight className="w-3 h-3" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
