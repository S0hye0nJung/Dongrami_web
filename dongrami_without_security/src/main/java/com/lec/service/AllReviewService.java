package com.lec.service;

import java.util.List;
import com.lec.dto.AllReviewDTO;
import com.lec.entity.AllReview;

public interface AllReviewService {
    List<AllReviewDTO> getAllReviews();
    AllReview getReviewById(int id);
    AllReview saveReview(AllReview review);
    void deleteReview(int id);
    AllReview updateReview(int id, AllReviewDTO reviewDTO);
}
