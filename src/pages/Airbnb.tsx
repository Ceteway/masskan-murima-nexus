import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Users, MapPin } from "lucide-react";

const Airbnb = () => {
  // Mock data for Airbnb properties
  const properties = [
    {
      id: "1",
      title: "Cozy Studio Near City Center",
      location: "Westlands, Nairobi",
      price: 120,
      priceType: "night" as const,
      rating: 4.9,
      reviews: 42,
      bedrooms: 1,
      bathrooms: 1,
      area: 450,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
      type: "airbnb" as const
    },
    {
      id: "2",
      title: "Luxury Penthouse Suite",
      location: "Kilimani, Nairobi",
      price: 250,
      priceType: "night" as const,
      rating: 5.0,
      reviews: 31,
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=300&fit=crop",
      type: "airbnb" as const,
      featured: true
    },
    {
      id: "3",
      title: "Modern Apartment with Pool",
      location: "Kileleshwa, Nairobi",
      price: 180,
      priceType: "night" as const,
      rating: 4.8,
      reviews: 28,
      bedrooms: 2,
      bathrooms: 2,
      area: 1000,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
      type: "airbnb" as const
    },
    {
      id: "4",
      title: "Charming Garden Villa",
      location: "Karen, Nairobi",
      price: 300,
      priceType: "night" as const,
      rating: 4.7,
      reviews: 19,
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
      type: "airbnb" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book Amazing Short-Term Stays
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find unique accommodations for your next trip with instant booking and verified hosts.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="max-w-5xl mx-auto bg-white/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Where are you going?" className="pl-10" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" placeholder="Check-in" className="pl-10" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" placeholder="Check-out" className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="5+">5+ Guests</SelectItem>
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

      {/* Quick Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" size="sm">Entire Place</Button>
            <Button variant="outline" size="sm">Private Room</Button>
            <Button variant="outline" size="sm">Shared Room</Button>
            <Button variant="outline" size="sm">Instant Book</Button>
            <Button variant="outline" size="sm">Pet Friendly</Button>
            <Button variant="outline" size="sm">WiFi</Button>
            <Button variant="outline" size="sm">Pool</Button>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Available Stays</h2>
              <p className="text-muted-foreground">Over {properties.length} places to stay</p>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Show More Stays
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Airbnb;