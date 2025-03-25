import React from 'react';
import { UserProfile } from '@/types/user';
import { FiMessageSquare, FiStar, FiEdit, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

interface UserReviewsProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onDeleteReview?: (reviewId: string) => Promise<void>;
  className?: string;
}

export const UserReviews: React.FC<UserReviewsProps> = ({
  profile,
  isOwnProfile = false,
  onDeleteReview,
  className = "",
}) => {
  const reviews = profile.reviews || [];

  if (reviews.length === 0) {
    return (
      <div className={`bg-white border border-neutral-200 rounded-xl p-6 text-center ${className}`}>
        <FiMessageSquare className="mx-auto text-neutral-300 h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium text-neutral-700">No Reviews Yet</h3>
        <p className="text-neutral-500 mt-2">
          {isOwnProfile 
            ? "You haven't reviewed any gyms yet. Share your experiences with others!"
            : `${profile.name} hasn't reviewed any gyms yet.`
          }
        </p>
        {isOwnProfile && (
          <Link 
            href="/gyms" 
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
          >
            Find Gyms to Review
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {reviews.map((review) => (
        <div key={review.id} className="bg-white border border-neutral-200 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <Link href={`/gyms/${review.gymId}`} className="group">
              <h3 className="text-lg font-medium text-neutral-800 group-hover:text-indigo-600 transition-colors">
                {review.gymName}
              </h3>
            </Link>
            
            <div className="flex items-center">
              {/* Star Rating */}
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar 
                    key={i} 
                    fill={i < review.rating ? "currentColor" : "none"} 
                    className="w-5 h-5"
                  />
                ))}
              </div>
              
              {/* Action buttons for own reviews */}
              {isOwnProfile && (
                <div className="flex ml-4">
                  <Link 
                    href={`/gyms/${review.gymId}/reviews/edit/${review.id}`}
                    className="text-neutral-500 hover:text-indigo-600 transition-colors p-1"
                    aria-label="Edit review"
                  >
                    <FiEdit className="w-5 h-5" />
                  </Link>
                  
                  {onDeleteReview && (
                    <button
                      onClick={() => onDeleteReview(review.id)}
                      className="text-neutral-500 hover:text-rose-500 transition-colors p-1 ml-2"
                      aria-label="Delete review"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-neutral-500 text-sm mt-1">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          
          <p className="mt-4 text-neutral-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default UserReviews; 