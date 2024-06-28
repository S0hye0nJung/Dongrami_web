package com.lec.controller;

import com.lec.dto.AllReviewDTO;
import com.lec.entity.Member;
import com.lec.entity.Review;
import com.lec.entity.Subcategory;
import com.lec.entity.SavedResult;
import com.lec.service.AllReviewService;
import com.lec.service.SubcategoryService;
import com.lec.repository.MemberRepository;
import com.lec.repository.SavedResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
@RequestMapping("/allreview")
public class AllReviewController {

    private static final Logger logger = LoggerFactory.getLogger(AllReviewController.class);

    @Autowired
    private AllReviewService allReviewService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SubcategoryService subcategoryService;

    @Autowired
    private SavedResultRepository savedResultRepository;

    @PostMapping("/submit")
    public ResponseEntity<Review> submitReview(@RequestBody AllReviewDTO reviewDTO) {
        logger.debug("Received reviewDTO: {}", reviewDTO);

        if (reviewDTO.getUserId() == null) {
            logger.error("User ID is null in reviewDTO: {}", reviewDTO);
            return ResponseEntity.badRequest().body(null);
        }

        Member member = memberRepository.findById(reviewDTO.getUserId()).orElse(null);
        if (member == null) {
            logger.error("Member not found for user ID: {}", reviewDTO.getUserId());
            return ResponseEntity.badRequest().build();
        }

        Optional<Subcategory> subcategoryOptional = subcategoryService.findById(reviewDTO.getSubcategoryId());
        if (!subcategoryOptional.isPresent()) {
            logger.error("Subcategory not found for ID: {}", reviewDTO.getSubcategoryId());
            return ResponseEntity.badRequest().build();
        }

        Subcategory subcategory = subcategoryOptional.get();
        SavedResult savedResult = null;

        if (reviewDTO.getResultId() != null) {
            savedResult = savedResultRepository.findById(reviewDTO.getResultId()).orElse(null);
            if (savedResult == null) {
                logger.error("SavedResult not found for ID: {}", reviewDTO.getResultId());
                return ResponseEntity.badRequest().build();
            }
        }

        Review review = Review.builder()
                .rating(reviewDTO.getRating())
                .reviewText(reviewDTO.getReviewText())
                .reviewCreate(new Date())
                .reviewModify(new Date())
                .member(member)
                .subcategory(subcategory)
                .savedResult(savedResult) // null 또는 올바른 savedResult 설정
                .build();

        Review savedReview = allReviewService.saveReview(review);
        logger.debug("Review saved: {}", savedReview);

        return ResponseEntity.ok(savedReview);
    }

    // 업데이트 매핑 추가
    @PutMapping("/update/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable("id") int id, @RequestBody AllReviewDTO reviewDTO) {
        logger.debug("Received update request for review ID: {}", id);
        logger.debug("ReviewDTO: {}", reviewDTO);

        Review existingReview = allReviewService.getReviewById(id);
        if (existingReview == null) {
            logger.error("Review not found for ID: {}", id);
            return ResponseEntity.notFound().build();
        }

        Member member = memberRepository.findById(reviewDTO.getUserId()).orElse(null);
        if (member == null) {
            logger.error("Member not found for user ID: {}", reviewDTO.getUserId());
            return ResponseEntity.badRequest().build();
        }

        Optional<Subcategory> subcategoryOptional = subcategoryService.findById(reviewDTO.getSubcategoryId());
        if (!subcategoryOptional.isPresent()) {
            logger.error("Subcategory not found for ID: {}", reviewDTO.getSubcategoryId());
            return ResponseEntity.badRequest().build();
        }

        Subcategory subcategory = subcategoryOptional.get();
        SavedResult savedResult = null;

        if (reviewDTO.getResultId() != null) {
            savedResult = savedResultRepository.findById(reviewDTO.getResultId()).orElse(null);
            if (savedResult == null) {
                logger.error("SavedResult not found for ID: {}", reviewDTO.getResultId());
                return ResponseEntity.badRequest().build();
            }
        }

        existingReview.setRating(reviewDTO.getRating());
        existingReview.setReviewText(reviewDTO.getReviewText());
        existingReview.setReviewModify(new Date());
        existingReview.setMember(member);
        existingReview.setSubcategory(subcategory);
        existingReview.setSavedResult(savedResult);

        Review updatedReview = allReviewService.saveReview(existingReview);
        logger.debug("Review updated: {}", updatedReview);

        return ResponseEntity.ok(updatedReview);
    }

    // 삭제 매핑 추가
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable("id") int id) {
        logger.debug("Received delete request for review ID: {}", id);

        Review existingReview = allReviewService.getReviewById(id);
        if (existingReview == null) {
            logger.error("Review not found for ID: {}", id);
            return ResponseEntity.notFound().build();
        }

        allReviewService.deleteReview(id);
        logger.debug("Review deleted: {}", id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/json")
    public ResponseEntity<List<Review>> getAllReviewsJson() {
        List<Review> reviews = allReviewService.getAllReviewsWithNicknames();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping
    public String getAllReviews(Model model) {
        List<Review> reviews = allReviewService.getAllReviewsWithNicknames();
        model.addAttribute("reviews", reviews);
        return "allreview"; // Thymeleaf 템플릿 이름
    }
}
