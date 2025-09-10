import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingModal from '../BookingModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateBooking } from '@/hooks/useBookings';
import { toast } from 'sonner';
import '@testing-library/jest-dom';

jest.mock('@/contexts/AuthContext');
jest.mock('@/hooks/useBookings');
jest.mock('sonner');

describe('BookingModal', () => {
  const mockOnClose = jest.fn();
  const mockPropertyTitle = 'Test Property';
  const mockPropertyId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when open and user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    (useCreateBooking as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });

    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        propertyTitle={mockPropertyTitle}
        propertyId={mockPropertyId}
      />
    );

    expect(screen.getByText(`Book ${mockPropertyTitle}`)).toBeInTheDocument();
  });

  test('does not render modal if user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    (useCreateBooking as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });

    const { container } = render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        propertyTitle={mockPropertyTitle}
        propertyId={mockPropertyId}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('shows error if required fields are missing', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    const mockMutateAsync = jest.fn();
    const mockToastError = jest.fn();
    (useCreateBooking as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
    (toast.error as jest.Mock).mockImplementation(mockToastError);

    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        propertyTitle={mockPropertyTitle}
        propertyId={mockPropertyId}
      />
    );

    fireEvent.click(screen.getByText('Book Now'));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Please fill in all fields');
    });
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  test('calls createBooking on valid form submission', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    const mockMutateAsync = jest.fn().mockResolvedValue({});
    (useCreateBooking as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(
      <BookingModal
        isOpen={true}
        onClose={mockOnClose}
        propertyTitle={mockPropertyTitle}
        propertyId={mockPropertyId}
      />
    );

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Check-in Date/i), { target: { value: '2099-01-01' } });
    fireEvent.change(screen.getByLabelText(/Check-out Date/i), { target: { value: '2099-01-05' } });

    fireEvent.click(screen.getByText('Book Now'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
