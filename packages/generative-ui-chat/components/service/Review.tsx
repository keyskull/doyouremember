// generative-ui-chat/components/service/review.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Textarea, Button, Avatar, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
}

interface ReviewProps {
  productName: string;
  reviews: Review[];
  onSubmitReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

const StarRating: React.FC<{ rating: number; onRate?: (rating: number) => void }> = ({ rating, onRate }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon={star <= rating ? "mdi:star" : "mdi:star-outline"}
          className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} cursor-pointer`}
          onClick={() => onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

export const Review: React.FC<ReviewProps> = ({ productName, reviews, onSubmitReview }) => {
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 0,
    title: '',
    comment: ''
  });

  const handleInputChange = (field: keyof typeof newReview, value: string | number) => {
    setNewReview(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(newReview);
    setNewReview({ author: '', rating: 0, title: '', comment: '' });
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingCounts = reviews.reduce((counts, review) => {
    counts[review.rating] = (counts[review.rating] || 0) + 1;
    return counts;
  }, {} as Record<number, number>);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
          <h4 className="text-large font-bold">Reviews for {productName}</h4>
          <div className="flex items-center">
            <StarRating rating={Math.round(averageRating)} />
            <span className="ml-2">{averageRating.toFixed(1)} out of 5</span>
          </div>
          <p className="text-small text-default-500">{reviews.length} reviews</p>
        </CardHeader>
        <CardBody className="px-4 py-4">
          <div className="flex flex-col space-y-2">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center">
                <span className="w-10 text-small">{star} star</span>
                <Progress 
                  value={(ratingCounts[star] || 0) / reviews.length * 100} 
                  className="w-full max-w-md"
                  color="warning"
                />
                <span className="w-10 text-small text-right">{ratingCounts[star] || 0}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="px-4 pt-4 pb-0">
          <h4 className="text-large font-bold">Write a Review</h4>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your Name"
              value={newReview.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              required
            />
            <div>
              <label className="block text-small font-medium mb-1">Rating</label>
              <StarRating 
                rating={newReview.rating} 
                onRate={(rating) => handleInputChange('rating', rating)} 
              />
            </div>
            <Input
              label="Review Title"
              value={newReview.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
            <Textarea
              label="Your Review"
              value={newReview.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              required
            />
            <Button color="primary" type="submit">
              Submit Review
            </Button>
          </form>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardBody className="px-4 py-4">
              <div className="flex items-start space-x-4">
                <Avatar name={review.author} size="lg" />
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h5 className="text-medium font-semibold">{review.author}</h5>
                    <span className="text-small text-default-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating rating={review.rating} />
                  <h6 className="font-medium mt-2">{review.title}</h6>
                  <p className="text-small mt-1">{review.comment}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ReviewExample = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: 'John Doe',
      rating: 5,
      title: 'Great product!',
      comment: 'This product exceeded my expectations. Highly recommended!',
      date: new Date('2023-05-15')
    },
    {
      id: '2',
      author: 'Jane Smith',
      rating: 4,
      title: 'Good value for money',
      comment: 'Pretty good product for the price. Could be improved in some areas.',
      date: new Date('2023-06-20')
    }
  ]);

  const handleSubmitReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const reviewToAdd = {
      ...newReview,
      id: String(reviews.length + 1),
      date: new Date()
    };
    setReviews(prev => [...prev, reviewToAdd]);
  };

  return (
    <Review
      productName="Sample Product"
      reviews={reviews}
      onSubmitReview={handleSubmitReview}
    />
  );
};