package com.demo.project.controller;

import com.demo.project.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final ProductRepository productRepository;

    @GetMapping("/db-status")
    public ResponseEntity<Map<String, Object>> getDatabaseStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long productCount = productRepository.count();
            response.put("databaseConnected", true);
            response.put("productCount", productCount);
            response.put("message", "Database connection successful");
            
            if (productCount > 0) {
                response.put("products", productRepository.findAll());
            }
        } catch (Exception e) {
            response.put("databaseConnected", false);
            response.put("error", e.getMessage());
            response.put("message", "Database connection failed");
        }
        
        return ResponseEntity.ok(response);
    }
}
