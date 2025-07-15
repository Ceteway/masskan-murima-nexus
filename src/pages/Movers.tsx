import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Star, Shield, Clock, Phone, MapPin, Package, Sofa, Laptop, Car } from "lucide-react";

const Movers = () => {
  const movingServices = [
    {
      id: "1",
      name: "QuickMove Kenya",
      rating: 4.8,
      reviews: 156,
      location: "Nairobi, Kenya",
      services: ["Local Moving", "Long Distance", "Packing"],
      priceRange: "KSh 5,000 - 25,000",
      verified: true,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"
    },
    {
      id: "2",
      name: "Reliable Movers Ltd",
      rating: 4.9,
      reviews: 203,
      location: "Nairobi & Mombasa",
      services: ["International", "Storage", "Insurance"],
      priceRange: "KSh 8,000 - 50,000",
      verified: true,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop"
    },
    {
      id: "3",
      name: "Express Movers",
      rating: 4.7,
      reviews: 98,
      location: "Kisumu, Nakuru",
      services: ["Same Day", "Office Moving", "Fragile Items"],
      priceRange: "KSh 3,000 - 15,000",
      verified: true,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"
    }
  ];

  const marketplaceItems = [
    {
      id: "1",
      title: "Modern 3-Seater Sofa",
      price: 25000,
      condition: "Excellent",
      location: "Westlands, Nairobi",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
      category: "Furniture"
    },
    {
      id: "2",
      title: "Samsung 55\" Smart TV",
      price: 45000,
      condition: "Like New",
      location: "Karen, Nairobi",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop",
      category: "Electronics"
    },
    {
      id: "3",
      title: "MacBook Pro 2021",
      price: 120000,
      condition: "Good",
      location: "Kilimani, Nairobi",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop",
      category: "Electronics"
    },
    {
      id: "4",
      title: "Dining Table Set",
      price: 18000,
      condition: "Good",
      location: "Kileleshwa, Nairobi",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
      category: "Furniture"
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
              Moving Services & Marketplace
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find trusted moving services and buy/sell household items safely in our marketplace.
            </p>
          </div>

          {/* Service Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur rounded-full p-1 flex">
              <Button className="bg-white text-primary">Moving Services</Button>
              <Button variant="ghost" className="text-white">Marketplace</Button>
            </div>
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
                <Button className="bg-gradient-primary">
                  Get Quotes
                </Button>
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

      {/* Marketplace Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Household Items Marketplace</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Buy and sell furniture, electronics, and household items safely with verified users.
            </p>
          </div>

          {/* Categories */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Sofa className="h-4 w-4 mr-2" />
                Furniture
              </Button>
              <Button variant="outline" size="sm">
                <Laptop className="h-4 w-4 mr-2" />
                Electronics
              </Button>
              <Button variant="outline" size="sm">
                <Car className="h-4 w-4 mr-2" />
                Appliances
              </Button>
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Home & Garden
              </Button>
            </div>
          </div>

          {/* Marketplace Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {marketplaceItems.map((item) => (
              <Card key={item.id} className="hover:shadow-card transition-all duration-300">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 left-2 bg-white/90 text-foreground">
                    {item.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                  <div className="text-2xl font-bold text-primary mb-2">
                    KSh {item.price.toLocaleString()}
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                    <span>Condition: {item.condition}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.location}
                  </div>
                  <Button size="sm" className="w-full">
                    Contact Seller
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              View All Items
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Movers;