'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Review } from '@/types';

function StarRating({
  value,
  onChange,
  interactive = false,
  size = 'md',
}: {
  value: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange?.(star)}
        >
          <Star
            className={`${sizeClass} ${
              star <= (hovered || value)
                ? 'text-amber-500 fill-amber-500'
                : 'text-muted-foreground/30'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md border-transparent hover:border-primary/10 bg-white/80 backdrop-blur-sm h-full">
      <CardContent className="p-5 pt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">{review.name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <StarRating value={review.rating} size="sm" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.comment}
        </p>
      </CardContent>
    </Card>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.reviews) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), rating, comment: comment.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setReviews((prev) => [data, ...prev]);
        setName('');
        setRating(0);
        setComment('');
        toast.success('Thank you for your review!');
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="reviews">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Customer Reviews
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          See what our customers say about our products and services.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Existing Reviews */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            {reviews.length} Reviews
          </h3>

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </div>
          )}

          {!loading && reviews.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
            >
              {reviews.map((review) => (
                <motion.div key={review.id} variants={itemVariants}>
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Add Review Form */}
        <div>
          <Card className="border-transparent bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 pt-8">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Write a Review
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="review-name">Your Name</Label>
                  <Input
                    id="review-name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    <StarRating value={rating} onChange={setRating} interactive size="lg" />
                    {rating > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {rating} star{rating !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-comment">Your Review</Label>
                  <Textarea
                    id="review-comment"
                    placeholder="Share your experience with our products..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={submitting || rating === 0}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
