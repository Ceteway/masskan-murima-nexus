import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, MapPin, Building } from "lucide-react";

const Rentals = () => {
  // Mock data for rental properties
  const properties = [
    {
      id: "1",
      title: "Single Room in South B",
      location: "South B, Nairobi",
      price: 15000,
      priceType: "month" as const,
      rating: 4.2,
      reviews: 18,
      bedrooms: 1,
      bathrooms: 1,
      area: 200,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      type: "rental" as const
    },
    {
      id: "2",
      title: "Cozy Bedsitter in Kasarani",
      location: "Kasarani, Nairobi",
      price: 25000,
      priceType: "month" as const,
      rating: 4.3,
      reviews: 22,
      bedrooms: 1,
      bathrooms: 1,
      area: 350,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      type: "rental" as const
    },
    {
      id: "3",
      title: "Modern 1BR Apartment in Kileleshwa",
      location: "Kileleshwa, Nairobi",
      price: 45000,
      priceType: "month" as const,
      rating: 4.6,
      reviews: 31,
      bedrooms: 1,
      bathrooms: 1,
      area: 500,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
      type: "rental" as const,
      featured: true
    },
    {
      id: "4",
      title: "Spacious 2BR in Westlands",
      location: "Westlands, Nairobi",
      price: 65000,
      priceType: "month" as const,
      rating: 4.7,
      reviews: 28,
      bedrooms: 2,
      bathrooms: 2,
      area: 800,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
      type: "rental" as const
    },
    {
      id: "5",
      title: "Beautiful 3BR Apartment in Kilimani",
      location: "Kilimani, Nairobi",
      price: 95000,
      priceType: "month" as const,
      rating: 4.8,
      reviews: 24,
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=300&fit=crop",
      type: "rental" as const
    },
    {
      id: "6",
      title: "Luxury 4BR Family Home in Karen",
      location: "Karen, Nairobi",
      price: 180000,
      priceType: "month" as const,
      rating: 4.9,
      reviews: 15,
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
      type: "rental" as const,
      featured: true
    },
    {
      id: "7",
      title: "Executive 5BR Villa in Runda",
      location: "Runda, Nairobi",
      price: 320000,
      priceType: "month" as const,
      rating: 4.9,
      reviews: 12,
      bedrooms: 5,
      bathrooms: 4,
      area: 3500,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
      type: "rental" as const
    },
    {
      id: "8",
      title: "Premium 6BR Mansion in Muthaiga",
      location: "Muthaiga, Nairobi",
      price: 450000,
      priceType: "month" as const,
      rating: 5.0,
      reviews: 8,
      bedrooms: 6,
      bathrooms: 5,
      area: 5000,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
      type: "rental" as const
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
              Find Your Perfect Rental Home
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover long-term rental properties with detailed information, virtual tours, and verified landlords.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Location" className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <Building className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
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
              <p className="text-muted-foreground">Found {properties.length} properties</p>
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
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Properties
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rentals;