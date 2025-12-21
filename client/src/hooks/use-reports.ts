import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ReportInput, type ReportResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Fetch all reports
export function useReports(filters?: { status?: string; category?: string }) {
  return useQuery({
    queryKey: [api.reports.list.path, filters],
    queryFn: async () => {
      // Build URL with query params
      const url = new URL(api.reports.list.path, window.location.origin);
      if (filters?.status && filters.status !== 'all') url.searchParams.append("status", filters.status);
      if (filters?.category && filters.category !== 'all') url.searchParams.append("category", filters.category);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reports");
      
      const data = await res.json();
      return api.reports.list.responses[200].parse(data);
    },
  });
}

// Get single report
export function useReport(id: number) {
  return useQuery({
    queryKey: [api.reports.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.reports.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch report");
      return api.reports.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Create new report
export function useCreateReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ReportInput) => {
      const validated = api.reports.create.input.parse(data);
      const res = await fetch(api.reports.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
           const error = api.reports.create.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to create report");
      }
      return api.reports.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
      toast({
        title: "Report Submitted",
        description: "Your report has been successfully submitted to the city.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update report status
export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "new" | "in_progress" | "resolved" }) => {
      const url = buildUrl(api.reports.updateStatus.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update status");
      return api.reports.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
      toast({
        title: "Status Updated",
        description: "The report status has been updated.",
      });
    },
  });
}

// Delete report
export function useDeleteReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.reports.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete report");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
      toast({
        title: "Report Deleted",
        description: "The report has been removed.",
      });
    },
  });
}
