package com.lec.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lec.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer>{

}
