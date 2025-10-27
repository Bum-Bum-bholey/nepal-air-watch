import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Heart, Target, Users, Database, TrendingUp, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">NEPOL</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Empowering Nepali citizens with real-time air quality intelligence to breathe smarter and live healthier
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8">
          <div className="flex items-start space-x-4">
            <div className="rounded-xl bg-primary p-3">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="text-muted-foreground">
                NEPOL (Nepal Pollution) bridges the gap between complex environmental data and actionable public health insights. We provide real-time, hyperlocal air quality monitoring and 48-hour predictive analytics to help citizens, schools, and policymakers make informed decisions about outdoor activities and health protection.
              </p>
            </div>
          </div>
        </Card>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-3xl font-bold text-foreground">What We Offer</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Database,
                title: "Real-Time Monitoring",
                description: "Live AQI data from reliable sources including OpenAQ and OpenWeather, updated continuously",
              },
              {
                icon: TrendingUp,
                title: "Predictive Analytics",
                description: "48-hour pollution forecasts powered by machine learning models considering weather patterns",
              },
              {
                icon: Shield,
                title: "Health Alerts",
                description: "Location-based health advisories with actionable recommendations for different AQI levels",
              },
              {
                icon: Users,
                title: "School Safety Mode",
                description: "Dedicated dashboard for educational institutions with outdoor activity recommendations",
              },
              {
                icon: Target,
                title: "Hyperlocal Data",
                description: "City-level air quality monitoring across major urban centers in Nepal",
              },
              {
                icon: Heart,
                title: "Public Health Focus",
                description: "Evidence-based guidelines to help citizens protect their respiratory health",
              },
            ].map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <Card className="mb-8 p-8">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Data Sources & Methodology</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Air Quality Data</h3>
              <p className="text-sm text-muted-foreground">
                We aggregate real-time air quality measurements from OpenAQ, a global open-source platform for air quality data. Our system normalizes PM2.5, PM10, and other pollutant concentrations into the standard AQI scale.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Weather Integration</h3>
              <p className="text-sm text-muted-foreground">
                Weather data from OpenWeather API helps contextualize pollution patterns. Temperature, humidity, wind speed, and atmospheric pressure all influence air quality dynamics.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Machine Learning Forecasts</h3>
              <p className="text-sm text-muted-foreground">
                Our predictive models use historical pollution data, weather patterns, and time-series analysis to generate 24-48 hour forecasts. Models are continuously refined for accuracy.
              </p>
            </div>
          </div>
        </Card>

        {/* AQI Scale Reference */}
        <Card className="mb-8 p-8">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Understanding the AQI Scale</h2>
          <div className="space-y-4">
            {[
              { range: "0-50", level: "Good", color: "bg-green-500", desc: "Air quality is satisfactory, and air pollution poses little or no risk." },
              { range: "51-100", level: "Moderate", color: "bg-yellow-500", desc: "Air quality is acceptable. However, sensitive individuals should consider limiting prolonged outdoor exertion." },
              { range: "101-150", level: "Unhealthy for Sensitive Groups", color: "bg-orange-500", desc: "Members of sensitive groups may experience health effects. The general public is less likely to be affected." },
              { range: "151-200", level: "Unhealthy", color: "bg-red-500", desc: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects." },
              { range: "201-300", level: "Very Unhealthy", color: "bg-purple-500", desc: "Health alert: everyone may experience more serious health effects." },
              { range: "301+", level: "Hazardous", color: "bg-red-900", desc: "Health warning of emergency conditions. The entire population is more likely to be affected." },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4 rounded-lg border border-border/50 p-4">
                <div className={`mt-1 h-16 w-16 flex-shrink-0 rounded-lg ${item.color}`} />
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold text-foreground">{item.level}</span>
                    <span className="text-sm text-muted-foreground">AQI {item.range}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Join the Movement</h2>
          <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
            NEPOL is committed to transparency, data accessibility, and public health. Help us improve by sharing feedback, reporting data issues, or contributing to our open-source initiatives.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:contact@nepol.app" className="text-primary hover:underline">
              contact@nepol.app
            </a>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Open Source • Community Driven • Public Health First</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
