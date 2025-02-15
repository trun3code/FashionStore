package com.store.fashion.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.store.fashion.model.ProductItem;
import jakarta.transaction.Transactional;

public interface ProductItemRepository extends JpaRepository<ProductItem, Integer> {
    public List<ProductItem> findByProductId(int productId);

    @Transactional
    public void deleteByProductId(int productId);
}