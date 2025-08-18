import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useCreateBooking } from "@/hooks/useBookings";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: string;
}

const BookingModal = ({ isOpen, onClose, propertyTitle, propertyId }: BookingModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const { user } = useAuth();
  const createBooking = useCreateBooking();

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please log in to book a property");
      onClose();
      return;
    }

    if (!name || !email || !phone || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createBooking.mutateAsync({
        property_id: propertyId,
        guest_name: name,
        guest_email: email,
        guest_phone: phone,
        booking_date: date,
      });
      toast.success("Booking request submitted successfully!");
      onClose();
      setName("");
      setEmail("");
      setPhone("");
      setDate("");
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
    }
  };

  if (!user) {
    return null; // Don't show modal if not authenticated
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {propertyTitle}</DialogTitle>
          <DialogDescription>
            Please fill in your details to book this property.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Booking Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleBooking}>Book Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
