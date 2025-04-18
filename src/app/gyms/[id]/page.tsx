import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiStar, FiPhone, FiGlobe, FiMail, FiArrowLeft, FiHeart } from 'react-icons/fi';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { toggleFavoriteGym } from '../actions';

// --- Fetch Function (Server-Side) ---
async function getGymData(id: string) {
  try {
    const gym = await prisma.gym.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        phone: true,
        website: true,
        email: true,
        rating: true,
        priceRange: true,
        facilities: true,
        images: true,
        latitude: true,
        longitude: true,
        owner: {
          select: { name: true }
        },
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

    if (!gym) {
      notFound();
    }

    return {
      ...gym,
      images: Array.isArray(gym.images) && gym.images.length > 0 ? gym.images : ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
      facilities: Array.isArray(gym.facilities) ? gym.facilities : [],
      reviews: Array.isArray(gym.reviews) ? gym.reviews : [],
      rating: typeof gym.rating === 'number' ? gym.rating : null,
      latitude: typeof gym.latitude === 'number' ? gym.latitude : null,
      longitude: typeof gym.longitude === 'number' ? gym.longitude : null,
    };

  } catch (error) {
    console.error("Failed to fetch gym data:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
       notFound();
    }
    throw new Error('Failed to load gym details. Please try again later.');
  }
}

// --- UI Components ---

function ImageGrid({ images, gymName }: { images: string[]; gymName: string }) {
  if (!images || images.length === 0) return null;

  const mainImage = images[0];
  const gridImages = images.slice(1, 5);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-2 h-80 sm:h-96 overflow-hidden rounded-xl mb-6 md:mb-8 shadow-lg border border-neutral-700/50">
      <div className="col-span-1 sm:col-span-2 row-span-2 relative group h-full">
        <Image
          src={mainImage}
          alt={`${gymName} - Main View`}
          fill
          priority
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      {gridImages.map((image, index) => (
        <div key={index} className={`relative group hidden ${index < 2 ? 'sm:block' : 'sm:hidden md:block'}`}> 
          <Image
            src={image}
            alt={`${gymName} - View ${index + 2}`}
            fill
            sizes="(max-width: 640px) 0, (max-width: 1024px) 20vw, 15vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
        </div>
      ))}
    </div>
  );
}

