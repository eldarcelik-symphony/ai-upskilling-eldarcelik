import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IReviewsResponse, IReview } from '../types';
import { axios } from '../axios';
import formatDate from '../utils/formatDate';
import truncateText from '../utils/truncateText';
import { AVATAR_PATH } from '../constants';

interface ReviewsProps {
  contentType: string;
  itemId: string | undefined;
}

export default function Reviews({ contentType, itemId }: ReviewsProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [totalResults, setTotalResults] = useState(0);
  const loadingRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchReviews = useCallback(
    async (page: number, append: boolean = false) => {
      if (!itemId) return;

      setLoading(true);
      try {
        const response = await axios.get(`/${contentType}/${itemId}/reviews?page=${page}`);
        const data: IReviewsResponse = response.data;

        if (append) {
          setReviews((prev) => [...prev, ...data.results]);
        } else {
          setReviews(data.results);
        }

        setTotalResults(data.totalResults);
        setHasMore(data.page < data.totalPages);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    },
    [contentType, itemId],
  );

  useEffect(() => {
    if (!itemId) return;

    // Reset state when item changes
    setReviews([]);
    setCurrentPage(1);
    setHasMore(true);
    setExpandedReviews(new Set());

    fetchReviews(1, false);
  }, [itemId, fetchReviews]);

  useEffect(() => {
    if (!loadingRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchReviews(nextPage, true);
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current = observer;
    observer.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, currentPage, fetchReviews]);

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating < 4) {
      return 'bg-red-100 text-red-800';
    } else if (rating <= 7) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  if (reviews.length === 0 && !loading) {
    return (
      <div className='text-center py-8 text-gray-500'>
        <p>No reviews available for this {contentType === 'movie' ? 'movie' : 'show'}.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-2xl font-bold text-primary mb-6'>Reviews ({totalResults})</h2>

      <div className='space-y-6'>
        {reviews.map((review: IReview) => (
          <div key={review.id} className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-start space-x-4'>
              {/* User Avatar */}
              <div className='flex-shrink-0'>
                {review.authorDetails.avatarPath ? (
                  <img
                    src={`${AVATAR_PATH}${review.authorDetails.avatarPath}`}
                    alt={review.author}
                    className='w-12 h-12 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center'>
                    <svg className='w-6 h-6 text-gray-600' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-lg font-semibold text-gray-900'>{review.author}</h3>
                  <div className='flex items-center space-x-2'>
                    {review.authorDetails.rating && (
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded ${getRatingColor(review.authorDetails.rating)} flex items-center space-x-1`}
                      >
                        <span>{review.authorDetails.rating}/10</span>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                      </span>
                    )}
                    <span className='text-sm text-gray-500'>{formatDate(review.createdAt)}</span>
                  </div>
                </div>

                <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                  {expandedReviews.has(review.id) ? review.content : truncateText(review.content)}
                  {review.content.length > 500 && (
                    <span
                      onClick={() => toggleReviewExpansion(review.id)}
                      className='ml-1 text-blue-600 cursor-pointer hover:underline'
                    >
                      {expandedReviews.has(review.id) ? 'Read less' : 'Read more'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lazy Loading Indicator */}
      {hasMore && (
        <div ref={loadingRef} className='flex justify-center items-center py-8'>
          {loading ? (
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          ) : (
            <div className='text-gray-500'>Scroll to load more reviews...</div>
          )}
        </div>
      )}

      {/* End of Reviews */}
      {!hasMore && reviews.length > 0 && (
        <div className='text-center py-8 text-gray-500'>
          <p>You've reached the end of all reviews.</p>
        </div>
      )}
    </div>
  );
}
