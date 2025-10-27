import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AlertBanner from "@/components/AlertBanner";
import { schoolLocations } from "@/lib/data/nepal-locations";
import { getBatchAirData } from "@/lib/api/backend-client";
import type { AirData } from "@/lib/types/air-quality";
import { Card } from "@/components/ui/card";
import { School, MapPin, Activity, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Schools = () => {
  const [schoolData, setSchoolData] = useState<Record<string, AirData>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data for all schools
    const fetchData = async () => {
      setLoading(true);
      const locations = schoolLocations.map(s => ({
        lat: s.lat,
        lng: s.lng,
        city: s.city
      }));
      
      const data = await getBatchAirData(locations);
      setSchoolData(data);
      setLoading(false);
    };
    
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);
  
  const getSchoolAQI = (school: typeof schoolLocations[0]) => {
    return schoolData[school.city]?.aqi ?? 50;
  };
  
  const getAlertType = (aqi: number) => {
    if (aqi <= 50) return "success" as const;
    if (aqi <= 100) return "info" as const;
    if (aqi <= 150) return "warning" as const;
    return "danger" as const;
  };

  const getAlertTitle = (aqi: number) => {
    if (aqi <= 50) return "Safe for Outdoor Activities";
    if (aqi <= 100) return "Acceptable Air Quality";
    if (aqi <= 150) return "Caution for Sensitive Students";
    return "Outdoor Activities Not Recommended";
  };
  
  const getRecommendation = (aqi: number) => {
    if (aqi <= 50) return "Air quality is excellent. All outdoor activities are safe and encouraged.";
    if (aqi <= 100) return "Air quality is acceptable. Outdoor activities are safe for most students.";
    if (aqi <= 150) return "Sensitive students with respiratory conditions should limit outdoor activities.";
    return "Outdoor activities should be avoided. Keep students indoors with proper ventilation.";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <School className="mr-2 h-4 w-4" />
            School Safety Mode
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">School Air Quality Alerts</h1>
          <p className="text-muted-foreground">
            Real-time safety recommendations for educational institutions across Nepal
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 border-primary/20 bg-primary/5 p-6">
          <div className="flex items-start space-x-3">
            <Bell className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="mb-2 font-semibold text-foreground">How School Alerts Work</h3>
              <p className="text-sm text-muted-foreground">
                We monitor air quality near educational institutions and provide actionable recommendations. Schools can subscribe to SMS/email alerts for real-time notifications when air quality changes significantly.
              </p>
            </div>
          </div>
        </Card>

        {/* School Alerts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {schoolLocations.map((school) => {
            const aqi = getSchoolAQI(school);
            const alertType = getAlertType(aqi);
            const alertTitle = getAlertTitle(aqi);
            const recommendation = getRecommendation(aqi);
            const isGood = aqi <= 100;
            
            return (
              <Card key={school.id} className="overflow-hidden">
                <div className="border-b border-border/50 bg-muted/30 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-semibold text-foreground">{school.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" />
                        {school.city}, {school.province}
                      </div>
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 text-center text-white shadow-lg ${
                        aqi <= 50
                          ? "bg-green-500"
                          : aqi <= 100
                          ? "bg-yellow-500"
                          : aqi <= 150
                          ? "bg-orange-500"
                          : aqi <= 200
                          ? "bg-red-500"
                          : "bg-purple-500"
                      }`}
                    >
                      <div className="text-2xl font-bold">{aqi}</div>
                      <div className="text-xs">AQI</div>
                    </div>
                  </div>

                  <AlertBanner
                    type={alertType}
                    title={alertTitle}
                    message={recommendation}
                  />
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Activity Guidelines</h4>
                  </div>
                  <div className="space-y-2">
                    {isGood ? (
                      <>
                        <div className="flex items-start text-sm">
                          <span className="mr-2 text-green-600">✓</span>
                          <span className="text-muted-foreground">Normal outdoor PE classes allowed</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <span className="mr-2 text-green-600">✓</span>
                          <span className="text-muted-foreground">Playground activities safe</span>
                        </div>
                        {aqi > 50 && aqi <= 100 && (
                          <div className="flex items-start text-sm">
                            <span className="mr-2 text-yellow-600">⚠</span>
                            <span className="text-muted-foreground">Monitor sensitive students</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-start text-sm">
                          <span className="mr-2 text-red-600">✕</span>
                          <span className="text-muted-foreground">Cancel outdoor activities</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <span className="mr-2 text-red-600">✕</span>
                          <span className="text-muted-foreground">Keep students indoors</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <span className="mr-2 text-orange-600">⚠</span>
                          <span className="text-muted-foreground">Ensure proper ventilation/air filtration</span>
                        </div>
                      </>
                    )}
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    Subscribe to Alerts
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Resources */}
        <Card className="mt-8 p-6">
          <h3 className="mb-4 text-xl font-semibold text-foreground">For School Administrators</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h4 className="mb-2 font-medium text-foreground">Email Alerts</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Receive automated notifications when AQI reaches concerning levels
              </p>
              <Button size="sm" variant="outline">Set Up Alerts</Button>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-foreground">Air Quality Policy</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Download guidelines for creating school air quality response plans
              </p>
              <Button size="sm" variant="outline">Download PDF</Button>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-foreground">Educational Materials</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Access resources to teach students about air pollution and health
              </p>
              <Button size="sm" variant="outline">View Resources</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Schools;
