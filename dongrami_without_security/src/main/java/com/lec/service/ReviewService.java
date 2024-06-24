package com.lec.service;

import com.lec.dto.ReviewDTO;
import com.lec.entity.Review;

import java.util.List;

public interface ReviewService {
    Review saveReview(ReviewDTO reviewDTO);
    List<Review> getAllReviews();
    Review updateReview(Integer id, ReviewDTO reviewDTO);
    void deleteReview(Integer id);
}
