import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { locationData } from '@/data/locations';

interface UniversalSearchBarProps {
  className?: string;
}

const UniversalSearchBar = ({ className = "" }: UniversalSearchBarProps) => {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Navigate to appropriate page based on category with search params
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (searchTerm) params.append('search', searchTerm);

    let targetPath = '/';
    
    switch (category) {
      case 'rentals':
        targetPath = `/rentals?${params.toString()}`;
        break;
      case 'airbnb':
        targetPath = `/airbnb?${params.toString()}`;
        break;
      case 'office':
        targetPath = `/office?${params.toString()}`;
        break;
      case 'movers':
        targetPath = `/movers?${params.toString()}`;
        break;
      case 'marketplace':
        targetPath = `/marketplace?${params.toString()}`;
        break;
      default:
        // If no category selected, use general search on homepage
        targetPath = `/?${params.toString()}`;
    }

    navigate(targetPath);
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/20 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="pl-10 bg-white/20 border-white/30 text-white">
              <SelectValue placeholder="Where?" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(locationData).flat().map((town) => (
                <SelectItem key={town.name} value={town.name}>
                  {town.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-white/20 border-white/30 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rentals">Rentals</SelectItem>
            <SelectItem value="airbnb">Airbnb</SelectItem>
            <SelectItem value="office">Office Space</SelectItem>
            <SelectItem value="movers">Movers</SelectItem>
            <SelectItem value="marketplace">Marketplace</SelectItem>
          </SelectContent>
        </Select>

        <div className="md:col-span-2">
          <Input
            placeholder="Search for anything..."
            className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleSearch}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default UniversalSearchBar;