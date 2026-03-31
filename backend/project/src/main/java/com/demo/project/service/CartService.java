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
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartDto getUserCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> createCartForUser(user));

        List<CartItemDto> cartItems = cart.getCartItems().stream()
                .map(this::convertToCartItemDto)
                .collect(Collectors.toList());

        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDto.builder()
                .cartId(cart.getCartId())
                .cartItems(cartItems)
                .totalAmount(totalAmount)
                .build();
    }

    @Transactional
    public CartDto addToCart(String email, AddToCartRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (product.getStock() == 0) {
            throw new BadRequestException("Product is out of stock");
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> createCartForUser(user));

        CartItem existingCartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(null);

        if (existingCartItem != null) {
            int newQuantity = existingCartItem.getQuantity() + request.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new BadRequestException("Insufficient stock. Available: " + product.getStock());
            }
            existingCartItem.setQuantity(newQuantity);
            cartItemRepository.save(existingCartItem);
        } else {
            if (product.getStock() < request.getQuantity()) {
                throw new BadRequestException("Insufficient stock. Available: " + product.getStock());
            }

            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(cartItem);
        }

        return getUserCart(email);
    }

    @Transactional
    public CartDto updateCartItem(String email, Long itemId, Integer quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart Item", "id", itemId));

        if (!cartItem.getCart().getUser().getUserId().equals(user.getUserId())) {
            throw new BadRequestException("You can only update your own cart items");
        }

        Product product = cartItem.getProduct();
        if (product.getStock() < quantity) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStock());
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return getUserCart(email);
    }

    @Transactional
    public CartDto removeFromCart(String email, Long itemId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart Item", "id", itemId));

        if (!cartItem.getCart().getUser().getUserId().equals(user.getUserId())) {
            throw new BadRequestException("You can only remove your own cart items");
        }

        cartItemRepository.delete(cartItem);
        return getUserCart(email);
    }

    @Transactional
    public void clearCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart not found"));

        cartItemRepository.deleteByCart(cart);
    }

    private Cart createCartForUser(User user) {
        Cart cart = Cart.builder()
                .user(user)
                .build();
        return cartRepository.save(cart);
    }

    private CartItemDto convertToCartItemDto(CartItem cartItem) {
        ProductDto productDto = ProductDto.builder()
                .productId(cartItem.getProduct().getProductId())
                .name(cartItem.getProduct().getName())
                .description(cartItem.getProduct().getDescription())
                .price(cartItem.getProduct().getPrice())
                .stock(cartItem.getProduct().getStock())
                .imageUrl(cartItem.getProduct().getImageUrl())
                .build();

        return CartItemDto.builder()
                .cartItemId(cartItem.getCartItemId())
                .product(productDto)
                .quantity(cartItem.getQuantity())
                .build();
    }
}
