package com.store.fashion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.store.fashion.model.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}