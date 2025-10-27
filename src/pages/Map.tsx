import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { nepalDistricts } from "@/lib/data/nepal-locations";
import { getBatchAirData } from "@/lib/api/backend-client";
import { getAqiColor, getAqiLabel } from "@/lib/utils/forecasts";
import type { AirData } from "@/lib/types/air-quality";
import { MapPin, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DistrictMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<typeof nepalDistricts[0] | null>(null);
  const [districtData, setDistrictData] = useState<Record<string, AirData>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data for all districts
    const fetchData = async () => {
      setLoading(true);
      const locations = nepalDistricts.map(d => ({
        lat: d.lat,
        lng: d.lng,
        city: d.city
      }));
      
      const data = await getBatchAirData(locations);
      setDistrictData(data);
      setLoading(false);
    };
    
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);
  
  const getDistrictAqi = (district: typeof nepalDistricts[0]) => {
    return districtData[district.city]?.aqi ?? 50;
  };
  
  const getAqiStatus = (aqi: number) => {
    return getAqiLabel(aqi);
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Air Quality Map</h1>
            <p className="text-muted-foreground">Interactive pollution monitoring across Nepal</p>
          </div>
          <Button>
            <Navigation className="mr-2 h-4 w-4" />
            Use My Location
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Scrollable Nepal Map */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative h-[600px] overflow-auto bg-gradient-to-br from-primary/5 via-accent/5 to-background">
                {/* District Grid - Organized by Province */}
                <div className="min-h-full min-w-[800px] p-8">
                  <div className="space-y-6">
                    {/* Province 1 - Koshi */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Koshi Province</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {nepalDistricts.filter(d => d.province === "Koshi").map((district) => (
                          <button
                            key={district.id}
                            onClick={() => setSelectedDistrict(district)}
                            className={`group relative rounded-lg border-2 p-3 transition-all hover:scale-105 hover:shadow-lg ${
                              selectedDistrict?.id === district.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getAqiColor(getDistrictAqi(district))}`}>
                              {getDistrictAqi(district)}
                            </div>
                            <p className="text-xs font-medium text-foreground">{district.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Madhesh Province */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Madhesh Province</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {nepalDistricts.filter(d => d.province === "Madhesh").map((district) => (
                          <button
                            key={district.id}
                            onClick={() => setSelectedDistrict(district)}
                            className={`group relative rounded-lg border-2 p-3 transition-all hover:scale-105 hover:shadow-lg ${
                              selectedDistrict?.id === district.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getAqiColor(getDistrictAqi(district))}`}>
                              {getDistrictAqi(district)}
                            </div>
                            <p className="text-xs font-medium text-foreground">{district.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bagmati Province */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Bagmati Province</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {nepalDistricts.filter(d => d.province === "Bagmati").map((district) => (
                          <button
                            key={district.id}
                            onClick={() => setSelectedDistrict(district)}
                            className={`group relative rounded-lg border-2 p-3 transition-all hover:scale-105 hover:shadow-lg ${
                              selectedDistrict?.id === district.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getAqiColor(getDistrictAqi(district))}`}>
                              {getDistrictAqi(district)}
                            </div>
                            <p className="text-xs font-medium text-foreground">{district.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gandaki Province */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Gandaki Province</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {nepalDistricts.filter(d => d.province === "Gandaki").map((district) => (
                          <button
                            key={district.id}
                            onClick={() => setSelectedDistrict(district)}
                            className={`group relative rounded-lg border-2 p-3 transition-all hover:scale-105 hover:shadow-lg ${
                              selectedDistrict?.id === district.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getAqiColor(getDistrictAqi(district))}`}>
                              {getDistrictAqi(district)}
                            </div>
                            <p className="text-xs font-medium text-foreground">{district.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Lumbini Province */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Lumbini Province</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {nepalDistricts.filter(d => d.province === "Lumbini").map((district) => (
                          <button
                            key={district.id}
                            onClick={() => setSelectedDistrict(district)}
                            className={`group relative rounded-lg border-2 p-3 transition-all hover:scale-105 hover:shadow-lg ${
                              selectedDistrict?.id === district.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getAqiColor(getDistrictAqi(district))}`}>
                              {getDistrictAqi(district)}
                            </div>
                            <p className="text-xs font-medium text-foreground">{district.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Karnali Province */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Karnali Province</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {nepalDistricts.filter(d => d.province === "Karnali").map((district) => (
                          <button
                            key={district.id}
                            onClick={() => setSelectedDistrict(district)}
                            className={`group relative rounded-lg border-2 p-3 transition-all hover:scale-105 hover:shadow-lg ${
                              selectedDistrict?.id === district.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getAqiColor(getDistrictAqi(district))}`}>
                              {getDistrictAqi(district)}
                            </div>
                            <p className="text-xs font-medium text-foreground">{district.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sudurpashchim Province */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Sudurpashchim Province</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {nepalDistricts.filter(d => d.province === "Sudurpashchim").map((district) => (
                          <button
                            key={district.id}
                            onClick={() => setSelectedDistrict(district)}
                            className={`group relative rounded-lg border-2 p-3 transition-all hover:scale-105 hover:shadow-lg ${
                              selectedDistrict?.id === district.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getAqiColor(getDistrictAqi(district))}`}>
                              {getDistrictAqi(district)}
                            </div>
                            <p className="text-xs font-medium text-foreground">{district.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected District Detail Popup */}
                {selectedDistrict && (
                  <div className="absolute bottom-4 right-4 w-80 rounded-lg border border-border bg-card p-4 shadow-xl">
                    <button
                      onClick={() => setSelectedDistrict(null)}
                      className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <h3 className="mb-3 text-lg font-bold text-foreground">{selectedDistrict.name}</h3>
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="outline">{selectedDistrict.province} Province</Badge>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white ${getAqiColor(getDistrictAqi(selectedDistrict))}`}>
                        {getDistrictAqi(selectedDistrict)}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium">{getAqiStatus(getDistrictAqi(selectedDistrict))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PM2.5:</span>
                        <span className="font-medium">{districtData[selectedDistrict.city]?.pm25 || 25} μg/m³</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Legend and City List */}
          <div className="space-y-6">
            {/* AQI Legend */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-foreground">AQI Scale</h3>
              <div className="space-y-3">
                {[
                  { range: "0-50", label: "Good", color: "bg-green-500" },
                  { range: "51-100", label: "Moderate", color: "bg-yellow-500" },
                  { range: "101-150", label: "Unhealthy (Sensitive)", color: "bg-orange-500" },
                  { range: "151-200", label: "Unhealthy", color: "bg-red-500" },
                  { range: "201-300", label: "Very Unhealthy", color: "bg-purple-500" },
                  { range: "301+", label: "Hazardous", color: "bg-red-900" },
                ].map((item) => (
                  <div key={item.range} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`h-6 w-6 rounded ${item.color}`} />
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.range}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Province Quick Stats */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-foreground">Province Overview</h3>
              <div className="space-y-3">
                {["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"].map((province) => {
                  const districts = nepalDistricts.filter(d => d.province === province);
                  const avgAqi = Math.round(districts.reduce((sum, d) => sum + getDistrictAqi(d), 0) / districts.length);
                  return (
                    <div
                      key={province}
                      className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                    >
                      <div>
                        <div className="font-medium text-foreground">{province}</div>
                        <div className="text-xs text-muted-foreground">{districts.length} districts</div>
                      </div>
                      <div className={`rounded-lg px-3 py-1 text-sm font-bold text-white ${getAqiColor(avgAqi)}`}>
                        {avgAqi}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictMap;
