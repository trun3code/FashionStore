package com.store.fashion.dto;

import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.store.fashion.model.Review;

@Data
@NoArgsConstructor
@JsonRootName("User")
public class ReviewDto {
    private Integer productId;
    private Integer rating;
    private String comment;
    private String image;
    private Timestamp createAt;
    private Timestamp updateAt;
    private UserDto user;

    public ReviewDto(Review review) {
        productId = review.getProductId();
        rating = review.getRating();
        comment = review.getComment();
        image = review.getImage();
        createAt = review.getCreateAt();
        updateAt = review.getUpdateAt();
        if (review.getUser() != null)
            user = new UserDto(review.getUser());
    }
}
