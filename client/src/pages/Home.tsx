import { useReports } from "@/hooks/use-reports";
import { ReportCard } from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Home() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { data: reports, isLoading } = useReports({
    status: statusFilter,
    category: categoryFilter,
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Section */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Make Your City <span className="text-primary">Better</span>
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg">
                Report issues, track progress, and contribute to a cleaner, safer community.
              </p>
            </div>
            <Link href="/report">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all font-semibold rounded-xl">
                <Plus className="w-5 h-5 mr-2" /> Report an Issue
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-display font-bold">Recent Reports</h2>
          
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-background">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="garbage">Garbage</SelectItem>
                <SelectItem value="streetlight">Streetlight</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !reports || reports.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-6">Be the first to report an issue in your area.</p>
            <Link href="/report">
              <Button variant="outline">Report Issue</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ReportCard report={report} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
