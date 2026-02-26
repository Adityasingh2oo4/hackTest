package com.retail.ordering.service;

import com.retail.ordering.dto.CartItemRequest;
import com.retail.ordering.dto.CartItemResponse;
import com.retail.ordering.dto.CartResponse;
import com.retail.ordering.entity.Cart;
import com.retail.ordering.entity.CartItem;
import com.retail.ordering.entity.Product;
import com.retail.ordering.entity.User;
import com.retail.ordering.exception.BadRequestException;
import com.retail.ordering.exception.ResourceNotFoundException;
import com.retail.ordering.repository.CartRepository;
import com.retail.ordering.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    public CartResponse getCart(Authentication authentication) {
        User user = authService.getAuthenticatedUserEntity(authentication);
        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addItemToCart(Authentication authentication, CartItemRequest cartItemRequest) {
        User user = authService.getAuthenticatedUserEntity(authentication);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(cartItemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + cartItemRequest.getProductId()));

        if (product.getStock() < cartItemRequest.getQuantity()) {
            throw new BadRequestException(
                    "Insufficient stock for product: " + product.getName() + ". Available: " + product.getStock());
        }

        Optional<CartItem> existingCartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingCartItem.isPresent()) {
            CartItem item = existingCartItem.get();
            int newQuantity = item.getQuantity() + cartItemRequest.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new BadRequestException(
                        "Insufficient stock for product: " + product.getName() + " for total quantity " + newQuantity);
            }
            item.setQuantity(newQuantity);
        } else {
            CartItem newCartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(cartItemRequest.getQuantity())
                    .build();
            cart.getCartItems().add(newCartItem);
        }

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse updateItemQuantity(Authentication authentication, CartItemRequest cartItemRequest) {
        User user = authService.getAuthenticatedUserEntity(authentication);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(cartItemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + cartItemRequest.getProductId()));

        if (product.getStock() < cartItemRequest.getQuantity()) {
            throw new BadRequestException(
                    "Insufficient stock for product: " + product.getName() + ". Available: " + product.getStock());
        }

        CartItem existingCartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));

        existingCartItem.setQuantity(cartItemRequest.getQuantity());

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse removeItemFromCart(Authentication authentication, Long productId) {
        User user = authService.getAuthenticatedUserEntity(authentication);
        Cart cart = getOrCreateCart(user);

        boolean removed = cart.getCartItems().removeIf(item -> item.getProduct().getId().equals(productId));

        if (!removed) {
            throw new ResourceNotFoundException("Product with id " + productId + " not found in cart");
        }

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse clearCart(Authentication authentication) {
        User user = authService.getAuthenticatedUserEntity(authentication);
        Cart cart = getOrCreateCart(user);

        cart.getCartItems().clear();

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    @Transactional
    public void clearCartForUser(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    protected Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getCartItems().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        BigDecimal totalValue = items.stream()
                .map(CartItemResponse::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(items)
                .totalCartValue(totalValue)
                .build();
    }

    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        BigDecimal subTotal = cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
        return CartItemResponse.builder()
                .productId(cartItem.getProduct().getId())
                .productName(cartItem.getProduct().getName())
                .price(cartItem.getProduct().getPrice())
                .quantity(cartItem.getQuantity())
                .subTotal(subTotal)
                .build();
    }
}
