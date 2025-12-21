import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReportSchema } from "@shared/schema";
import { type ReportInput } from "@shared/routes";
import { useCreateReport } from "@/hooks/use-reports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Upload, X, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";

// Extend schema to ensure lat/lng are required in the form logic but handled gracefully
const formSchema = insertReportSchema.extend({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export default function ReportIssue() {
  const [, setLocation] = useLocation();
  const createReport = useCreateReport();
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const form = useForm<ReportInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "other",
      status: "new",
      latitude: 0,
      longitude: 0,
      address: "",
      mediaUrls: [],
    },
  });

  // Get User Location on Mount
  useEffect(() => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude);
          form.setValue("longitude", position.coords.longitude);
          setIsLocating(false);
          // Reverse geocoding could go here to fill address
          // For now just showing coords or "Current Location"
          form.setValue("address", "Current Device Location"); 
        },
        (error) => {
          setIsLocating(false);
          setLocationError("Could not access location. Please enable location services.");
          console.error("Location error:", error);
        }
      );
    } else {
      setIsLocating(false);
      setLocationError("Geolocation not supported by this browser.");
    }
  }, [form]);

  const onSubmit = async (data: ReportInput) => {
    // Add uploaded URLs to the form data
    const finalData = { ...data, mediaUrls: uploadedUrls };
    try {
      await createReport.mutateAsync(finalData);
      setLocation("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadComplete = (result: any) => {
    // Uppy result handling - simplified assumption based on ObjectUploader
    if (result.successful) {
      const newUrls = result.successful.map((file: any) => file.uploadURL);
      setUploadedUrls((prev) => [...prev, ...newUrls]);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Report an Issue</h1>
        <p className="text-muted-foreground">Help us fix problems in your neighborhood.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Large pothole on Main St" className="bg-background rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background rounded-xl">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pothole">🚧 Pothole</SelectItem>
                        <SelectItem value="garbage">🗑️ Garbage / Dump</SelectItem>
                        <SelectItem value="streetlight">💡 Streetlight Outage</SelectItem>
                        <SelectItem value="other">📝 Other Issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the issue in detail..." 
                        className="bg-background rounded-xl min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Display */}
              <div className="bg-muted/50 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Location</p>
                    <p className="text-xs text-muted-foreground">
                      {isLocating 
                        ? "Locating..." 
                        : locationError 
                          ? "Location unavailable" 
                          : `${form.getValues("latitude").toFixed(6)}, ${form.getValues("longitude").toFixed(6)}`}
                    </p>
                  </div>
                </div>
                {isLocating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              </div>
              {locationError && <p className="text-xs text-destructive">{locationError}</p>}

              {/* Media Upload */}
              <div className="space-y-3">
                <FormLabel>Photos / Videos</FormLabel>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {uploadedUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                      <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setUploadedUrls(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  <ObjectUploader
                    maxNumberOfFiles={3}
                    onGetUploadParameters={async (file) => {
                      const res = await fetch("/api/uploads/request-url", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: file.name,
                          size: file.size,
                          contentType: file.type,
                        }),
                      });
                      const { uploadURL } = await res.json();
                      return {
                        method: "PUT",
                        url: uploadURL,
                        headers: { "Content-Type": file.type },
                      };
                    }}
                    onComplete={handleUploadComplete}
                    buttonClassName="w-full h-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors p-0"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                  </ObjectUploader>
                </div>
              </div>

            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
            disabled={createReport.isPending || isLocating}
          >
            {createReport.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
