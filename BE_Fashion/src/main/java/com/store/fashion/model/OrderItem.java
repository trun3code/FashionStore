package com.store.fashion.model;

import com.store.fashion.dto.OrderItemDto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer orderId;
    private Integer amount;
    private Integer price;
    @ManyToOne
    @JoinColumn(name = "itemId")
    private ProductItem item;

    public OrderItem(OrderItemDto orderItemDto) {
        amount = orderItemDto.getAmount();
        price = orderItemDto.getPrice();
        item = new ProductItem();
        item.setId(orderItemDto.getItem().getId());
    }
}
