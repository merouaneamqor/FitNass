'use client';

import Link from 'next/link';
import Image from 'next/image';

// City data type
type City = {
  name: string;
  image: string;
};

type PopularCitiesSectionProps = {
  cities: City[];
};

export default function PopularCitiesSection({ cities }: PopularCitiesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Cities</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top fitness venues in Morocco's most popular cities
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cities.map((city) => (
            <Link href={`/search?city=${encodeURIComponent(city.name)}`} key={city.name} className="group">
              <div className="relative h-40 rounded-xl overflow-hidden">
                <Image 
                  src={city.image} 
                  alt={city.name}
                  width={300}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end group-hover:from-indigo-900/70 transition-colors">
                  <div className="p-4 w-full">
                    <h3 className="text-white text-lg font-medium text-center">{city.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 