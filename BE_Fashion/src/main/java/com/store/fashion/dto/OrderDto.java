package com.store.fashion.dto;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.store.fashion.model.Order;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("Order")
public class OrderDto {
    private Integer id;
    private String status;
    private Integer userId;
    private List<OrderItemDto> items;
    private AddressDto shippingAddress;
    private Integer total;
    private Integer amount;
    private String user;
    private String phoneNumber;
    private Integer routeIndex;
    private Timestamp createAt;
    private Timestamp updateAt;

    public OrderDto(Order order) {
        id = order.getId();
        status = order.getStatus();
        userId=order.getUserId();
        createAt = order.getCreateAt();
        updateAt = order.getUpdateAt();
        shippingAddress = new AddressDto(order.getShippingAddress());
        items = new ArrayList<>();
        user = order.getUser();
        phoneNumber = order.getPhoneNumber();
        amount = 0;
        total = 0;
        for (var i : order.getItems()) {
            items.add(new OrderItemDto(i));
            amount += i.getAmount();
            total += i.getPrice();
        }
    }
}
