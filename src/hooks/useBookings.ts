import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Booking {
  id: string;
  property_id: string;
  user_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (booking: {
      property_id: string;
      guest_name: string;
      guest_email: string;
      guest_phone: string;
      booking_date: string;
    }) => {
      if (!user) throw new Error("User must be authenticated");

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          ...booking,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};