package com.store.fashion.controller;

import java.util.List;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.store.fashion.dto.OrderDto;
import com.store.fashion.dto.OrderStatus;
import com.store.fashion.dto.RouteDto;
import com.store.fashion.model.Order;
import com.store.fashion.model.Route;
import com.store.fashion.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/order")
@Tag(name = "Order API")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Operation(summary = "Danh sách tất cả các đơn đặt hàng", description = "Lấy toàn bộ đơn đặt hàng")
    @GetMapping("")
    public List<OrderDto> getAllOrders() {
        return convertToOrderDtoList(orderService.getAllOrder());
    }

    @Operation(summary = "Danh sách tất cả các đơn đặt hàng theo id của người dùng", description = "Lấy toàn bộ đơn đặt hàng theo id của người dùng")
    @GetMapping("/user/{id}")
    public List<OrderDto> getOrdersByUserId(
            @Parameter(description = "id của người dùng", example = "1") @PathVariable(value = "id") int userId) {
        return convertToOrderDtoList(orderService.getAllOrderByUserId(userId));
    }

    @Operation(summary = "Lấy đơn đặt hàng", description = "Lấy đơn đặt hàng theo id")
    @GetMapping("/{id}")
    public OrderDto getOrder(
            @Parameter(description = "id của đơn hàng", example = "1") @PathVariable(value = "id") int orderId) {
        return new OrderDto(orderService.getOrder(orderId));
    }

    @Operation(summary = "Tạo đơn đặt hàng", description = "Tạo đơn đặt hàng mới")
    @PostMapping("/new")
    public ResponseEntity<Object> createOrder(@RequestBody OrderDto orderDto) {
        if (orderDto.getItems().size() == 0)
            return ResponseEntity.badRequest().build();
        orderService.createOrder(new Order(orderDto));
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Cập nhật trạng thái đơn hàng", description = "Cập nhật trạng thái đơn hàng")
    @PutMapping("/update")
    public void updateOrderStatus(@RequestBody OrderStatus orderStatus) {
        orderService.updateOrderStatus(orderStatus.getId(), orderStatus.getStatus());
    }

    @Operation(summary = "Hủy đơn đặt hàng", description = "Hủy đơn đặt hàng mà đang trong trạng thái đang xử lý")
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<Object> cancelOrder(
            @Parameter(description = "id của đơn hàng", example = "1") @PathVariable(value = "id") int orderId) {
        return orderService.cancelOrder(orderId)
                ? ResponseEntity.ok().build()
                : ResponseEntity.badRequest().build();
    }

    @Operation(summary = "Kiểm tra người dùng mua hàng hay chưa", description = "Kiểm tra sản phẩm có được người dùng mua hay không")
    @GetMapping("/user/{user-id}/check-buy/{product-id}")
    public ResponseEntity<Object> checkBuy(
            @Parameter(description = "id của người dùng", example = "1") @PathVariable(value = "user-id") int userId,
            @Parameter(description = "id của sản phẩm", example = "1") @PathVariable(value = "product-id") int productId) {
        return orderService.checkBuy(userId, productId)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Tìm kiếm người đơn đặt hàng theo địa chỉ", description = "Trả về danh sách đơn đặt hàng có địa chỉ liên quan đến từ khóa")
    @GetMapping("/search/{str}")
    public List<OrderDto> getSearchUsers(
            @Parameter(description = "Từ khóa", example = "Abc") @PathVariable(value = "str") String keyword) {
        keyword = keyword.trim().toLowerCase();
        var orders = convertToOrderDtoList(orderService.getAllOrder());
        ArrayList<OrderDto> rs = new ArrayList<>();
        for (OrderDto order : orders)
            if (order.getShippingAddress().getName().toLowerCase().contains(keyword)
                    || order.getUser().contains(keyword)
                    || order.getPhoneNumber().contains(keyword))
                rs.add(order);
        return rs;
    }

    @Operation(summary = "Lấy toàn bộ lộ trình đang được giao", description = "Danh sách toàn bộ lộ trình ")
    @GetMapping("/route")
    public List<RouteDto> getAllRoute() {
        return convertToRouteDtoList(orderService.getAllRoute());
    }

    @Operation(summary = "Lấy lộ trình theo id", description = "Lấy lộ trình theo id")
    @GetMapping("/route/{id}")
    public RouteDto getRoute(
            @Parameter(description = "id của lộ trình", example = "1") @PathVariable(value = "id") int routeId) {
        return new RouteDto(orderService.getRoute(routeId));
    }

    @Operation(summary = "Thêm mới lộ trình cho đơn đặt hàng ", description = "Tạo lộ trình mới cho đơn đặt hàng")
    @PostMapping("/route/new")
    public void createRoute(@RequestBody RouteDto route) {
        orderService.createRoute(new Route(route));
    }

    @Operation(summary = "Hoàn thành lộ trình", description = "Thay đổi trạng thái sang đã giao chocho lộ trình")
    @GetMapping("/route/update/{id}")
    public void completeRoute(
            @Parameter(description = "id của lộ trình", example = "1") @PathVariable(value = "id") int routeId) {
        orderService.completeRoute(routeId);
    }

    @Operation(summary = "Xóa lộ trình theo id", description = "Xóa lộ trình có id tương ứng ")
    @DeleteMapping("/route/delete/{id}")
    public void removeRoute(
            @Parameter(description = "id của lộ trình", example = "1") @PathVariable(value = "id") int routeId) {
        orderService.removeRoute(routeId);
    }

    private List<OrderDto> convertToOrderDtoList(List<Order> orders) {
        List<OrderDto> orderDtoLst = new ArrayList<>();
        for (var p : orders)
            orderDtoLst.add(new OrderDto(p));
        return orderDtoLst;
    }

    private List<RouteDto> convertToRouteDtoList(List<Route> routes) {
        List<RouteDto> routeDtoLst = new ArrayList<>();
        for (var r : routes)
            routeDtoLst.add(new RouteDto(r));
        return routeDtoLst;
    }
}
