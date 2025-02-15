package com.store.fashion.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.store.fashion.model.Category;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("Category")
public class CategoryDto {
    private String gender;
    private String brand;
    private String category;

    public CategoryDto(List<Category> categories) {
        for (int i = 0; i < categories.size(); i++) {
            if (categories.get(i).getType().equals("brand")) {
                brand = categories.get(i).getName();
                continue;
            }
            if (categories.get(i).getType().equals("gender")) {
                gender = categories.get(i).getName();
                continue;
            }
            category = categories.get(i).getName();
        }
    }
}
