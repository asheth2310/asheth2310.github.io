package com.asheth.orderservice;

import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final Map<String, Order> orders = new HashMap<>();
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OrderController(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        order.setId(UUID.randomUUID().toString());
        order.setStatus("PENDING");
        orders.put(order.getId(), order);
        kafkaTemplate.send("order-events", "ORDER_CREATED:" + order.getId());
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable String id) {
        Order order = orders.get(id);
        if (order == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestParam String status) {
        Order order = orders.get(id);
        if (order == null) return ResponseEntity.notFound().build();
        order.setStatus(status);
        kafkaTemplate.send("order-events", "ORDER_UPDATED:" + id + ":" + status);
        return ResponseEntity.ok(order);
    }
}
