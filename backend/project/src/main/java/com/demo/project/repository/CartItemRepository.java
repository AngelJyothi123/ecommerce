package com.demo.project.repository;

import com.demo.project.entity.CartItem;
import com.demo.project.entity.Cart;
import com.demo.project.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.cartId = :cartId AND ci.product.productId = :productId")
    Optional<CartItem> findByCartIdAndProductId(@Param("cartId") Long cartId, @Param("productId") Long productId);
    
    void deleteByCart(Cart cart);
}
