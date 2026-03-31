package com.demo.project.repository;

import com.demo.project.entity.Order;
import com.demo.project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserUserId(Long userId);
    List<Order> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findAll();
}
