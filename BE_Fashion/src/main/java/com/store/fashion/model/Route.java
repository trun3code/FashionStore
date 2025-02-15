package com.store.fashion.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import com.store.fashion.dto.RouteDto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer status;
    private Timestamp createAt;
    private Timestamp updateAt;
    private String start;
    private String end;
    @OneToMany
    @JoinColumn(name = "routeId")
    private List<Order> orders;

    public Route(RouteDto routeDto) {
        id = routeDto.getId();
        status = routeDto.getStatus();
        start = routeDto.getStart();
        end = routeDto.getEnd();
        orders = new ArrayList<>();
        if (routeDto.getOrders() == null)
            return;
        for (var orderDto : routeDto.getOrders()) {
            var order = new Order();
            order.setId(orderDto.getId());
            order.setRouteIndex(orderDto.getRouteIndex());
            orders.add(order);
        }
    }
}
