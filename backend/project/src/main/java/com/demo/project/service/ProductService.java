package com.demo.project.service;

import com.demo.project.dto.CategoryDto;
import com.demo.project.dto.CreateProductRequest;
import com.demo.project.dto.ProductDto;
import com.demo.project.entity.Category;
import com.demo.project.entity.Product;
import com.demo.project.exception.BadRequestException;
import com.demo.project.exception.ResourceNotFoundException;
import com.demo.project.repository.CategoryRepository;
import com.demo.project.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return convertToDto(product);
    }

    public List<ProductDto> getProductsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock() != null ? request.getStock() : 0)
                .imageUrl(request.getImageUrl())
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    public ProductDto updateProduct(Long id, CreateProductRequest request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        existingProduct.setName(request.getName());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setStock(request.getStock() != null ? request.getStock() : existingProduct.getStock());
        existingProduct.setImageUrl(request.getImageUrl());
        existingProduct.setCategory(category);

        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDto(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        productRepository.delete(product);
    }

    public void updateStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        
        if (product.getStock() < quantity) {
            throw new BadRequestException("Insufficient stock for product: " + product.getName());
        }
        
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }

    public void updateProductStock(Product product) {
        productRepository.save(product);
    }

    private ProductDto convertToDto(Product product) {
        CategoryDto categoryDto = null;
        if (product.getCategory() != null) {
            categoryDto = CategoryDto.builder()
                    .categoryId(product.getCategory().getCategoryId())
                    .name(product.getCategory().getName())
                    .build();
        }

        return ProductDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .category(categoryDto)
                .build();
    }
}
