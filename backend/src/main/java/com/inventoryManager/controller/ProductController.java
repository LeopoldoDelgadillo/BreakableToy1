package com.inventoryManager.controller;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventoryManager.model.Product;
import com.inventoryManager.service.ProductService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.MutableSortDefinition;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping()
    public PagedListHolder<Product> getList(@RequestParam int page,
                                            @RequestParam(required = false) String sort,
                                            @RequestParam(required = false) String searchName,
                                            @RequestParam(required = false) List<String> searchCategory,
                                            @RequestParam(required = false) String searchAvailability) {
        PagedListHolder<Product> listHolder;
        if (searchName == null && searchCategory == null && searchAvailability == "All") {
            listHolder = new PagedListHolder<>(productService.fetchProductList());
        }
        else{listHolder = new PagedListHolder<>(productService.inventorySearch(searchName, searchCategory, searchAvailability));}
        MutableSortDefinition x = new MutableSortDefinition (sort, true, true);
        listHolder.setSort(x);
        listHolder.resort();
        listHolder.setPageSize(10);
        listHolder.setPage(page);
        return listHolder;
    }

    @PostMapping()
    public List<Product> postInventoryProductList(@RequestBody Object body){
        List<Product> products = new ArrayList<>();
    if (body instanceof List) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        products = ((List<?>) body).stream()
            .map(obj -> mapper.convertValue(obj, Product.class))
            .collect(Collectors.toList());
    } else {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        products.add(mapper.convertValue(body, Product.class));
    }
    for (Product product : products) {
        productService.saveProduct(product);
        productService.addCategory(product.getCategory());
    }
    return products;
    }

    @PutMapping("/{productId}")
    public Product putInventoryProduct(@PathVariable String productId, @RequestBody Product product) {
        productService.updateProduct(product, productId);
        return productService.fetchProduct(productId);
    }

    @PostMapping("/{productId}/outofstock")
    public Product putProductOOS(@PathVariable String productId){
        productService.editStock(productId, 0);
        return productService.fetchProduct(productId);
    }

    @PostMapping("/{productId}/instock")
    public Product putProductIS(@PathVariable String productId){
        productService.editStock(productId, 10);
        return productService.fetchProduct(productId);
    }

    @DeleteMapping("/{productId}")
    public void deleteInventoryProduct(@PathVariable String productId) {
        productService.deleteProductById(productId);
    }
}
