import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Star, UserCircle2, MessageCircle, CalendarDays } from "lucide-react";
import { useSession } from "next-auth/react";

const StarRating = ({
  rating,
  onRatingChange,
  disabled = false,
  size = 16,
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <div className="flex items-center">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className="mr-1 focus:outline-none group"
          onMouseEnter={() => !disabled && setHoveredRating(star)}
          onMouseLeave={() => !disabled && setHoveredRating(0)}
          onClick={() => !disabled && onRatingChange(star)}
          disabled={disabled}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={`
              ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200 group-hover:text-yellow-200"
              }
              transition-all duration-200 transform 
              ${!disabled && "hover:scale-110"}
            `}
          />
        </button>
      ))}
    </div>
  );
};

const Reviews = ({ businessId }) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime())
        ? date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Invalid Date";
    } catch (error) {
      return "Invalid Date";
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    if (!businessId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/reviews/${businessId}`);
      if (!res.ok) {
        throw new Error("Error fetching reviews");
      }
      const data = await res.json();

      const processedReviews = (data.data || [])
        .map((review) => ({
          ...review,
          reviewDate: review.reviewDate
            ? new Date(review.reviewDate).toISOString()
            : new Date().toISOString(),
        }))
        .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));

      setReviews(processedReviews);
    } catch (err) {
      setError(err.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Submit review handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!session) {
      setError("You must be logged in to submit a review.");
      return;
    }

    if (newReview.rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (newReview.comment.trim().length < 10) {
      setError("Comment must be at least 10 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const reviewToSubmit = {
        ...newReview,
        customerId: session.user.id,
        customerName: session.user.name || session.user.email,
        businessId: businessId,
        reviewDate: new Date().toISOString(),
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewToSubmit),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error submitting review");
      }

      setNewReview({ rating: 0, comment: "" });
      await fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <h2 className="text-3xl font-bold">Reviews & Ratings</h2>
        <div className="flex items-center space-x-2">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          <span className="text-2xl font-bold">4.5</span>
          <span className="text-gray-500">({reviews.length})</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 px-4 py-3 rounded-2xl text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserCircle2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{review.customerName}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <StarRating
                          rating={review.rating}
                          disabled={true}
                          size={14}
                        />
                        <span>•</span>
                        <div className="flex items-center">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          {formatDate(review.reviewDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 pl-16">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      )}

      {session ? (
        <form onSubmit={handleSubmit} className="border-t border-gray-100 pt-8">
          <h3 className="text-xl font-bold mb-6">Write a Review</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) =>
                setNewReview((prev) => ({ ...prev, rating }))
              }
              size={24}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Your Experience
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-2xl bg-gray-100 border-transparent focus:border-black focus:bg-white focus:ring-0 transition-colors"
              rows="4"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Share your thoughts about your experience..."
              required
              minLength={10}
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-black text-white rounded-full font-medium
                hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Post Review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center border rounded-2xl p-8 bg-gray-50">
          <UserCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">Sign in to share your experience</p>
          <button className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
