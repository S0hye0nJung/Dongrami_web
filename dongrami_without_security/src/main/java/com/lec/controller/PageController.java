package com.lec.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.lec.service.ReviewService;
import com.lec.dto.ReviewDTO;
import com.lec.entity.Review;

import java.util.List;
import java.util.Map;

@Controller
public class PageController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/comments")
    public String commentsPage() {
        return "comments";
    }

    @GetMapping("/result")
    public String resultPage() {
        return "result";
    }

    @GetMapping("/review")
    public String reviewPage() {
        return "review";
    }

    @GetMapping("/mypage")
    public String myPage() {
        return "mypage";
    }

    @GetMapping("/")
    public String indexPage() {
        return "index";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/topic")
    public String topicPage() {
        return "topicpage";
    }

    @GetMapping("/vote")
    public String votePage() {
        return "votepage";
    }

    // 리뷰 제출 처리
    @PostMapping("/submitReview")
    @ResponseBody
    public ResponseEntity<?> submitReview(@RequestBody ReviewDTO reviewDTO) {
        try {
            Review newReview = reviewService.saveReview(reviewDTO);
            return ResponseEntity.ok(Map.of(
                "message", "리뷰가 성공적으로 제출되었습니다.",
                "newReview", newReview // 새로운 리뷰 데이터를 응답에 포함
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "message", "리뷰 제출에 실패했습니다.",
                "error", e.getMessage()
            ));
        }
    }

    // 리뷰 가져오기
    @GetMapping("/getReviews")
    @ResponseBody
    public List<Review> getReviews() {
        return reviewService.getAllReviews();
    }

    // 리뷰 수정 처리
    @PutMapping("/updateReview/{id}")
    @ResponseBody
    public ResponseEntity<?> updateReview(@PathVariable Integer id, @RequestBody ReviewDTO reviewDTO) {
        try {
            Review updatedReview = reviewService.updateReview(id, reviewDTO);
            return ResponseEntity.ok(Map.of(
                "message", "리뷰가 성공적으로 수정되었습니다.",
                "updatedReview", updatedReview
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "message", "리뷰 수정에 실패했습니다.",
                "error", e.getMessage()
            ));
        }
    }

    // 리뷰 삭제 처리
    @DeleteMapping("/deleteReview/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteReview(@PathVariable Integer id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok(Map.of(
                "message", "리뷰가 성공적으로 삭제되었습니다."
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "message", "리뷰 삭제에 실패했습니다.",
                "error", e.getMessage()
            ));
        }
    }
}
