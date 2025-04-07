
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  return (
    <section className="relative bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=2940')] bg-cover bg-center opacity-20"></div>
      <div className="container py-24 md:py-32 relative z-10">
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
            NEW SEASON ARRIVALS
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Discover Your <span className="text-pink-300">Perfect Style</span>
          </h1>
          <p className="text-lg mb-8 text-white/80">
            Explore our curated collection of premium products at unbeatable prices.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="font-medium bg-white text-indigo-900 hover:bg-white/90">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="font-medium border-white text-white hover:bg-white/20">
              <Link to="/categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
