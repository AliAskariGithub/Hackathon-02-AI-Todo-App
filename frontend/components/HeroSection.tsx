import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Boost Your Productivity
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Manage your tasks efficiently with our intuitive todo application.
          Stay organized and accomplish more every day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="px-8 py-3 text-lg">
              Get Started Free
            </Button>
          </Link>
          <Link href="/#features">
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}