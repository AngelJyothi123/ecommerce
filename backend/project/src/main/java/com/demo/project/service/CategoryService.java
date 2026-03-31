package com.demo.project.service;

import com.demo.project.dto.CategoryDto;
import com.demo.project.entity.Category;
import com.demo.project.exception.BadRequestException;
import com.demo.project.exception.ResourceNotFoundException;
import com.demo.project.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return convertToDto(category);
    }

    public CategoryDto createCategory(CategoryDto categoryDto) {
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new BadRequestException("Category with name '" + categoryDto.getName() + "' already exists");
        }

        Category category = Category.builder()
                .name(categoryDto.getName())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return convertToDto(savedCategory);
    }

    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        if (!existingCategory.getName().equals(categoryDto.getName()) && 
            categoryRepository.existsByName(categoryDto.getName())) {
            throw new BadRequestException("Category with name '" + categoryDto.getName() + "' already exists");
        }

        existingCategory.setName(categoryDto.getName());
        Category updatedCategory = categoryRepository.save(existingCategory);
        return convertToDto(updatedCategory);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        categoryRepository.delete(category);
    }

    private CategoryDto convertToDto(Category category) {
        return CategoryDto.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .build();
    }
}
