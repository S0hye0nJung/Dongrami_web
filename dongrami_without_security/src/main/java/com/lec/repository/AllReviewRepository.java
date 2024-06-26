package com.lec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.lec.entity.AllReview;

@Repository
public interface AllReviewRepository extends JpaRepository<AllReview, Integer> {
}
