import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiStar, FiPhone, FiGlobe, FiMail, FiArrowLeft } from 'react-icons/fi';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { PlaceType } from '@/types/place';
import SafeImage from '@/components/ui/SafeImage';

// --- Fetch Function (Server-Side) ---
async function getPlaceData(citySlug: string, placeId: string) {
  try {
    // First try to find by ID
    const place = await prisma.place.findUnique({
      where: { 
        id: placeId
      },
      include: {
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: { name: true, image: true }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: { reviews: true }
        }
      }
    });

    if (!place) {
      notFound();
    }

    // Verify that the citySlug matches
    const placeCitySlug = place.city?.toLowerCase().replace(/\s+/g, '-');
    if (placeCitySlug && placeCitySlug !== citySlug) {
      // In a real implementation, you'd use redirect() here
      // But for simplicity we'll just return the place data
      return place;
    }

    // Update view count (fire and forget)
    prisma.place.update({
      where: { id: placeId },
      data: { viewCount: { increment: 1 } }
    }).catch(error => {
      console.error("Failed to update view count:", error);
    });

    return place;
  } catch (error) {
    console.error("Failed to fetch place data:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
       notFound();
    }
    throw new Error('Failed to load place details. Please try again later.');
  }
}

// --- Main Page Component (Server Component) ---
export default async function PlaceDetailsPage({ params }: { params: { citySlug: string; placeId: string } }) {
  const { citySlug, placeId } = params;
  const place = await getPlaceData(citySlug, placeId);

  // Get the Place type label (e.g., GYM, CLUB, etc.)
  const getPlaceTypeLabel = (type: string): string => {
    switch (type) {
      case 'GYM': return 'Gym';
      case 'CLUB': return 'Club';
      case 'STUDIO': return 'Studio';
      case 'CENTER': return 'Center';
      default: return 'Facility';
    }
  };

  // Default image in case none are provided
  const displayImage = Array.isArray(place.images) && place.images.length > 0 
    ? place.images[0] 
    : '/images/logo.svg';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="mb-4 flex justify-between items-center">
          <Link href="/places" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium group">
            <FiArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Places
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
              {getPlaceTypeLabel(place.type as string)}
            </span>
            {place.status === 'ACTIVE' && (
              <span className="text-sm px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                Active
              </span>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            {place.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            {place.rating !== null && (
              <div className="flex items-center">
                <FiStar className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">{place.rating.toFixed(1)}</span>
                <span className="ml-1.5">({place._count?.reviews || 0} reviews)</span>
              </div>
            )}
            <div className="flex items-center">
              <FiMapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{place.address}, {place.city}{place.state ? `, ${place.state}` : ''}</span>
            </div>
          </div>
        </div>

        {/* Main image */}
        <div className="relative w-full h-80 sm:h-96 overflow-hidden rounded-xl mb-8 bg-gray-200 dark:bg-gray-800">
          <SafeImage
            src={displayImage}
            alt={place.name}
            fill
            priority
            className="object-cover"
            fallbackType="place"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section id="description">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {place.description || 'No description provided.'}
              </p>
            </section>

            {place.facilities && place.facilities.length > 0 && (
              <section id="facilities" className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {place.facilities.map((facility, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {place._count?.reviews > 0 && (
              <section id="reviews" className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {place.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden mr-3">
                          {review.user?.image ? (
                            <SafeImage 
                              src={review.user.image} 
                              alt={review.user.name || "User"} 
                              width={32} 
                              height={32} 
                              className="object-cover" 
                              fallbackType="fitnass"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              {review.user?.name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{review.user?.name || "Anonymous"}</p>
                          <div className="flex items-center">
                            <FiStar className="h-3.5 w-3.5 text-yellow-500 fill-current mr-1" />
                            <span className="text-sm">{review.rating}</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-3">
                {place.phone && (
                  <div className="flex items-center">
                    <FiPhone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <a href={`tel:${place.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {place.phone}
                    </a>
                  </div>
                )}
                {place.email && (
                  <div className="flex items-center">
                    <FiMail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <a href={`mailto:${place.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {place.email}
                    </a>
                  </div>
                )}
                {place.website && (
                  <div className="flex items-center">
                    <FiGlobe className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Website
                    </a>
                  </div>
                )}
              </div>

              {(place.latitude && place.longitude) && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Location</h3>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Map preview unavailable
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {place.address}, {place.city}{place.state ? `, ${place.state}` : ''}
                    {place.zipCode ? ` ${place.zipCode}` : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 