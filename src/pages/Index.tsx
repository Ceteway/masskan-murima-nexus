import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import SearchBar from '@/components/SearchBar';
import { useSearchProperties } from '@/hooks/useSearch';
import { useState } from 'react';

const Index = () => {
  const [searchFilters, setSearchFilters] = useState({});
  const { data: searchResults } = useSearchProperties(searchFilters);

  const handleSearch = (filters: any) => {
    setSearchFilters({
      location: filters.location || undefined,
      type: filters.type || undefined,
      checkIn: filters.checkIn || undefined,
      checkOut: filters.checkOut || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero>
        <SearchBar onSearch={handleSearch} />
      </Hero>
      <Features />
      <FeaturedProperties searchResults={searchResults} />
      <Footer />
    </div>
  );
};

export default Index;
