import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedProperties = () => {
  // Mock data for featured properties
  const properties = [
    {
      id: "1",
      title: "Modern 3BR Apartment in Kileleshwa",
      location: "Kileleshwa, Nairobi",
      price: 85000,
      priceType: "month" as const,
      rating: 4.8,
      reviews: 24,
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
      type: "rental" as const,
      featured: true
    },
    {
      id: "2",
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
      id: "3",
      title: "Spacious Family Home",
      location: "Karen, Nairobi",
      price: 150000,
      priceType: "month" as const,
      rating: 4.7,
      reviews: 18,
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
      type: "rental" as const
    },
    {
      id: "4",
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
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover our handpicked selection of premium properties and stays.
            </p>
          </div>
          <Button variant="outline" size="lg" className="mt-4 md:mt-0">
            View All Properties
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-gradient-card rounded-2xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Properties Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2000+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">150+</div>
            <div className="text-muted-foreground">Verified Hosts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;