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
    <section className="py-16 md:py-24 bg-jet-black text-white border-t border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase tracking-wider mb-4">
            Explore Top Fitness Cities
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            Find elite gyms and clubs in Morocco's major hubs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 justify-center">
          {cities.map((city) => (
            <Link
              href={`/search?city=${encodeURIComponent(city.name)}`}
              key={city.name}
              className="group relative aspect-[5/4] rounded-md overflow-hidden shadow-md border border-neutral-800 hover:border-blood-red transition-all duration-300"
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out opacity-70 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <h3 className="text-white text-2xl md:text-3xl font-bebas uppercase tracking-wide text-center drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  {city.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 