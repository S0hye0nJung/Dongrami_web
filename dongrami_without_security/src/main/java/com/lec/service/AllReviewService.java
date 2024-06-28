package com.lec.service;

import com.lec.entity.Review;
import java.util.List;

public interface AllReviewService {
    Review saveReview(Review review);
    List<Review> getAllReviewsWithNicknames();
    Review getReviewById(int id); // 리뷰 ID로 조회하는 메서드 추가
    void deleteReview(int id); // 리뷰 삭제 메서드 추가
}
