// generative-ui-chat/components/ecommerce/product-review.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Textarea, Avatar, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface ProductReviewProps {
  productName: string;
  reviews: Review[];
  onSubmitReview: (rating: number, comment: string) => void;
}

const StarRating: React.FC<{ rating: number, onRate?: (rating: number) => void }> = ({ rating, onRate }) => {
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

export const ProductReview: React.FC<ProductReviewProps> = ({
  productName,
  reviews,
  onSubmitReview
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const handleSubmitReview = () => {
    onSubmitReview(newRating, newComment);
    setNewRating(0);
    setNewComment("");
    onClose();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <Button color="primary" onPress={onOpen}>Write a Review</Button>
      </CardHeader>
      <CardBody>
        {reviews.map((review) => (
          <div key={review.id} className="mb-4">
            <div className="flex items-center mb-2">
              <Avatar src={review.avatar} alt={review.author} className="mr-2" />
              <div>
                <p className="font-semibold">{review.author}</p>
                <div className="flex items-center">
                  <StarRating rating={review.rating} />
                  <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <Divider className="my-4" />
          </div>
        ))}
      </CardBody>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Write a Review for {productName}</ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <label className="block mb-2">Your Rating</label>
              <StarRating rating={newRating} onRate={setNewRating} />
            </div>
            <Textarea
              label="Your Review"
              placeholder="Write your review here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmitReview}>
              Submit Review
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export const ProductReviewExample = () => {
  const exampleReviews: Review[] = [
    {
      id: "1",
      author: "John Doe",
      avatar: "/api/placeholder/32/32",
      rating: 5,
      date: "2024-05-01",
      comment: "Great product! Exceeded my expectations."
    },
    {
      id: "2",
      author: "Jane Smith",
      avatar: "/api/placeholder/32/32",
      rating: 4,
      date: "2024-04-28",
      comment: "Good quality, but shipping took longer than expected."
    },
    // Add more reviews as needed
  ];

  const handleSubmitReview = (rating: number, comment: string) => {
    console.log(`New review submitted - Rating: ${rating}, Comment: ${comment}`);
    // Here you would typically send this data to your backend and update the reviews list
  };

  return (
    <ProductReview
      productName="Wireless Bluetooth Headphones"
      reviews={exampleReviews}
      onSubmitReview={handleSubmitReview}
    />
  );
};