package com.demo.project.repository;

import com.demo.project.entity.OrderItem;
import com.demo.project.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
    List<OrderItem> findByOrderOrderId(Long orderId);
}
