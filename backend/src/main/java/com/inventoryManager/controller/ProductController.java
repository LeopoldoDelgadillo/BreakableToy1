package com.inventoryManager.controller;

import com.inventoryManager.model.Product;
import com.inventoryManager.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.MutableSortDefinition;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping()
    public PagedListHolder<Product> getList(@RequestParam int page,
                                            @RequestParam(required = false) String sort){
        PagedListHolder<Product> listHolder = new PagedListHolder<>(productService.fetchProductList());
        MutableSortDefinition x = new MutableSortDefinition (sort, true, true);
        listHolder.setSort(x);
        listHolder.resort();
        listHolder.setPageSize(10);
        listHolder.setPage(page);
        return listHolder;
    }

    @PostMapping()
    public Product postInventoryProduct(@RequestBody Product product){
        productService.saveProduct(product);
        productService.addCategory(product.getCategory());
        return product;
    }

    @PutMapping("/{productId}")
    public Product putInventoryProduct(@PathVariable Long productId, @RequestBody Product product) {
        Product newProduct = new Product(product.getName(),product.getCategory(),
                                          product.getUnitPrice(), product.getStock(),
                                          product.getExpirationDate().toString());
        productService.updateProduct(newProduct, productId);
        return newProduct;
    }

    @PostMapping("/{productId}/outofstock")
    public Product putProductOOS(@PathVariable Long productId){
        productService.editStock(productId, 0);
        return productService.fetchProduct(productId);
    }

    @PostMapping("/{productId}/instock")
    public Product putProductIS(@PathVariable Long productId){
        productService.editStock(productId, 10);
        return productService.fetchProduct(productId);
    }
}
