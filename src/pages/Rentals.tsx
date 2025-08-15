import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRentalProperties } from "@/hooks/useProperties";
import { Search, Filter, SlidersHorizontal, MapPin, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { allCounties, townsForCounty } from "@/data/locations";

const Rentals = () => {
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedTown, setSelectedTown] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");

  useEffect(() => {
    document.title = "Rentals | Masskan Murima";
  }, []);

  // Build filters based on user input
  const filters = {
    type: "Rental",
    location: searchLocation || selectedTown || selectedCounty,
    minPrice: priceRange === "0-50000" ? 0 : priceRange === "50001-100000" ? 50001 : priceRange === "100001-200000" ? 100001 : undefined,
    maxPrice: priceRange === "0-50000" ? 50000 : priceRange === "50001-100000" ? 100000 : priceRange === "100001-200000" ? 200000 : undefined,
  };

  const { data: properties, isLoading, error, refetch } = useRentalProperties();

  const towns = townsForCounty(selectedCounty);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <LoadingSpinner className="py-20" />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <ErrorMessage 
            message="Failed to load rental properties. Please try again." 
            onRetry={() => refetch()}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(var(--primary) / 0.75), hsl(var(--secondary) / 0.65)), url(https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1600&auto=format&fit=crop)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Find Your Perfect Rental Home
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-in">
              Discover long-term rental properties with detailed information, virtual tours, and verified landlords.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="max-w-5xl mx-auto bg-white/95 backdrop-blur animate-slide-up">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* County */}
                <Select value={selectedCounty} onValueChange={(v) => { setSelectedCounty(v); setSelectedTown(""); }}>
                  <SelectTrigger>
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="County" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCounties.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Town */}
                <Select value={selectedTown} onValueChange={setSelectedTown}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCounty ? "Town" : "Select county first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {towns.map((t) => (
                      <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Property Type */}
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <Building className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Room</SelectItem>
                    <SelectItem value="bedsitter">Bedsitter</SelectItem>
                    <SelectItem value="1br">1 Bedroom</SelectItem>
                    <SelectItem value="2br">2 Bedroom</SelectItem>
                    <SelectItem value="3br">3 Bedroom</SelectItem>
                    <SelectItem value="4br">4+ Bedroom</SelectItem>
                  </SelectContent>
                </Select>

                {/* Price Range */}
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50000">KSh 0 - 50,000</SelectItem>
                    <SelectItem value="50000-100000">KSh 50,000 - 100,000</SelectItem>
                    <SelectItem value="100000-200000">KSh 100,000 - 200,000</SelectItem>
                    <SelectItem value="200000+">KSh 200,000+</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-gradient-primary">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters and Results */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Available Properties</h2>
              <p className="text-muted-foreground">
                Found {properties?.length || 0} properties
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties && properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No rental properties available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search filters.</p>
              </div>
            )}
          </div>

          {/* Load More */}
          {properties && properties.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Properties
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rentals;