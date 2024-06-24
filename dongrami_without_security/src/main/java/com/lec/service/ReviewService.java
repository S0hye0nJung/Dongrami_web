package com.lec.service;

import java.util.List;

import com.lec.entity.Review;

public interface ReviewService {

    List<Review> getAllReviews();

    void deleteReview(int reviewId);
}
