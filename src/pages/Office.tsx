import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building2, Search } from "lucide-react";
import { useEffect } from "react";

const Office = () => {
  useEffect(() => {
    document.title = "Office Spaces | Masskan Murima";
  }, []);

  const offices = [
    {
      id: "o1",
      title: "Modern Co-working Space",
      location: "Westlands, Nairobi",
      price: 40000,
      priceType: "month" as const,
      rating: 4.6,
      reviews: 21,
      bedrooms: 0,
      bathrooms: 2,
      area: 600,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      type: "rental" as const
    },
    {
      id: "o2",
      title: "Grade A Office Floor",
      location: "Upper Hill, Nairobi",
      price: 250000,
      priceType: "month" as const,
      rating: 4.8,
      reviews: 14,
      bedrooms: 0,
      bathrooms: 4,
      area: 2500,
      image: "https://images.unsplash.com/photo-1507209696998-3c532be9b2b4?w=800&h=600&fit=crop",
      type: "rental" as const,
      featured: true
    },
    {
      id: "o3",
      title: "Private Office Suite",
      location: "Kilimani, Nairobi",
      price: 120000,
      priceType: "month" as const,
      rating: 4.7,
      reviews: 9,
      bedrooms: 0,
      bathrooms: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
      type: "rental" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(var(--primary) / 0.7), hsl(var(--secondary) / 0.6)), url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Office Spaces for Rent</h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              Flexible offices, co-working, and corporate floors in prime locations.
            </p>
          </div>

          {/* Search */}
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Location" className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Office Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cowork">Co-working</SelectItem>
                    <SelectItem value="private">Private Office</SelectItem>
                    <SelectItem value="floor">Whole Floor</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50000">KSh 0 - 50,000</SelectItem>
                    <SelectItem value="50000-150000">KSh 50,000 - 150,000</SelectItem>
                    <SelectItem value="150000+">KSh 150,000+</SelectItem>
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

      {/* Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Available Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((o) => (
              <PropertyCard key={o.id} {...o} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Office;
