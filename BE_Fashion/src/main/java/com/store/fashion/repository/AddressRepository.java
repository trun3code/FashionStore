package com.store.fashion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.store.fashion.model.Address;

public interface AddressRepository extends JpaRepository<Address, Integer> {
}
