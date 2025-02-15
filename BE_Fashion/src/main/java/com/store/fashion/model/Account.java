package com.store.fashion.model;

import java.sql.Timestamp;
import com.store.fashion.dto.AccountDto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer userId;
    private String email;
    private String password;
    private Timestamp createAt;
    private Timestamp updateAt;

    public Account(AccountDto accountDto) {
        email = accountDto.getEmail();
        password = accountDto.getPassword();
    }
}
