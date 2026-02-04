'use client';

import { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import AddTestimonialModal from './AddTestimonialModal';
import { Button } from '@/components/ui/button';
import apiClient from '@/services/api-client';
import { Plus } from 'lucide-react';

export default function TestimonialGrid() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  interface Testimonial {
    id: string;
    name: string;
    email: string;
    rating: number;
    message: string;
  }

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Load testimonials from backend
    const loadTestimonials = async () => {
      try {
        // Fetch all testimonials from backend API
        const data = await apiClient.get<Testimonial[]>('/api/testimonials');
        setTestimonials(data);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        // Set empty array on error
        setTestimonials([]);
      }
    };

    loadTestimonials();
  }, []);

  const handleAddTestimonial = (testimonial: Testimonial) => {
    setTestimonials([testimonial, ...testimonials]);
  };

  return (
    <div id='testimonials' className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from people who have transformed their productivity with our app
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus /> Feedback
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              email={testimonial.email}
              rating={testimonial.rating}
              message={testimonial.message}
            />
          ))}
        </div>

        <AddTestimonialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTestimonial={handleAddTestimonial}
        />
      </div>
    </div>
  );
}