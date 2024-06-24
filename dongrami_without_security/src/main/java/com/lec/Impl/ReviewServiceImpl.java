package com.lec.Impl;

import com.lec.dto.ReviewDTO;
import com.lec.entity.Review;
import com.lec.repository.ReviewRepository;
import com.lec.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review saveReview(ReviewDTO reviewDTO) {
        Review review = new Review();
        review.setUserId(reviewDTO.getUserId());
        review.setSubcategoryId(reviewDTO.getSubcategoryId());
        review.setRating(reviewDTO.getRating());
        review.setReviewText(reviewDTO.getReviewText());
        review.setReviewCreate(new Date());
        review.setReviewModify(new Date());
        review.setNickname(reviewDTO.getNickname()); // nickname 필드 추가
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public Review updateReview(Integer id, ReviewDTO reviewDTO) {
        Optional<Review> optionalReview = reviewRepository.findById(id);
        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();
            review.setRating(reviewDTO.getRating());
            review.setReviewText(reviewDTO.getReviewText());
            review.setReviewModify(new Date());
            review.setNickname(reviewDTO.getNickname()); // nickname 필드 추가
            return reviewRepository.save(review);
        } else {
            throw new RuntimeException("Review not found with id " + id);
        }
    }

    @Override
    public void deleteReview(Integer id) {
        reviewRepository.deleteById(id);
    }
}
