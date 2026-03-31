package com.demo.project.dto;

import com.demo.project.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {
    
    @NotNull(message = "Order status is required")
    private Order.OrderStatus status;
}
