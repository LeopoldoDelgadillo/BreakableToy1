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
}
