import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useMovingServices } from "@/hooks/useMovingServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Shield, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const Movers = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  
  useEffect(() => {
    document.title = "Moving Services | Masskan Murima";
  }, []);

  const { data: movingServices, isLoading, error, refetch } = useMovingServices({
    location: selectedLocation
  });

  if (isLoading) return <LoadingSpinner className="py-20" />;
  if (error) return <ErrorMessage onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(var(--primary) / 0.65), hsl(var(--secondary) / 0.55)), url(https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1600&auto=format&fit=crop)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Moving Services</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find trusted movers, compare quotes, and book with confidence.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="From Location" className="pl-10" />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="To Location" className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Moving</SelectItem>
                    <SelectItem value="long-distance">Long Distance</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                    <SelectItem value="office">Office Moving</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-primary">Get Quotes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Moving Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted Moving Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {movingServices.map((service) => (
              <Card key={service.id} className="hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {service.name}
                        {service.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium">{service.rating}</span>
                        </div>
                        <span className="text-muted-foreground">({service.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {service.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-2">Services:</div>
                      <div className="flex flex-wrap gap-1">
                        {service.services.map((s, i) => (
                          <Badge key={i} variant="outline">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Price Range: </span>
                      <span className="text-primary">{service.priceRange}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Movers;