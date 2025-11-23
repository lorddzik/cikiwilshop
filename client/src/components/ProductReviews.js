// client/src/components/ProductReviews.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const StarIcon = ({ className = "w-5 h-5 text-yellow-400", filled = true }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={filled ? 0 : 2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const RatingBar = ({ rating, count, total }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center w-8">
        <span className="text-sm font-medium text-gray-600">{rating}</span>
        <StarIcon className="w-3 h-3 text-yellow-400 ml-1" />
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
    </div>
  );
};

// Lightbox Modal untuk menampilkan foto/video fullscreen
const MediaLightbox = ({ mediaUrl, onClose }) => {
  const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm');

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
        onClick={onClose}
      >
        &times;
      </button>

      <div className="max-w-4xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video
            src={`http://localhost:5000${mediaUrl}`}
            controls
            autoPlay
            className="max-w-full max-h-[90vh] rounded-lg"
          />
        ) : (
          <img
            src={`http://localhost:5000${mediaUrl}`}
            alt="Review media"
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
          />
        )}
      </div>
    </div>
  );
};

const ProductReviews = ({ productId }) => {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
      const product = response.data;

      const breakdown = [5, 4, 3, 2, 1].map(r => ({
        rating: r,
        count: product.reviews ? product.reviews.filter(rev => rev.rating === r).length : 0
      }));

      setReviewData({
        averageRating: product.rating ? product.rating.toFixed(1) : 0,
        totalReviews: product.numReviews || 0,
        reviews: product.reviews ? product.reviews.reverse() : [],
        ratingBreakdown: breakdown
      });
    } catch (error) {
      console.error("Gagal mengambil ulasan produk:", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId, fetchReviews]);

  if (loading) return <div className="bg-white p-6 rounded-lg shadow-lg mt-8 animate-pulse">Memuat ulasan...</div>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-bold mb-6">Ulasan Pembeli</h2>

        {(!reviewData || reviewData.totalReviews === 0) ? (
          <div className="text-center text-gray-500 py-8">Belum ada ulasan untuk produk ini.</div>
        ) : (
          <>
            {/* Statistik Rating */}
            <div className="flex flex-col md:flex-row gap-8 border-b pb-6 mb-6">
              <div className="text-center md:text-left min-w-[150px]">
                <p className="text-5xl font-bold text-gray-800">
                  {reviewData.averageRating}<span className="text-2xl text-gray-400">/5</span>
                </p>
                <div className="flex justify-center md:justify-start my-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} filled={i < Math.round(reviewData.averageRating)} />
                  ))}
                </div>
                <p className="text-sm text-gray-500">{reviewData.totalReviews} ulasan</p>
              </div>

              <div className="flex-grow max-w-md">
                {reviewData.ratingBreakdown.map(item => (
                  <RatingBar key={item.rating} rating={item.rating} count={item.count} total={reviewData.totalReviews} />
                ))}
              </div>
            </div>

            {/* Daftar Ulasan */}
            <div className="space-y-6">
              {reviewData.reviews.map((review, idx) => (
                <div key={idx} className="flex space-x-4 border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                      {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-800">{review.name}</p>
                      <span className="text-xs text-gray-400">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('id-ID') : 'Baru saja'}
                      </span>
                    </div>
                    <div className="flex items-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400" filled={i < review.rating} />
                      ))}
                    </div>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">{review.comment}</p>

                    {/* Display Media (Photos/Videos) */}
                    {review.mediaUrls && review.mediaUrls.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {review.mediaUrls.map((mediaUrl, mediaIdx) => {
                          const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm');
                          return (
                            <div
                              key={mediaIdx}
                              className="relative cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setSelectedMedia(mediaUrl)}
                            >
                              {isVideo ? (
                                <div className="relative">
                                  <video
                                    src={`http://localhost:5000${mediaUrl}`}
                                    className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                    muted
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black bg-opacity-60 rounded-full p-2">
                                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={`http://localhost:5000${mediaUrl}`}
                                  alt={`Review media ${mediaIdx + 1}`}
                                  className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <MediaLightbox
          mediaUrl={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
};

export default ProductReviews;