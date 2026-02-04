'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { useSession } from '@/lib/auth';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
}

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTestimonial: (testimonial: Testimonial) => void;
}

export default function AddTestimonialModal({ isOpen, onClose, onAddTestimonial }: AddTestimonialModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('5');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!session) {
      alert('Please log in to submit a testimonial.');
      // Redirect to login page using router
      router.push('/login');
      return;
    }

    try {
      // Validate the input before sending
      if (!message || message.trim().length < 10) {
        alert('Message must be at least 10 characters long.');
        return;
      }

      if (!parseInt(rating) || parseInt(rating) < 1 || parseInt(rating) > 5) {
        alert('Please select a valid rating (1-5 stars).');
        return;
      }

      // Prepare testimonial data for the backend
      // The backend will associate the testimonial with the user from the JWT token
      const testimonialData = {
        name: session.user.name || session.user.email?.split('@')[0] || 'User', // Use logged-in user's name
        email: session.user.email || 'user@example.com', // Use logged-in user's email (ensure it's valid)
        rating: parseInt(rating), // Ensure it's an integer
        message: message.trim() // Ensure no leading/trailing whitespace
      };

      // Submit to backend API
      const token = session.session?.token;
      if (token) {
        const createdTestimonial = await apiClient.post('/api/testimonials', testimonialData, token);

        // Add to local state with the server-generated data
        onAddTestimonial(createdTestimonial as Testimonial);
      }

      handleClose();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      // Extract more specific error message if available
      if (error instanceof Error) {
        alert(`Error submitting testimonial: ${error.message}. Please check your input and try again.`);
      } else {
        alert('Error submitting testimonial. Please check your input and try again.');
      }
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setRating('5');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Your Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {session ? (
            // If user is logged in, don't show name/email fields as they're auto-populated
            <div className="text-center text-sm text-gray-600 mb-2">
              Submitting as: {session.user.name} ({session.user.email})
            </div>
          ) : (
            // If user is not logged in, show name and email fields
            <>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!session}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={!session}
                />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!session}>
              {session ? 'Submit Testimonial' : 'Log In to Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}