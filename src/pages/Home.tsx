import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AQICard from "@/components/AQICard";
import AlertBanner from "@/components/AlertBanner";
import { nepalCities, healthRecommendations } from "@/lib/data/nepal-locations";
import { MapPin, TrendingUp, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBestAirData } from "@/lib/api/backend-client";
import type { AirData } from "@/lib/types/air-quality";

const Home = () => {
  const [selectedCity, setSelectedCity] = useState(nepalCities[0]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [citiesData, setCitiesData] = useState<Record<number, AirData>>({});

  // Fetch data for the selected city (auto-refresh every 5 minutes = 300000ms)
  const { data: liveData, isLoading: liveLoading, refetch: refetchLiveData } = useQuery<AirData | null>({
    queryKey: ["air", selectedCity?.id],
    queryFn: async () => (selectedCity ? await getBestAirData({ lat: selectedCity.lat, lng: selectedCity.lng, city: selectedCity.city }) : null),
    enabled: !!selectedCity,
    staleTime: 300000, // 5 minutes
    refetchInterval: 300000, // Auto-refresh every 5 minutes
  });

  // Fetch data for all cities on initial load
  useEffect(() => {
    const fetchAllCities = async () => {
      console.log('🔄 Fetching air quality data for all cities...');
      const data: Record<number, AirData> = {};
      for (const city of nepalCities) {
        try {
          const airData = await getBestAirData({ lat: city.lat, lng: city.lng, city: city.city });
          if (airData) {
            data[city.id] = airData;
            console.log(`✅ Fetched ${city.city}: AQI ${airData.aqi} (${airData.provider})`);
          }
        } catch (error) {
          console.error(`❌ Failed to fetch data for ${city.city}:`, error);
        }
      }
      setCitiesData(data);
      setLastUpdate(new Date());
      console.log(`✅ All cities updated at ${new Date().toLocaleTimeString()}`);
    };

    fetchAllCities();
    // Refresh all cities data every 5 minutes (300000ms)
    const interval = setInterval(fetchAllCities, 300000);
    return () => clearInterval(interval);
  }, []);

  const getHealthInfo = (aqi: number) => {
    if (aqi <= 50) return { ...healthRecommendations.good, type: "success" as const };
    if (aqi <= 100) return { ...healthRecommendations.moderate, type: "info" as const };
    if (aqi <= 150) return { ...healthRecommendations.unhealthySensitive, type: "warning" as const };
    if (aqi <= 200) return { ...healthRecommendations.unhealthy, type: "danger" as const };
    if (aqi <= 300) return { ...healthRecommendations.veryUnhealthy, type: "danger" as const };
    return { ...healthRecommendations.hazardous, type: "danger" as const };
  };

  // Get current AQI for selected city (from live data or cached data)
  const currentAQI = liveData?.aqi ?? citiesData[selectedCity?.id]?.aqi ?? 50;
  const healthInfo = getHealthInfo(currentAQI);

  // Get city's real-time AQI for display in list
  const getCityAQI = (cityId: number) => {
    return citiesData[cityId]?.aqi ?? null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Activity className="mr-2 h-4 w-4" />
              Live Air Quality Monitoring
            </div>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
              Breathe Smarter with
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Real-Time </span>
              Air Quality Data
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Monitor pollution levels, get health alerts, and access 48-hour forecasts for cities across Nepal
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/map">
                <Button size="lg" className="shadow-lg">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Map
                </Button>
              </Link>
              <Link to="/forecast">
                <Button size="lg" variant="outline">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View Forecast
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - City Selector */}
          <div className="lg:col-span-1">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Select Location</h2>
            <div className="space-y-3">
              {nepalCities.map((city) => {
                const realAqi = getCityAQI(city.id);
                const displayAqi = realAqi;
                const isLoading = realAqi === null;
                
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      selectedCity.id === city.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{city.city}</div>
                        <div className="text-sm text-muted-foreground">
                          {isLoading ? "Loading..." : `AQI: ${displayAqi || 50}`}
                        </div>
                      </div>
                      {isLoading ? (
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      ) : (
                        <div className={`text-2xl font-bold ${
                          (displayAqi || 50) <= 50 ? "text-green-600" :
                          (displayAqi || 50) <= 100 ? "text-yellow-600" :
                          (displayAqi || 50) <= 150 ? "text-orange-600" :
                          (displayAqi || 50) <= 200 ? "text-red-600" :
                          "text-purple-600"
                        }`}>
                          {displayAqi || 50}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column - Current Air Quality */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Current Air Quality</h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Auto-refresh: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="space-y-6">
              <AQICard
                city={selectedCity.city}
                aqi={liveData?.aqi ?? citiesData[selectedCity.id]?.aqi ?? 50}
                pm25={liveData?.pm25 ?? citiesData[selectedCity.id]?.pm25 ?? 25}
                temperature={liveData?.temperature ?? citiesData[selectedCity.id]?.temperature}
                humidity={liveData?.humidity ?? citiesData[selectedCity.id]?.humidity}
                windSpeed={liveData?.windSpeed ?? citiesData[selectedCity.id]?.windSpeed}
                lastUpdated={
                  liveData?.provider 
                    ? `Live from ${liveData.provider}` 
                    : citiesData[selectedCity.id]?.provider 
                      ? `Updated: ${citiesData[selectedCity.id].provider}` 
                      : "Loading..."
                }
              />

              {/* Health Advisory */}
              <div className="rounded-xl border border-border/50 bg-card p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-foreground">Health Advisory</h3>
                <AlertBanner
                  type={healthInfo.type}
                  title={healthInfo.title}
                  message={healthInfo.description}
                  className="mb-4"
                />
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Recommended Actions:</h4>
                  <ul className="space-y-1">
                    {healthInfo.actions.map((action, index) => (
                      <li key={index} className="flex items-start text-sm text-muted-foreground">
                        <span className="mr-2">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-br from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Want More Insights?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Access 48-hour forecasts, school safety alerts, and detailed pollution analytics
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/forecast">
              <Button size="lg" variant="default">View Forecasts</Button>
            </Link>
            <Link to="/schools">
              <Button size="lg" variant="outline">School Alerts</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
