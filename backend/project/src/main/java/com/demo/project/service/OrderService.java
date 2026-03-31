package com.demo.project.service;

import com.demo.project.dto.*;
import com.demo.project.entity.*;
import com.demo.project.exception.BadRequestException;
import com.demo.project.exception.ResourceNotFoundException;
import com.demo.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    @Transactional
    public OrderDto checkout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart not found"));

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cannot checkout with empty cart");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getCartItems()) {
            BigDecimal itemTotal = cartItem.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status(Order.OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        for (CartItem cartItem : cart.getCartItems()) {
            productService.updateStock(cartItem.getProduct().getProductId(), cartItem.getQuantity());

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getProduct().getPrice())
                    .build();
            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteByCart(cart);

        return convertToDto(savedOrder);
    }

    public List<OrderDto> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        return orderRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (!order.getUser().getUserId().equals(user.getUserId())) {
            throw new BadRequestException("You can only view your own orders");
        }

        return convertToDto(order);
    }

    @Transactional
    public OrderDto cancelOrder(Long orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (!order.getUser().getUserId().equals(user.getUserId())) {
            throw new BadRequestException("You can only cancel your own orders");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new BadRequestException("Only pending orders can be cancelled");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);

        for (OrderItem orderItem : updatedOrder.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setStock(product.getStock() + orderItem.getQuantity());
            productService.updateProductStock(product);
        }

        return convertToDto(updatedOrder);
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setStatus(request.getStatus());
        Order updatedOrder = orderRepository.save(order);

        return convertToDto(updatedOrder);
    }

    private OrderDto convertToDto(Order order) {
        UserDto userDto = UserDto.builder()
                .userId(order.getUser().getUserId())
                .name(order.getUser().getName())
                .email(order.getUser().getEmail())
                .role(order.getUser().getRole())
                .build();

        List<OrderItemDto> orderItems = order.getOrderItems().stream()
                .map(this::convertToOrderItemDto)
                .collect(Collectors.toList());

        return OrderDto.builder()
                .orderId(order.getOrderId())
                .user(userDto)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .orderItems(orderItems)
                .build();
    }

    private OrderItemDto convertToOrderItemDto(OrderItem orderItem) {
        ProductDto productDto = ProductDto.builder()
                .productId(orderItem.getProduct().getProductId())
                .name(orderItem.getProduct().getName())
                .description(orderItem.getProduct().getDescription())
                .price(orderItem.getProduct().getPrice())
                .stock(orderItem.getProduct().getStock())
                .imageUrl(orderItem.getProduct().getImageUrl())
                .build();

        return OrderItemDto.builder()
                .orderItemId(orderItem.getOrderItemId())
                .product(productDto)
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();
    }
}
