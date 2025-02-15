package com.store.fashion.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.store.fashion.model.Order;
import com.store.fashion.model.OrderItem;
import com.store.fashion.model.Route;
import com.store.fashion.repository.AddressRepository;
import com.store.fashion.repository.OrderRepository;
import com.store.fashion.repository.ProductItemRepository;
import com.store.fashion.repository.RouteRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private ProductItemRepository productItemRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private ProductService productService;

    // get all
    public List<Order> getAllOrder() {
        var rs = orderRepository.findAll();
        Collections.reverse(rs);
        return rs;
    }

    // get by user id
    public List<Order> getAllOrderByUserId(int userId) {
        var rs = orderRepository.findByUserId(userId);
        Collections.reverse(rs);
        return rs;
    }

    // create order
    public boolean createOrder(Order order) {
        try {
            order.setId(0);
            order.setStatus("pending");
            order.setCreateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
            if (order.getShippingAddress().getId() != null)
                order.setShippingAddress(addressRepository.findById(order.getShippingAddress().getId()).get());
            var orderItems = new ArrayList<OrderItem>();
            for (var orderItem : order.getItems()) {
                var productItem = productItemRepository.findById(orderItem.getItem().getId()).get();
                boolean isValid = productService.subtractProductItemAmount(productItem.getId(), orderItem.getAmount());
                if (!isValid)
                    continue;
                int productItemPrice = (productItem.getBonusPrice() + productItem.getProduct().getPrice())
                        * (100 - productItem.getProduct().getSale()) / 100;
                orderItem.setPrice((int) (1.1 * orderItem.getAmount() * productItemPrice));
                orderItems.add(orderItem);
            }
            order.setItems(orderItems);
            orderRepository.save(order);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // get order
    public Order getOrder(int orderId) {
        var rs = orderRepository.findById(orderId);
        return rs.isEmpty() ? null : rs.get();
    }

    // update order status
    public boolean updateOrderStatus(int orderId, String status){
        return updateOrderStatus(orderId, status,null,null);
    }

    public boolean updateOrderStatus(int orderId, String status, Integer routeId,Integer routeIndex) {
        Order order = getOrder(orderId);
        if (order == null)
            return false;
        Integer prevRouteId = order.getRouteId();
        switch (status) {
            case "cancel":
                return cancelOrder(orderId);
            case "delivered":
                routeId = prevRouteId;
                for (var orderItem : order.getItems())
                    productService.addProductSold(orderItem.getItem().getProduct().getId(), orderItem.getAmount());
                break;
        }
        order.setRouteIndex(routeIndex);
        order.setStatus(status);
        order.setRouteId(routeId);
        order.setUpdateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
        orderRepository.save(order);
        if (status.equals("pending")) {
            Route route = getRoute(prevRouteId);
            if (route != null && route.getOrders().size() == 0)
                removeRoute(prevRouteId);
        }
        return true;
    }

    // cancel order
    public boolean cancelOrder(int orderId) {
        Order order = getOrder(orderId);
        if (order == null)
            return false;
        orderRepository.deleteById(orderId);
        for (var item : order.getItems()) {
            productService.addProductItemAmount(item.getItem().getId(), item.getAmount());
        }
        return true;
    }

    // get all route
    public List<Route> getAllRoute() {
        var rs = routeRepository.findAll();
        Collections.reverse(rs);
        for (Route route : rs) {
            Collections.sort(route.getOrders(),(o1,o2)-> {
                if(o2.getRouteIndex()==null) return 0;
                return o2.getRouteIndex().compareTo(o1.getRouteIndex());
            });        }
        return rs;
    }

    // get route
    public Route getRoute(Integer routeId) {
        if (routeId == null)
            return null;
        var temp = routeRepository.findById(routeId);
        if (temp.isEmpty())
            return null;
        Route route=temp.get();
        Collections.sort(route.getOrders(),(o1,o2)-> {
            if(o2.getRouteIndex()==null) return 0;
            return o2.getRouteIndex().compareTo(o1.getRouteIndex());
        });
        return route;
    }

    // create route
    public Route createRoute(Route route) {
        try {
            route.setId(0);
            route.setStatus(0);
            route.setCreateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
            List<Order> orders = route.getOrders();
            route.setOrders(null);
            var rs = routeRepository.save(route);
            for (var order : orders) {
                System.out.println(order.getRouteIndex());
                updateOrderStatus(order.getId(), "delivering", rs.getId(),order.getRouteIndex());
            }
            return rs;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // update route
    public Route completeRoute(int routeId) {
        try {
            Route curRoute = getRoute(routeId);
            curRoute.setStatus(1);
            curRoute.setUpdateAt(new Timestamp(Calendar.getInstance().getTimeInMillis()));
            List<Order> orders = curRoute.getOrders();
            for (var order : orders) {
                updateOrderStatus(order.getId(), "delivered", curRoute.getId(),order.getRouteIndex());
            }
            return routeRepository.save(curRoute);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // delete route
    public boolean removeRoute(int routeId) {
        var temp = routeRepository.findById(routeId);
        if (temp.isEmpty() || temp.get().getStatus() != 0)
            return false;
        for (var order : temp.get().getOrders())
            updateOrderStatus(order.getId(), "pending");
        routeRepository.deleteById(routeId);
        return true;
    }

    // check user purchase product
    public boolean checkBuy(int userId, int productId) {
        var orders = getAllOrderByUserId(userId);
        for (Order order : orders) {
            if (order.getStatus().equals("delivered")) {
                for (OrderItem item : order.getItems()) {
                    if (item.getItem().getProduct().getId() == productId)
                        return true;
                }
            }
        }
        return false;
    }
}
