package com.retail.ordering.service;

import com.retail.ordering.dto.PaymentRequest;
import com.retail.ordering.dto.PaymentResponse;
import com.retail.ordering.entity.*;
import com.retail.ordering.exception.BadRequestException;
import com.retail.ordering.exception.ResourceNotFoundException;
import com.retail.ordering.repository.OrderRepository;
import com.retail.ordering.repository.PaymentRepository;
import com.retail.ordering.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    private final Random random = new Random();

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException(
                    "Payment can only be processed for PENDING orders. Current status: " + order.getStatus());
        }

        // Check if payment already exists for this order
        if (paymentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new BadRequestException("Payment already exists for this order.");
        }

        // Set order to PROCESSING
        order.setStatus(OrderStatus.PROCESSING);
        orderRepository.save(order);

        // Simulate payment processing (mock gateway)
        boolean paymentSuccess = simulatePaymentGateway(request.getPaymentMethod());

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .paymentMethod(request.getPaymentMethod().toUpperCase())
                .cardLast4(request.getCardLast4())
                .build();

        if (paymentSuccess) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            payment.setPaidAt(LocalDateTime.now());
            order.setStatus(OrderStatus.CONFIRMED);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setTransactionId(null);

            // Restore stock on payment failure
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
            order.setStatus(OrderStatus.CANCELLED);
        }

        orderRepository.save(order);
        Payment savedPayment = paymentRepository.save(payment);
        return mapToPaymentResponse(savedPayment);
    }

    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order id: " + orderId));
        return mapToPaymentResponse(payment);
    }

    /**
     * Mock payment gateway: 90% success rate.
     * COD always succeeds.
     */
    private boolean simulatePaymentGateway(String method) {
        if ("COD".equalsIgnoreCase(method)) {
            return true;
        }
        // 90% chance of success for CARD and UPI
        return random.nextInt(100) < 90;
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .cardLast4(payment.getCardLast4())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
