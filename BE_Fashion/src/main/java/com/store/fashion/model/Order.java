package com.store.fashion.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import com.store.fashion.dto.OrderDto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer userId;
    private Integer routeId;
    private String status;
    private String user;
    private String phoneNumber;
    private Integer routeIndex;
    private Timestamp createAt;
    private Timestamp updateAt;
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "orderId")
    private List<OrderItem> items;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "addressId")
    private Address shippingAddress;

    public Order(OrderDto orderDto) {
        shippingAddress = new Address(orderDto.getShippingAddress());
        userId = orderDto.getUserId();
        user=orderDto.getUser();
        routeIndex=orderDto.getRouteIndex();
        phoneNumber = orderDto.getPhoneNumber();
        items = new ArrayList<>();
        for (var i : orderDto.getItems())
            items.add(new OrderItem(i));
    }
}
