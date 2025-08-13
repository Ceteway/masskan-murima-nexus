import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Sofa, Laptop, Car, Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

const Marketplace = () => {
  useEffect(() => {
    document.title = "Marketplace | Masskan Murima";
  }, []);

  const marketplaceItems = [
    {
      id: "1",
      title: "Modern 3-Seater Sofa",
      price: 25000,
      condition: "Excellent",
      location: "Westlands, Nairobi",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      category: "Furniture",
    },
    {
      id: "2",
      title: "Samsung 55\" Smart TV",
      price: 45000,
      condition: "Like New",
      location: "Karen, Nairobi",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
      category: "Electronics",
    },
    {
      id: "3",
      title: "MacBook Pro 2021",
      price: 120000,
      condition: "Good",
      location: "Kilimani, Nairobi",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
      category: "Electronics",
    },
    {
      id: "4",
      title: "Dining Table Set",
      price: 18000,
      condition: "Good",
      location: "Kileleshwa, Nairobi",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      category: "Furniture",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(var(--primary) / 0.75), hsl(var(--secondary) / 0.65)), url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&auto=format&fit=crop)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Household Items Marketplace</h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              Buy and sell furniture, electronics, and more with verified users.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="max-w-5xl mx-auto bg-white/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search items (e.g., Sofa, TV)" className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nairobi">Nairobi</SelectItem>
                    <SelectItem value="mombasa">Mombasa</SelectItem>
                    <SelectItem value="kisumu">Kisumu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Sofa className="h-4 w-4 mr-2" /> Furniture
            </Button>
            <Button variant="outline" size="sm">
              <Laptop className="h-4 w-4 mr-2" /> Electronics
            </Button>
            <Button variant="outline" size="sm">
              <Car className="h-4 w-4 mr-2" /> Appliances
            </Button>
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" /> Home & Garden
            </Button>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-12 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {marketplaceItems.map((item) => (
              <Card key={item.id} className="hover:shadow-card transition-all duration-300">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    loading="lazy"
                  />
                  <Badge className="absolute top-2 left-2 bg-white/90 text-foreground">
                    {item.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                  <div className="text-2xl font-bold text-primary mb-2">KSh {item.price.toLocaleString()}</div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                    <span>Condition: {item.condition}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.location}
                  </div>
                  <Button size="sm" className="w-full">Contact Seller</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg">View All Items</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;
