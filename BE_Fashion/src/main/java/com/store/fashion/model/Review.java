package com.store.fashion.model;

import java.sql.Timestamp;

import com.store.fashion.dto.ReviewDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer productId;
    private Integer rating;
    private String comment;
    private String image;
    private Timestamp createAt;
    private Timestamp updateAt;
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    public Review(ReviewDto reviewDto) {
        productId = reviewDto.getProductId();
        rating = reviewDto.getRating();
        comment = reviewDto.getComment();
        user = new User();
        user.setId(reviewDto.getUser().getId());
    }
}
