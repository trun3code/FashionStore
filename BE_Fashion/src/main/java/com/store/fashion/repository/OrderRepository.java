package com.store.fashion.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.store.fashion.model.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    public List<Order> findByUserId(int userId);
}