// --- Main Page Component (Server Component) ---
export default async function GymDetailsPage({ params }: { params: { id: string } }) {

  const gym = await getGymData(params.id);

  const isFavorited = false;

  return (
    <div className="min-h-screen bg-jet-black text-neutral-200 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="mb-4 flex justify-between items-center">
          <Link href="/search" className="inline-flex items-center text-neutral-400 hover:text-neon-yellow transition-colors text-sm font-medium group">
            <FiArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </div>

        <div className="mb-4 md:mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bebas text-white uppercase tracking-wider mb-2">
            {gym.name}
          </h1>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-neutral-400">
            {gym.rating !== null && (
              <div className="flex items-center">
                <FiStar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neon-yellow fill-current mr-1" />
                <span className="font-semibold text-white">{gym.rating.toFixed(1)}</span>
                <span className="ml-1.5">({gym._count?.reviews || 0} reviews)</span>
              </div>
            )}
            <div className="flex items-center">
              <FiMapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span>{gym.address}, {gym.city}{gym.state ? `, ${gym.state}` : ''}</span>
            </div>
          </div>
        </div>

        <ImageGrid images={gym.images} gymName={gym.name} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            <section id="description">
              <h2 className="text-xl md:text-2xl font-bebas text-white uppercase tracking-wide mb-3 md:mb-4">Description</h2>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed whitespace-pre-wrap prose prose-sm prose-invert max-w-none prose-p:my-2">
                {gym.description || 'No description provided.'}
              </p>
            </section>

            {gym.facilities && gym.facilities.length > 0 && (
              <section id="facilities" className="pt-6 md:pt-8 border-t border-neutral-700/80">
                <h2 className="text-xl md:text-2xl font-bebas text-white uppercase tracking-wide mb-3 md:mb-4">Facilities</h2>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {gym.facilities.map((facility, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gunmetal-gray text-neutral-300 rounded-md text-xs uppercase font-medium border border-neutral-600/70"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section id="reviews" className="pt-6 md:pt-8 border-t border-neutral-700/80">
              <h2 className="text-xl md:text-2xl font-bebas text-white uppercase tracking-wide mb-4 md:mb-5">Reviews ({gym._count?.reviews || 0})</h2>
              {gym.reviews && gym.reviews.length > 0 ? (
                <div className="space-y-5 md:space-y-6">
                  {gym.reviews.map((review, index) => (
                    <div key={review.id || index}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {review.user?.image && (
                            <Image src={review.user.image} alt={review.user.name || 'User'} width={32} height={32} className="rounded-full border-2 border-neutral-600" />
                          )}
                          <div className="flex flex-col">
                            <h4 className={`font-bebas text-sm sm:text-base uppercase tracking-wide text-white ${!review.user?.image ? 'ml-0' : ''}`}> 
                              {review.user?.name || 'Anonymous'}
                            </h4>
                            <div className="flex items-center mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <FiStar key={i} className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${i < review.rating ? 'text-neon-yellow fill-current' : 'text-neutral-600'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-neutral-500 text-[10px] sm:text-xs font-medium">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 font-poppins italic pl-10 sm:pl-12">
                        &quot;{review.comment}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400 text-sm font-poppins italic">No reviews yet for this battleground.</p>
              )}
            </section>

            <section id="location" className="pt-6 md:pt-8 border-t border-neutral-700/80">
              <h2 className="text-xl md:text-2xl font-bebas text-white uppercase tracking-wide mb-3 md:mb-4">Location</h2>
              <div className="aspect-video bg-gunmetal-gray rounded-lg border border-neutral-700/60 flex items-center justify-center">
                <p className="text-neutral-500 italic">Map data unavailable</p>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm mt-3">{gym.address}, {gym.city}{gym.state ? `, ${gym.state}` : ''}</p>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-6">
              <div className="bg-gunmetal-gray rounded-lg shadow-xl p-5 md:p-6 border border-neutral-600/80">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Book Your Session</h3>
                  {gym.priceRange && <span className="font-bold text-base sm:text-lg text-neon-yellow">{gym.priceRange}</span>}
                </div>
                <Link href={`/gyms/${gym.id}/book`} 
                  className="block w-full text-center bg-neon-yellow text-black px-6 py-2.5 sm:py-3 rounded-md font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-yellow-400 transition-colors shadow-lg mb-3 sm:mb-4"
                >
                  Check Availability
                </Link>
                <form action={toggleFavoriteGym} className="w-full">
                  <input type="hidden" name="gymId" value={gym.id} />
                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 px-6 py-2 sm:py-2.5 rounded-md font-semibold uppercase tracking-wider text-[11px] sm:text-xs border transition-colors shadow-sm ${isFavorited
                      ? 'bg-blood-red/20 text-blood-red border-blood-red/50 hover:bg-blood-red/30'
                      : 'bg-neutral-700/60 text-neutral-200 border-neutral-600 hover:bg-neutral-600/80 hover:border-neutral-500'
                    }`}
                  >
                    <FiHeart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Favorited' : 'Add to Favorites'}
                  </button>
                </form>
              </div>

              <div className="bg-gunmetal-gray rounded-lg shadow-lg p-5 md:p-6 border border-neutral-700/60">
                <h2 className="text-lg sm:text-xl font-bebas text-white uppercase tracking-wide mb-4 sm:mb-5">Contact</h2>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-start text-neutral-300 text-xs sm:text-sm">
                    <FiMapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2.5 sm:mr-3 mt-0.5 flex-shrink-0 text-blood-red" />
                    <span>{gym.address}<br />{gym.city}, {gym.state} {gym.zipCode}</span>
                  </div>
                  {gym.phone && (
                    <div className="flex items-center text-neutral-300 text-xs sm:text-sm">
                      <FiPhone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2.5 sm:mr-3 flex-shrink-0 text-blood-red" />
                      <a href={`tel:${gym.phone}`} className="hover:text-neon-yellow transition-colors">{gym.phone}</a>
                    </div>
                  )}
                  {gym.website && (
                    <div className="flex items-center text-neutral-300 text-xs sm:text-sm">
                      <FiGlobe className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2.5 sm:mr-3 flex-shrink-0 text-blood-red" />
                      <a href={gym.website.startsWith('http') ? gym.website : `https://${gym.website}`}
                        className="hover:text-neon-yellow transition-colors truncate" target="_blank" rel="noopener noreferrer">
                        {gym.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {gym.email && (
                    <div className="flex items-center text-neutral-300 text-xs sm:text-sm">
                      <FiMail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2.5 sm:mr-3 flex-shrink-0 text-blood-red" />
                      <a href={`mailto:${gym.email}`} className="hover:text-neon-yellow transition-colors truncate">
                        {gym.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 