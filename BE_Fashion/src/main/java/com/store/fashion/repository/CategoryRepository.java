package com.store.fashion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.store.fashion.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
