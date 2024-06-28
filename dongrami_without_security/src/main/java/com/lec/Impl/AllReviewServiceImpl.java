package com.lec.Impl;

import com.lec.entity.Member;
import com.lec.entity.Review;
import com.lec.repository.AllReviewRepository;
import com.lec.repository.MemberRepository;
import com.lec.service.AllReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AllReviewServiceImpl implements AllReviewService {

    @Autowired
    private AllReviewRepository allReviewRepository;

    @Autowired
    private MemberRepository memberRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public Review saveReview(Review review) {
        entityManager.persist(review); // Review 객체를 저장
        return review;
    }

    @Override
    public List<Review> getAllReviewsWithNicknames() {
        List<Review> reviews = allReviewRepository.findAll(); // 모든 리뷰를 조회

        // 리뷰에 대한 멤버의 닉네임 정보 및 subcategory의 bubble_slack_name 추가
        return reviews.stream()
                .peek(review -> {
                    Member member = memberRepository.findById(review.getMember().getUserId()).orElse(null);
                    if (member != null) {
                        review.getMember().setNickname(member.getNickname());
                    }
                    review.getSubcategory().setBubble_slak_name(review.getSubcategory().getBubble_slak_name());
                })
                .collect(Collectors.toList());
    }

    // 리뷰 ID로 조회하는 메서드 추가
    @Override
    public Review getReviewById(int id) {
        return allReviewRepository.findById(id).orElse(null);
    }

    // 리뷰 삭제 메서드 구현
    @Override
    @Transactional
    public void deleteReview(int id) {
        allReviewRepository.deleteById(id);
    }
}
