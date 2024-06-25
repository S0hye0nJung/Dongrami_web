package com.lec.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lec.dto.MyReviewDTO;
import com.lec.entity.Review;
import com.lec.repository.MyReviewRepository;
import com.lec.repository.ReviewRepository;
import com.lec.service.MyReviewService;
import com.lec.service.ReviewService;

import jakarta.transaction.Transactional;

@Service
public class MyReviewServiceImpl implements MyReviewService {

    private final MyReviewRepository myReviewRepository;

    @Autowired
    public MyReviewServiceImpl(MyReviewRepository myReviewRepository) {
        this.myReviewRepository = myReviewRepository;
    }

    @Override
    public List<MyReviewDTO> getAllReviewDTOs() {
        List<Review> reviews = myReviewRepository.findAll();
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MyReviewDTO convertToDTO(Review review) {
        return MyReviewDTO.builder()
                .reviewId(review.getReviewId())
                .mainCategoryName(review.getSubcategory().getMaincategory().getMaincategory_name()) // 이 부분은 실제 데이터 모델에 맞게 수정 필요
                .reviewText(review.getReviewText())
                .reviewCreate(review.getReviewCreate())
                .build();
    }

    @Override
    public void deleteReview(int reviewId) {
        myReviewRepository.deleteById(reviewId);
    }
}
