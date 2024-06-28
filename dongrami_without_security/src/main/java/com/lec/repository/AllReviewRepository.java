package com.lec.repository;

import com.lec.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AllReviewRepository extends JpaRepository<Review, Integer> {
}
