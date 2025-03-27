import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, ListGroup } from 'react-bootstrap';
import Message from './Message';
import Rating from './Rating';

const Reviews = ({
  product,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  loading
}) => {
  return (
    <>
      <h2>Reviews</h2>

      {/* Display a message if there are no reviews */}
      {product.reviews.length === 0 && <Message>No Reviews</Message>}

      <ListGroup variant="flush">
        {/* Loop through product reviews and display each review */}
        {product.reviews.map((review) => (
          <ListGroup.Item key={review._id}>
            <strong>{review.name}</strong>
            <Rating value={review.rating} />
            <p>{new Date(review.createdAt).toDateString()}</p>
            <p>{review.comment}</p>
          </ListGroup.Item>
        ))}

        {/* Review submission form */}
        <ListGroup.Item>
          <h2>Write a Customer Review</h2>

          {/* Show the review form only if the user is logged in */}
          {userInfo ? (
            <Form onSubmit={submitHandler}>
              {/* Rating Selection */}
              <Form.Group className="my-2" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  as="select"
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </Form.Control>
              </Form.Group>

              {/* Comment Input */}
              <Form.Group className="my-2" controlId="comment">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>

              {/* Submit Button */}
              <Button className="w-100" disabled={loading} type="submit" variant="warning">
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Form>
          ) : (
            // Message prompting users to sign in to write a review
            <Message>
              Please <Link to="/login">sign in</Link> to write a review
            </Message>
          )}
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default Reviews;
