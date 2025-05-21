package com.inventoryManager.service;

import com.inventoryManager.model.Product;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;


public interface ProductService{
    Product saveProduct(Product product);

    List<Product> fetchProductList();

    Product fetchProduct(Long productId);

    Product updateProduct(Product product, Long productId);

    void deleteProductById(Long productId);

    List<String> getAvailability();

    HashSet<String> getCategories();

    void addCategory(String category);

    void deleteCategory(String category);

    List<Product> inventorySearch(String name, List<String> categories, String availability);

    Product editStock(Long productId, int stock);
}
