import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';

// Fetch the gym data by city and gym slugs
async function getGymData(citySlug: string, gymSlug: string) {
  try {
    // First try to find by slugs
    const gym = await prisma.gym.findFirst({
      where: { 
        citySlug,
        slug: gymSlug
      },
      select: {
        id: true,
        name: true,
        city: true,
        slug: true,
        citySlug: true,
      }
    });

    // If not found by slugs, try to find by ID (for backward compatibility)
    if (!gym) {
      const gymById = await prisma.gym.findUnique({
        where: { id: gymSlug },
        select: {
          id: true,
          name: true,
          city: true,
          slug: true,
          citySlug: true,
        }
      });
      
      if (gymById) return gymById;
    }

    if (!gym) {
      notFound();
    }

    return gym;
  } catch (error) {
    console.error("Failed to fetch gym data:", error);
    throw new Error('Failed to load gym details. Please try again later.');
  }
}

export default async function GymBookingPage({ params }: { params: { citySlug: string; gymSlug: string } }) {
  const { citySlug, gymSlug } = params;
  const gym = await getGymData(citySlug, gymSlug);

  return (
    <div className="min-h-screen bg-jet-black text-neutral-200 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="mb-4 flex justify-between items-center">
          <Link 
            href={`/gyms/${gym.citySlug || citySlug}/${gym.slug || gymSlug}`} 
            className="inline-flex items-center text-neutral-400 hover:text-neon-yellow transition-colors text-sm font-medium group"
          >
            <FiArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to {gym.name}
          </Link>
        </div>

        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bebas text-white uppercase tracking-wider mb-2">
            Book a Session at {gym.name}
          </h1>
          <p className="text-neutral-400">
            Select your preferred time and workout options
          </p>
        </div>

        <div className="bg-gunmetal-gray rounded-xl shadow-lg p-6 md:p-8 border border-neutral-700/60">
          <p className="text-neutral-300 text-center text-lg">
            Booking functionality coming soon!
          </p>
          <div className="mt-6 text-center">
            <Link
              href={`/gyms/${gym.citySlug || citySlug}/${gym.slug || gymSlug}`}
              className="inline-block bg-neon-yellow text-black px-6 py-3 rounded-md font-bold uppercase tracking-wider text-sm hover:bg-yellow-400 transition-colors shadow-lg"
            >
              Return to Gym Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 