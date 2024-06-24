package com.lec.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lec.entity.Review;
import com.lec.service.ReviewService;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // 모든 리뷰 조회
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable int reviewId) {
        reviewService.deleteReview(reviewId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
