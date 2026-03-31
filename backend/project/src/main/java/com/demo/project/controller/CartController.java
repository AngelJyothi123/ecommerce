package com.demo.project.controller;

import com.demo.project.dto.AddToCartRequest;
import com.demo.project.dto.CartDto;
import com.demo.project.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getUserCart(@AuthenticationPrincipal UserDetails userDetails) {
        CartDto cart = cartService.getUserCart(userDetails.getUsername());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        CartDto cart = cartService.addToCart(userDetails.getUsername(), request);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartDto> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal UserDetails userDetails) {
        CartDto cart = cartService.updateCartItem(userDetails.getUsername(), itemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<CartDto> removeFromCart(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails userDetails) {
        CartDto cart = cartService.removeFromCart(userDetails.getUsername(), itemId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
