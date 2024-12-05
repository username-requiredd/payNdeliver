import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Star, UserCircle2, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";

// Separated StarRating component with enhanced design
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
              ${star <= (hoveredRating || rating)
                ? "text-amber-500 fill-amber-500" 
                : "text-gray-300 group-hover:text-amber-300"}
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
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safe date formatting function
  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) 
        ? date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) 
        : 'Invalid Date';
    } catch (error) {
      return 'Invalid Date';
    }
  }, []);

  // Fetch reviews with improved date handling
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
      
      const processedReviews = (data.data || []).map(review => ({
        ...review,
        reviewDate: review.reviewDate 
          ? new Date(review.reviewDate).toISOString() 
          : new Date().toISOString()
      })).sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));

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
    <div className="mx-auto max-w-3xl p-6 mb-5 bg-white rounded-xl shadow-sm">
      <div className="flex items-center mb-6 border-b pb-4">
        <MessageCircle className="mr-3 text-green-600" size={32} />
        <h2 className="text-3xl font-extrabold text-gray-800">Customer Reviews</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-100 p-4 rounded-lg">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-2">
                  <UserCircle2 
                    className="w-10 h-10 text-green-500 mr-3" 
                    strokeWidth={1.5} 
                  />
                  <div>
                    <h3 className="text-gray-800 font-semibold">{review.customerName}</h3>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <StarRating rating={review.rating} disabled={true} size={16} />
                  <p className="text-sm ml-3 text-gray-500">
                    {formatDate(review.reviewDate)}
                  </p>
                </div>
                <p className="text-gray-700 italic">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 italic bg-gray-50 p-6 rounded-lg">
              <MessageCircle className="mx-auto mb-3 text-gray-400" size={32} />
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      )}

      {session ? (
        <form 
          onSubmit={handleSubmit} 
          className="bg-gray-100 p-6 rounded-lg shadow-inner"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Your Rating
            </label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) =>
                setNewReview((prev) => ({ ...prev, rating }))
              }
              size={28}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Your Review
            </label>
            <textarea
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-green-500 transition duration-300"
              rows="4"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Share your experience... (minimum 10 characters)"
              required
              minLength={10}
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg 
                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 
                transition duration-300 ease-in-out transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-700 mb-4">
            Please log in to submit a review
          </p>
          <button 
            className="bg-green-600 text-white px-6 py-2 rounded-lg 
              hover:bg-green-700 transition duration-300"
          >
            Log In
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;