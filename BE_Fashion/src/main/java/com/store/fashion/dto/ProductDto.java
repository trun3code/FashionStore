package com.store.fashion.dto;

import java.sql.Timestamp;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.store.fashion.model.Product;
import com.store.fashion.model.ProductItem;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("Product")
public class ProductDto {
    private Integer id;
    private String productName;
    private String productImage;
    private Integer price;
    private Integer sold;
    private Integer sale;
    private String description;
    private Float rating;
    private CategoryDto category;
    private List<ProductItem> items;
    private Timestamp createAt;
    private Timestamp updateAt;

    public ProductDto(Product product) {
        id = product.getId();
        productName = product.getProductName();
        productImage = product.getProductImage();
        price = product.getPrice();
        sold = product.getSold();
        sale = product.getSale();
        description = product.getDescription();
        rating = product.getRating();
        createAt = product.getCreateAt();
        updateAt = product.getUpdateAt();
        category = new CategoryDto(product.getCategories());
        items = product.getItems();
    }
}
