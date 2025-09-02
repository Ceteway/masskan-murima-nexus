import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SearchFilters {
  location?: string;
  type?: string;
  checkIn?: Date;
  checkOut?: Date;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export const useSearchProperties = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ["search_properties", filters],
    queryFn: async () => {
      // First, get all properties matching the basic filters
      let query = supabase
        .from("properties")
        .select("*");

      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters.type) {
        query = query.eq("type", filters.type);
      }

      if (filters.priceMin) {
        query = query.gte("price", filters.priceMin);
      }

      if (filters.priceMax) {
        query = query.lte("price", filters.priceMax);
      }

      if (filters.bedrooms) {
        query = query.gte("bedrooms", filters.bedrooms);
      }

      if (filters.bathrooms) {
        query = query.gte("bathrooms", filters.bathrooms);
      }

      const { data: properties, error: propertiesError } = await query.order("created_at", { ascending: false });

      if (propertiesError) throw propertiesError;

      // If no date filters, return all matching properties
      if (!filters.checkIn || !filters.checkOut) {
        return properties;
      }

      // Filter out properties that are already booked for the selected dates
      const checkInDate = filters.checkIn.toISOString().split('T')[0];
      const checkOutDate = filters.checkOut.toISOString().split('T')[0];

      const availableProperties = [];

      for (const property of properties) {
        // Check if property has any conflicting bookings
        const { data: bookings, error: bookingsError } = await supabase
          .from("bookings")
          .select("booking_date")
          .eq("property_id", property.id)
          .eq("status", "confirmed")
          .gte("booking_date", checkInDate)
          .lt("booking_date", checkOutDate);

        if (bookingsError) {
          console.error("Error checking bookings:", bookingsError);
          continue;
        }

        // If no conflicting bookings, property is available
        if (!bookings || bookings.length === 0) {
          availableProperties.push(property);
        }
      }

      return availableProperties;
    },
    enabled: Object.keys(filters).length > 0,
  });
};

export const useSearchMarketplace = (query: string, category?: string) => {
  return useQuery({
    queryKey: ["search_marketplace", query, category],
    queryFn: async () => {
      let dbQuery = supabase
        .from("marketplace_items")
        .select("*");

      if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
      }

      if (category) {
        dbQuery = dbQuery.eq("category", category);
      }

      const { data, error } = await dbQuery.order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!query || !!category,
  });
};
