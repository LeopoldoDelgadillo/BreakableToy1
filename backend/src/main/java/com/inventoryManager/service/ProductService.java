package com.inventoryManager.service;

import com.inventoryManager.model.Product;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.List;

@Service
public interface ProductService{
    Product saveProduct(Product product);

    List<Product> fetchProductList();

    Product fetchProduct(String productId);

    Product updateProduct(Product product, String productId);

    List<Product> deleteProductById(String productId);

    HashSet<String> getCategories();

    void addCategory(String category);

    void deleteCategory(String category);

    List<Product> inventorySearch(String name, List<String> categories, String availability);

    Product editStock(String productId, int stock);
}
