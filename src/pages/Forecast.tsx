import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { nepalDistricts } from "@/lib/data/nepal-locations";
import { generateForecastData, getAqiColor } from "@/lib/utils/forecasts";
import { getBestAirData } from "@/lib/api/backend-client";
import type { AirData } from "@/lib/types/air-quality";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wind, Droplets, MapPin, Clock, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Forecast = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("Kathmandu");
  const [districtData, setDistrictData] = useState<AirData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const district = nepalDistricts.find(d => d.city === selectedDistrict);
  
  useEffect(() => {
    if (district) {
      setLoading(true);
      getBestAirData({ lat: district.lat, lng: district.lng, city: district.city })
        .then(data => {
          setDistrictData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedDistrict, district]);
  
  const forecastData = district && districtData
    ? generateForecastData(districtData, district.city, districtData.aqi)
    : null;
  
  if (!forecastData) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Air Quality Forecast</h1>
            <p className="text-muted-foreground">
              48-hour pollution prediction for all districts of Nepal
            </p>
          </div>
          
          <div className="w-full md:w-72">
            <label className="mb-2 block text-sm font-medium text-foreground">
              <MapPin className="mb-1 mr-1 inline h-4 w-4" />
              Select District
            </label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Choose a district" />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-[300px] bg-background">
                {nepalDistricts.map((d) => (
                  <SelectItem key={d.id} value={d.city}>
                    {d.city} ({d.province})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Current Status */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{district?.city || selectedDistrict}</h2>
              <p className="text-sm text-muted-foreground">
                {district?.province} Province • Current Air Quality
              </p>
            </div>
            <div
              className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl text-white shadow-lg ${getAqiColor(districtData?.aqi || 0)}`}
            >
              <span className="text-3xl font-bold">{districtData?.aqi || 50}</span>
              <span className="text-xs">AQI</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">PM2.5</div>
                <div className="font-medium text-foreground">{districtData?.pm25 || 25} μg/m³</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium text-foreground">
                  {districtData?.aqi && districtData.aqi <= 100 ? "Moderate" : "Unhealthy"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-muted-foreground">24h Trend</div>
                <div className="font-medium text-green-600">Improving</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm text-muted-foreground">Confidence</div>
                <div className="font-medium text-foreground">85%</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 24 Hour Forecast */}
          <Card className="p-6">
            <div className="mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Next 24 Hours</h2>
            </div>
            <div className="space-y-3">
              {forecastData.hours24.map((data, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="flex items-center space-x-4">
                    <div className="font-medium text-foreground">{data.hour}</div>
                    <div className="text-sm text-muted-foreground">PM2.5: {data.pm25}</div>
                  </div>
                  <div className={`rounded-lg px-3 py-1 text-sm font-bold text-white ${getAqiColor(data.aqi)}`}>
                    AQI {data.aqi}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 48 Hour Forecast */}
          <Card className="p-6">
            <div className="mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">24-48 Hours Ahead</h2>
            </div>
            <div className="space-y-3">
              {forecastData.hours48.map((data, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="flex items-center space-x-4">
                    <div className="font-medium text-foreground">{data.hour}</div>
                    <div className="text-sm text-muted-foreground">PM2.5: {data.pm25}</div>
                  </div>
                  <div className={`rounded-lg px-3 py-1 text-sm font-bold text-white ${getAqiColor(data.aqi)}`}>
                    AQI {data.aqi}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Trend Analysis */}
        <Card className="mt-6 p-6">
          <div className="mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Trend Analysis</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Current Status</div>
              <div className="text-2xl font-bold text-foreground">{districtData?.aqi || 50}</div>
              <div className="text-sm text-muted-foreground">
                {districtData?.aqi && districtData.aqi <= 100 ? "Moderate" : "Unhealthy"}
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">24h Average</div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(forecastData.hours24.reduce((sum, d) => sum + d.aqi, 0) / forecastData.hours24.length)}
              </div>
              <div className="text-sm text-orange-600">↓ Improving slightly</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">48h Outlook</div>
              <div className="text-2xl font-bold text-foreground">
                {forecastData.hours48[forecastData.hours48.length - 1].aqi}
              </div>
              <div className="text-sm text-green-600">↓ Better conditions expected</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-blue-500/10 p-4">
            <p className="text-sm text-foreground">
              <strong>Forecast Insight:</strong> Air quality is expected to improve gradually over the next 48 hours due to favorable wind patterns and reduced pollution sources. Best outdoor activity window: 36-48 hours from now.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Forecast;
