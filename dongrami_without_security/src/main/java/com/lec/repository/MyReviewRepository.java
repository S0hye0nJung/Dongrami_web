package com.lec.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lec.entity.Review;

public interface MyReviewRepository extends JpaRepository<Review, Integer>{

}
