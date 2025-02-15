package com.store.fashion.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("Account")
public class AccountDto {
    private String email;
    private String password;
}
