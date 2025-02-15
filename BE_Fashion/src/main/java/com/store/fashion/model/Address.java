package com.store.fashion.model;

import com.store.fashion.dto.AddressDto;
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
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String city;
    private String district;
    private String ward;
    private String street;

    public Address(AddressDto addressDto) {
        id = addressDto.getId();
        city = addressDto.getCity();
        district = addressDto.getDistrict();
        ward = addressDto.getWard();
        street = addressDto.getStreet();
    }
}
