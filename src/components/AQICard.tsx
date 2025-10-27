import { MapPin, Wind, Droplets, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AQICardProps {
  city: string;
  aqi: number;
  pm25: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  lastUpdated?: string;
}

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { label: "Good", color: "hsl(var(--aqi-good))", bgColor: "bg-green-500/10" };
  if (aqi <= 100) return { label: "Moderate", color: "hsl(var(--aqi-moderate))", bgColor: "bg-yellow-500/10" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "hsl(var(--aqi-sensitive))", bgColor: "bg-orange-500/10" };
  if (aqi <= 200) return { label: "Unhealthy", color: "hsl(var(--aqi-unhealthy))", bgColor: "bg-red-500/10" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "hsl(var(--aqi-very-unhealthy))", bgColor: "bg-purple-500/10" };
  return { label: "Hazardous", color: "hsl(var(--aqi-hazardous))", bgColor: "bg-red-900/10" };
};

const AQICard = ({ city, aqi, pm25, temperature, humidity, windSpeed, lastUpdated }: AQICardProps) => {
  const status = getAQIStatus(aqi);

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg transition-all hover:shadow-xl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">{city}</h3>
          </div>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">{lastUpdated}</span>
          )}
        </div>

        {/* AQI Display */}
        <div className={cn("mb-6 rounded-2xl p-8 text-center", status.bgColor)}>
          <div 
            className="mb-2 text-6xl font-bold"
            style={{ color: status.color }}
          >
            {aqi}
          </div>
          <div className="text-sm font-medium uppercase tracking-wide" style={{ color: status.color }}>
            {status.label}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Air Quality Index
          </div>
        </div>

        {/* PM2.5 and Weather Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="mb-1 flex items-center space-x-1">
              <Wind className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">PM2.5</span>
            </div>
            <div className="text-xl font-bold text-foreground">{pm25}</div>
            <div className="text-xs text-muted-foreground">μg/m³</div>
          </div>

          {temperature !== undefined && (
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="mb-1 flex items-center space-x-1">
                <Thermometer className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Temp</span>
              </div>
              <div className="text-xl font-bold text-foreground">{temperature}°</div>
              <div className="text-xs text-muted-foreground">Celsius</div>
            </div>
          )}

          {humidity !== undefined && (
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="mb-1 flex items-center space-x-1">
                <Droplets className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Humidity</span>
              </div>
              <div className="text-xl font-bold text-foreground">{humidity}%</div>
              <div className="text-xs text-muted-foreground">Relative</div>
            </div>
          )}

          {windSpeed !== undefined && (
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="mb-1 flex items-center space-x-1">
                <Wind className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Wind</span>
              </div>
              <div className="text-xl font-bold text-foreground">{windSpeed}</div>
              <div className="text-xs text-muted-foreground">km/h</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AQICard;
