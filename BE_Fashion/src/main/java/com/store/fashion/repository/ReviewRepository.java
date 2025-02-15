package com.store.fashion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.store.fashion.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    public List<Review> findByProductId(int productId);
    public Review findByUserIdAndProductId(int userId,int productId);
    public long countByUserId(int userId); 
}