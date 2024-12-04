import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import CustomerReviewSkeleton from "./reviewsskeleton";

// Separated StarRating component
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
          className="mr-1 focus:outline-none"
          onMouseEnter={() => !disabled && setHoveredRating(star)}
          onMouseLeave={() => !disabled && setHoveredRating(0)}
          onClick={() => !disabled && onRatingChange(star)}
          disabled={disabled}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={`${
              star <= (hoveredRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            } transition-colors duration-150`}
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
      
      // Ensure dates are properly parsed and formatted
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

      // Prepare review submission
      const reviewToSubmit = {
        ...newReview,
        customerId: session.user.id,
        customerName: session.user.name || session.user.email,
        businessId: businessId,
        reviewDate: new Date().toISOString() // Explicit current timestamp
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

      const submittedReview = await res.json();

      // Optimistically update reviews
      setReviews(prevReviews => [
        {
          ...submittedReview,
          reviewDate: new Date().toISOString()
        },
        ...prevReviews
      ]);

      // Reset form
      setNewReview({ rating: 0, comment: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      
      {loading ? (
        <CustomerReviewSkeleton />
      ) : error ? (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-md shadow-sm">
                <div className="flex items-center mb-2">
                  <img
                    src="/images/profile/profile.jpg"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="text-gray-800">{review.customerName}</h3>
                  </div>
                </div>
                <div className="flex items-center">
                  <StarRating rating={review.rating} disabled={true} size={12} />
                  <p className="text-sm ms-2 text-gray-500">
                    {formatDate(review.reviewDate)}
                  </p>
                </div>
                <p className="text-gray-700 mt-1">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No reviews yet</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-lg shadow-sm">
        <div className="mb-4">
          <StarRating
            rating={newReview.rating}
            onRatingChange={(rating) =>
              setNewReview((prev) => ({ ...prev, rating }))
            }
            size={24}
          />
        </div>

        <div className="mb-4">
          <textarea
            className="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
            rows="4"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder="Leave a review... (minimum 10 characters)"
            required
            minLength={10}
          ></textarea>
        </div>

        {error && (
          <div className="text-red-500 mb-4 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex pb-3 items-center justify-end">
          <button
            className="bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50"
            type="submit"
            disabled={isSubmitting || !session}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reviews;