package com.store.fashion.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.store.fashion.model.Review;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("SimpleReviewData")
public class SimpleReviewData {
    private Integer userId;
    private Integer productId;
    private Integer rating;

    public SimpleReviewData(Review review) {
        userId = review.getUser().getId();
        productId = review.getProductId();
        rating = review.getRating();
    }
}
