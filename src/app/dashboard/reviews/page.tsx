'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiStar, FiThumbsUp, FiMessageSquare, FiFlag, FiSearch } from 'react-icons/fi';
import Image from 'next/image';

// Mock data for reviews
interface Review {
  id: string;
  user: {
    name: string;
    image: string | null;
  };
  rating: number;
  comment: string;
  date: string;
  status: string;
  helpfulCount: number;
  hasOwnerResponse: boolean;
  ownerResponse: string | null;
}

const mockReviews = [
  {
    id: '1',
    user: {
      name: 'Ahmed Tazi',
      image: null,
    },
    rating: 5,
    comment: 'Excellentes installations et personnel accueillant. Je recommande vivement ce club de sport à tous ceux qui cherchent un environnement motivant pour atteindre leurs objectifs fitness.',
    date: '2024-03-15',
    status: 'PUBLISHED',
    helpfulCount: 12,
    hasOwnerResponse: false,
    ownerResponse: null,
  },
  {
    id: '2',
    user: {
      name: 'Yasmine Idrissi',
      image: null,
    },
    rating: 4,
    comment: 'J\'adore les cours collectifs, surtout le HIIT. Les équipements sont de qualité mais la salle peut être bondée en soirée ce qui rend parfois l\'entraînement difficile.',
    date: '2024-03-10',
    status: 'PUBLISHED',
    helpfulCount: 5,
    hasOwnerResponse: true,
    ownerResponse: 'Merci pour votre retour, Yasmine! Nous sommes ravis que vous appréciez nos cours collectifs. Concernant l\'affluence en soirée, nous travaillons actuellement à optimiser nos espaces pour assurer une meilleure expérience à tous nos membres.',
  },
  {
    id: '3',
    user: {
      name: 'Mohamed Benjelloun',
      image: null,
    },
    rating: 3,
    comment: 'Prix raisonnable pour la qualité des services offerts, mais les vestiaires pourraient être mieux entretenus et plus spacieux.',
    date: '2024-03-05',
    status: 'PUBLISHED',
    helpfulCount: 2,
    hasOwnerResponse: false,
    ownerResponse: null,
  },
  {
    id: '4',
    user: {
      name: 'Fatima Zohra',
      image: null,
    },
    rating: 5,
    comment: 'Les coachs sont très professionnels et s\'adaptent parfaitement à mon niveau. J\'ai vu des résultats visibles après seulement quelques semaines!',
    date: '2024-02-28',
    status: 'PUBLISHED',
    helpfulCount: 8,
    hasOwnerResponse: true,
    ownerResponse: 'Merci beaucoup pour votre retour positif, Fatima! Nous sommes heureux de contribuer à votre parcours fitness et nous transmettrons vos compliments à notre équipe de coachs.',
  },
  {
    id: '5',
    user: {
      name: 'Karim Naciri',
      image: null,
    },
    rating: 2,
    comment: 'Déçu par le service client. J\'ai signalé plusieurs fois un problème avec les douches et rien n\'a été fait.',
    date: '2024-02-20',
    status: 'PUBLISHED',
    helpfulCount: 3,
    hasOwnerResponse: false,
    ownerResponse: null,
  },
];

export default function ReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [respondToReviewId, setRespondToReviewId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = filterRating === 0 || review.rating === filterRating;
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'helpful') {
        return b.helpfulCount - a.helpfulCount;
      }
      return 0;
    });

  if (!session || session.user.role !== 'GYM_OWNER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to be a gym owner to access this page.</p>
        </div>
      </div>
    );
  }

  const handleRespondClick = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    setRespondToReviewId(reviewId);
    setResponseText(review?.ownerResponse || '');
  };

  const submitResponse = (reviewId: string) => {
    // In a real app, this would send data to the API
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            hasOwnerResponse: true, 
            ownerResponse: responseText 
          } 
        : review
    ));
    setRespondToReviewId(null);
    setResponseText('');
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-2">Manage customer reviews and respond to feedback.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search reviews..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
            >
              <option value="0">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Newest First</option>
              <option value="rating">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={review.user.image || '/default-avatar.png'}
                          alt={review.user.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{review.user.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center text-sm text-gray-500">
                      <FiThumbsUp className="mr-1" /> {review.helpfulCount}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FiFlag />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 text-gray-700">
                  {review.comment}
                </div>
                
                {review.hasOwnerResponse && (
                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="font-medium text-blue-600">O</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Owner Response</h4>
                        <p className="text-xs text-gray-500">
                          {/* In a real app, you'd show the response date */}
                          Replied on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.ownerResponse}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  {!review.hasOwnerResponse ? (
                    <button 
                      onClick={() => handleRespondClick(review.id)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FiMessageSquare className="mr-1" /> Respond
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRespondClick(review.id)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FiMessageSquare className="mr-1" /> Edit Response
                    </button>
                  )}
                </div>
                
                {respondToReviewId === review.id && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Type your response here..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <button 
                        onClick={() => setRespondToReviewId(null)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => submitResponse(review.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={!responseText.trim()}
                      >
                        Submit Response
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No reviews found. Customers will leave reviews as they experience your services.</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Rating Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => r.rating === rating).length;
            const percentage = (count / reviews.length) * 100 || 0;
            
            return (
              <div key={rating} className="flex items-center space-x-2">
                <div className="flex items-center">
                  <FiStar className={`h-5 w-5 ${rating >= 4 ? 'text-yellow-400 fill-current' : rating === 3 ? 'text-yellow-300 fill-current' : 'text-red-400 fill-current'}`} />
                  <span className="ml-1 text-sm font-medium text-gray-700">{rating}</span>
                </div>
                <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${rating >= 4 ? 'bg-green-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold">
              {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0).toFixed(1)}
            </div>
            <div className="flex mt-1">
              {renderStars(Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Based on {reviews.length} reviews
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Response Rate</div>
            <div className="text-2xl font-bold">
              {Math.round((reviews.filter(r => r.hasOwnerResponse).length / reviews.length || 0) * 100)}%
            </div>
            <div className="text-sm text-gray-500">
              {reviews.filter(r => r.hasOwnerResponse).length} of {reviews.length} reviews answered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 