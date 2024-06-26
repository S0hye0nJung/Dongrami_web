package com.lec.entity;

import javax.persistence.*;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

@Entity
@Table(name = "review")
public class AllReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reviewId;

    private int rating;
    private String reviewText;
    private String userId; // varchar 타입
    private int subcategoryId;
    private int resultId;
    private String nickname;
    private Date reviewCreate;
    private Date reviewModify;

    // Getters and setters

    public int getReviewId() {
        return reviewId;
    }

    public void setReviewId(int reviewId) {
        this.reviewId = reviewId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getSubcategoryId() {
        return subcategoryId;
    }

    public void setSubcategoryId(int subcategoryId) {
        this.subcategoryId = subcategoryId;
    }

    public int getResultId() {
        return resultId;
    }

    public void setResultId(int resultId) {
        this.resultId = resultId;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Date getReviewCreate() {
        return reviewCreate;
    }

    public void setReviewCreate(Date reviewCreate) {
        this.reviewCreate = reviewCreate;
    }

    public Date getReviewModify() {
        return reviewModify;
    }

    public void setReviewModify(Date reviewModify) {
        this.reviewModify = reviewModify;
    }
}
