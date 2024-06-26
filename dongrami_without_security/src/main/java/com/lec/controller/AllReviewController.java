package com.lec.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lec.service.AllReviewService;
import com.lec.dto.AllReviewDTO;
import com.lec.entity.AllReview;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class AllReviewController {

    @Autowired
    private AllReviewService reviewService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitReview(@RequestBody AllReviewDTO reviewDTO) {
        try {
            AllReview newReview = new AllReview();
            newReview.setUserId(reviewDTO.getUserId());
            newReview.setSubcategoryId(reviewDTO.getSubcategoryId());
            newReview.setRating(reviewDTO.getRating());
            newReview.setReviewText(reviewDTO.getReviewText());
            newReview.setReviewCreate(new Date());
            newReview.setReviewModify(new Date());
            newReview.setResultId(reviewDTO.getResultId());
            newReview.setNickname(reviewDTO.getNickname());
            AllReview savedReview = reviewService.saveReview(newReview);
            return ResponseEntity.ok(Map.of(
                    "message", "리뷰가 성공적으로 제출되었습니다.",
                    "newReview", savedReview
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "message", "리뷰 제출에 실패했습니다.",
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping
    public List<AllReviewDTO> getReviews() {
        return reviewService.getAllReviews();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateReview(@PathVariable("id") String id, @RequestBody AllReviewDTO reviewDTO) {
        Integer reviewId;
        try {
            reviewId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "유효하지 않은 리뷰 ID입니다."
            ));
        }

        try {
            AllReview existingReview = reviewService.getReviewById(reviewId);
            if (existingReview != null) {
                existingReview.setReviewText(reviewDTO.getReviewText());
                existingReview.setRating(reviewDTO.getRating());
                existingReview.setUserId(reviewDTO.getUserId());
                existingReview.setSubcategoryId(reviewDTO.getSubcategoryId());
                existingReview.setResultId(reviewDTO.getResultId());
                existingReview.setNickname(reviewDTO.getNickname());
                existingReview.setReviewModify(new Date());
                AllReview updatedReview = reviewService.saveReview(existingReview);
                return ResponseEntity.ok(Map.of(
                        "message", "리뷰가 성공적으로 수정되었습니다.",
                        "updatedReview", updatedReview
                ));
            } else {
                return ResponseEntity.status(404).body(Map.of(
                        "message", "리뷰를 찾을 수 없습니다."
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "message", "리뷰 수정에 실패했습니다.",
                    "error", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable("id") String id) {
        Integer reviewId;
        try {
            reviewId = Integer.parseInt(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "유효하지 않은 리뷰 ID입니다."
            ));
        }

        try {
            AllReview existingReview = reviewService.getReviewById(reviewId);
            if (existingReview != null) {
                reviewService.deleteReview(reviewId);
                return ResponseEntity.ok(Map.of(
                        "message", "리뷰가 성공적으로 삭제되었습니다."
                ));
            } else {
                return ResponseEntity.status(404).body(Map.of(
                        "message", "삭제할 리뷰를 찾을 수 없습니다."
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "message", "리뷰 삭제에 실패했습니다.",
                    "error", e.getMessage()
            ));
        }
    }
}
