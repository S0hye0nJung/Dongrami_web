package com.lec.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lec.entity.Review;
import com.lec.repository.ReviewRepository;
import com.lec.service.ReviewService;

import jakarta.transaction.Transactional;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteReview(int reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
