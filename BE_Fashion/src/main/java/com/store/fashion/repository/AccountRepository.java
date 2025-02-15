package com.store.fashion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.store.fashion.model.Account;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    public Account findByEmailAndPassword(String email, String password);
    public Account findByUserId(int userId);
    public boolean existsByEmail(String email);
    public boolean existsByUserIdAndPassword(int userId, String password);
}
