import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useReports } from "@/hooks/use-reports";
import { Loader2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in React Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapView() {
  const { data: reports, isLoading } = useReports();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Default center (San Francisco roughly, or calculate average of reports)
  const defaultCenter: [number, number] = [37.7749, -122.4194];
  const center = reports && reports.length > 0 
    ? [reports[0].latitude, reports[0].longitude] as [number, number]
    : defaultCenter;

  return (
    <div className="h-[calc(100vh-64px)] w-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports?.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.latitude, report.longitude]} 
            icon={icon}
          >
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-1">
                <h3 className="font-bold text-sm mb-1">{report.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {report.status.replace("_", " ")}
                  </span>
                  <a href={`/report/${report.id}`} className="text-xs text-blue-500 hover:underline">
                    View
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Overlay Controls could go here */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-border/50 max-w-xs">
         <h2 className="font-bold text-sm">Issue Map</h2>
         <p className="text-xs text-muted-foreground">Showing {reports?.length || 0} active reports</p>
      </div>
    </div>
  );
}
