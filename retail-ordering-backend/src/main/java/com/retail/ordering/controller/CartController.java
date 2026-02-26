package com.retail.ordering.controller;

import com.retail.ordering.dto.CartItemRequest;
import com.retail.ordering.dto.CartResponse;
import com.retail.ordering.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addItemToCart(Authentication authentication,
            @Valid @RequestBody CartItemRequest cartItemRequest) {
        return ResponseEntity.ok(cartService.addItemToCart(authentication, cartItemRequest));
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateItemQuantity(Authentication authentication,
            @Valid @RequestBody CartItemRequest cartItemRequest) {
        return ResponseEntity.ok(cartService.updateItemQuantity(authentication, cartItemRequest));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartResponse> removeItemFromCart(Authentication authentication,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(authentication, productId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<CartResponse> clearCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.clearCart(authentication));
    }
}
