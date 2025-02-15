package com.store.fashion.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.store.fashion.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("User")
public class UserDto {
    private Integer id;
    private String name;
    private String gender;
    private String avatar;
    private String phoneNumber;
    private AddressDto address;

    public UserDto(User user) {
        id = user.getId();
        name = user.getName();
        gender = user.getGender();
        avatar = user.getAvatar();
        phoneNumber = user.getPhoneNumber();
        if (user.getAddress() != null)
            address = new AddressDto(user.getAddress());
    }
}
