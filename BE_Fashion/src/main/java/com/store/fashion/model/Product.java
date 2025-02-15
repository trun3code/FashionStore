package com.store.fashion.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import com.store.fashion.dto.ProductDto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String productName;
    private String productImage;
    private Integer price;
    private Integer sale;
    private Integer sold;
    private String description;
    private float rating;
    private Timestamp createAt;
    private Timestamp updateAt;
    @ManyToMany
    @JoinTable(name = "product_category", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;
    @Transient
    private List<ProductItem> items;

    public Product(ProductDto productDto) {
        id = productDto.getId();
        productName = productDto.getProductName();
        productImage = productDto.getProductImage();
        price = productDto.getPrice();
        sale = productDto.getSale();
        description = productDto.getDescription();
        categories = new ArrayList<>();
        categories.add(new Category(productDto.getCategory().getBrand()));
        categories.add(new Category(productDto.getCategory().getGender()));
        categories.add(new Category(productDto.getCategory().getCategory()));
    }
}
