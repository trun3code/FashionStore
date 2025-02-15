package com.store.fashion.model;

import java.sql.Timestamp;
import com.store.fashion.dto.UserDto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String role;
    private String name;
    private String gender;
    private String avatar;
    private String phoneNumber;
    private Timestamp createAt;
    private Timestamp updateAt;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "addressId")
    private Address address;
    @Transient
    private String email;

    public User(UserDto userDto) {
        name = userDto.getName();
        gender = userDto.getGender();
        avatar = userDto.getAvatar();
        phoneNumber = userDto.getPhoneNumber();
    }
}
