package com.lec.dto;

import lombok.Data;

@Data
public class ReviewDTO {
    private int userId;
    private int subcategoryId;
    private int rating;
    private String reviewText;
    private String nickname; // nickname 필드 추가
}
