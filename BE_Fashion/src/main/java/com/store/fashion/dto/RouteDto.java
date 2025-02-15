package com.store.fashion.dto;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.store.fashion.model.Route;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonRootName("Route")
public class RouteDto {
    private Integer id;
    private Integer status;
    private String start;
    private String end;
    private Timestamp createAt;
    private Timestamp updateAt;
    private List<OrderDto> orders;

    public RouteDto(Route route) {
        id = route.getId();
        status = route.getStatus();
        createAt = route.getCreateAt();
        updateAt = route.getUpdateAt();
        start = route.getStart();
        end = route.getEnd();
        orders = new ArrayList<>();
        for (var order : route.getOrders()) {
            orders.add(new OrderDto(order));
        }
    }
}
