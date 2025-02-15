package com.store.fashion.dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.store.fashion.model.OrderItem;
import com.store.fashion.model.ProductItem;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("OrderItem")
public class OrderItemDto {
    private Integer amount;
    private Integer price;
    private String size;
    private String color;
    private String name;
    private String image;
    private ProductItem item;

    public OrderItemDto(OrderItem orderItem) {
        amount = orderItem.getAmount();
        price = orderItem.getPrice();
        if (orderItem.getItem() == null)
            return;
        item = orderItem.getItem();
        size = orderItem.getItem().getSize();
        color = orderItem.getItem().getColor();
        name = orderItem.getItem().getProduct().getProductName();
        image = orderItem.getItem().getProductImage();
    }
}
