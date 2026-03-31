package com.demo.project.dto;

import com.demo.project.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long orderId;
    private UserDto user;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemDto> orderItems;
}
