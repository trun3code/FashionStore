package com.store.fashion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.store.fashion.model.Route;

public interface RouteRepository extends JpaRepository<Route, Integer> {
}