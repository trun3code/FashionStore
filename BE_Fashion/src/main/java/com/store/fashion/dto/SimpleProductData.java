package com.store.fashion.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.store.fashion.model.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("SimpleProductData")
public class SimpleProductData {
    private Integer id;
    private String productName;
    private String category;

    public SimpleProductData(Product product) {
        id = product.getId();
        category="";
        productName = product.getProductName();
        for (var c : product.getCategories()) 
            category+=c.getName()+" ";
    }
}
