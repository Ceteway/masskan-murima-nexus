import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Home, Calendar } from "lucide-react";

const Hero = ({ children }: { children?: React.ReactNode }) => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-properties.jpg"
          alt="Beautiful properties in Masskan Murima"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div> {/* Darker overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-secondary to-orange-300 bg-clip-text text-transparent">
              Home & Services
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Discover amazing properties, book short-term stays, find reliable movers, and explore our marketplace - all in one platform.
          </p>

          {/* Search Form */}
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location..."
                    className="pl-10 bg-white/90 border-white/30 focus:border-primary text-black rounded-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Property Type</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rental, Airbnb..."
                    className="pl-10 bg-white/90 border-white/30 focus:border-primary text-black rounded-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="pl-10 bg-white/90 border-white/30 focus:border-primary text-black rounded-full"
                  />
                </div>
              </div>
              
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold h-12 rounded-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
