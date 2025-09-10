import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PropertyCard from '../PropertyCard';

// Mock the carousel components to avoid JSDOM compatibility issues
jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselNext: () => <button>Next</button>,
  CarouselPrevious: () => <button>Previous</button>,
}));

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    title: 'Test Property',
    location: 'Test Location',
    price: 1000,
    priceType: 'night' as const,
    rating: 4.5,
    bedrooms: 2,
    bathrooms: 1,
    area: 800,
    images: ['image1.jpg', 'image2.jpg'],
    type: 'airbnb',
  };

  test('renders property details', () => {
    const { getByText } = render(<PropertyCard {...mockProperty} />);
    expect(getByText(/Test Property/i)).toBeInTheDocument();
    expect(getByText(/Test Location/i)).toBeInTheDocument();
  });

  test('displays price correctly', () => {
    const { getByText } = render(<PropertyCard {...mockProperty} />);
    expect(getByText(/KSh 1,000/i)).toBeInTheDocument();
    expect(getByText(/night/i)).toBeInTheDocument();
  });

  test('renders multiple images in carousel', () => {
    const { getAllByRole } = render(<PropertyCard {...mockProperty} />);
    const images = getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});
