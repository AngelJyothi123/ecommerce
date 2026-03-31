package com.demo.project.controller;

import com.demo.project.dto.OrderDto;
import com.demo.project.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(@AuthenticationPrincipal UserDetails userDetails) {
        OrderDto order = orderService.checkout(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getUserOrders(@AuthenticationPrincipal UserDetails userDetails) {
        List<OrderDto> orders = orderService.getUserOrders(userDetails.getUsername());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        OrderDto order = orderService.getOrderById(orderId, userDetails.getUsername());
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        OrderDto order = orderService.cancelOrder(orderId, userDetails.getUsername());
        return ResponseEntity.ok(order);
    }
}
