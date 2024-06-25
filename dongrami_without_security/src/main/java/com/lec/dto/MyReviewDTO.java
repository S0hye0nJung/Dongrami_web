package com.lec.dto;

import java.util.Date;

import com.lec.entity.Review;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

@Getter
@NoArgsConstructor
public class MyReviewDTO {
	
    private int reviewId;
    private String mainCategoryName;
    private String reviewText;
    private Date reviewCreate;

    @Builder
    public MyReviewDTO(int reviewId, String mainCategoryName, String reviewText, Date reviewCreate) {
        this.reviewId = reviewId;
        this.mainCategoryName = mainCategoryName;
        this.reviewText = reviewText;
        this.reviewCreate = reviewCreate;
    }
}
