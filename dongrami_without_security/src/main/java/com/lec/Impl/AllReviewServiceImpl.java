package com.lec.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Date;
import java.util.stream.Collectors;
import com.lec.entity.AllReview;
import com.lec.repository.AllReviewRepository;
import com.lec.service.AllReviewService;
import com.lec.dto.AllReviewDTO;

@Service
public class AllReviewServiceImpl implements AllReviewService {

    @Autowired
    private AllReviewRepository reviewRepository;

    @Override
    public List<AllReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public AllReview getReviewById(int id) {
        return reviewRepository.findById(id).orElse(null);
    }

    @Override
    public AllReview saveReview(AllReview review) {
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(int id) {
        reviewRepository.deleteById(id);
    }

    @Override
    public AllReview updateReview(int id, AllReviewDTO reviewDTO) {
        Optional<AllReview> optionalReview = reviewRepository.findById(id);
        if (optionalReview.isPresent()) {
            AllReview existingReview = optionalReview.get();
            existingReview.setReviewText(reviewDTO.getReviewText());
            existingReview.setRating(reviewDTO.getRating());
            existingReview.setUserId(reviewDTO.getUserId());
            existingReview.setSubcategoryId(reviewDTO.getSubcategoryId());
            existingReview.setResultId(reviewDTO.getResultId());
            existingReview.setNickname(reviewDTO.getNickname());
            existingReview.setReviewModify(new Date());
            return reviewRepository.save(existingReview);
        }
        return null;
    }

    private AllReviewDTO convertToDTO(AllReview review) {
        AllReviewDTO reviewDTO = new AllReviewDTO();
        reviewDTO.setReviewId(review.getReviewId());
        reviewDTO.setRating(review.getRating());
        reviewDTO.setReviewText(review.getReviewText());
        reviewDTO.setUserId(review.getUserId());
        reviewDTO.setSubcategoryId(review.getSubcategoryId());
        reviewDTO.setResultId(review.getResultId());
        reviewDTO.setNickname(review.getNickname());
        reviewDTO.setSubcategoryName(getSubcategoryNameById(review.getSubcategoryId()));
        return reviewDTO;
    }

    private String getSubcategoryNameById(int subcategoryId) {
        switch (subcategoryId) {
            case 1: return "소주제1";
            case 2: return "소주제2";
            default: return "알 수 없는 소주제";
        }
    }
}
