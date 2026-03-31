package com.demo.project.repository;

import com.demo.project.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.stock > 0")
    List<Product> findAvailableProducts();
    
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId AND p.stock > 0")
    List<Product> findAvailableProductsByCategory(@Param("categoryId") Long categoryId);
}
