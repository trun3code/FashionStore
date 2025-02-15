package com.store.fashion.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.store.fashion.model.Address;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("Address")
public class AddressDto {
    private Integer id;
    private String city;
    private String district;
    private String ward;
    private String street;
    private String name;

    public AddressDto(Address address) {
        id = address.getId();
        city = address.getCity();
        district = address.getDistrict();
        ward = address.getWard();
        street = address.getStreet();
        name = street + ", " + ward + ", " + district + ", " + city;
    }
}
