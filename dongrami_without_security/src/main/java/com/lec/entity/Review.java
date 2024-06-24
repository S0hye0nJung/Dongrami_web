package com.lec.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "review")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private int reviewId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "subcategory_id")
    private int subcategoryId;

    @Column(name = "rating")
    private int rating;

    @Column(name = "review_text", columnDefinition = "TEXT")
    private String reviewText;

    @Column(name = "review_create")
    private Date reviewCreate;

    @Column(name = "review_modify")
    private Date reviewModify;
    
    @Column(name = "nickname")
    private String nickname;
}
