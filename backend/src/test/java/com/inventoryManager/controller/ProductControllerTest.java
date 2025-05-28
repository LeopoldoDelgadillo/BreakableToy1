package com.inventoryManager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventoryManager.model.Product;
import com.inventoryManager.service.ProductService;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.List;


@WebMvcTest(ProductController.class)
public class ProductControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private List<Product> products;
    private PagedListHolder<Product> listHolder;

    @BeforeEach
    void setUp() {
        products = List.of(
                new Product("LED", "Electronics", 5, 20, LocalDateTime.of(2099, 12, 31, 23, 59, 59)),
                new Product("Beef", "Food", 80, 15, LocalDateTime.of(2099, 12, 31, 23, 59, 59)),
                new Product("Sausage", "Food", 45, 0, LocalDateTime.of(2099, 12, 31, 23, 59, 59))
        );
        listHolder = new PagedListHolder<>(productService.fetchProductList());
        listHolder.setPageSize(10);
        listHolder.setPage(0);
    }

    @Test
    void shouldReturnPagedListHolder() throws Exception {
        when(productService.fetchProductList()).thenReturn(products);

        mockMvc.perform(get("/products?page=0").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$.source", hasSize(3)))
                .andExpect(jsonPath("$.source", containsInAnyOrder(
                        hasEntry("name", "LED"),
                        hasEntry("name", "Beef"),
                        hasEntry("name", "Sausage")
                )))
                .andExpect(jsonPath("$.pageList",hasSize(3)))
                .andExpect(jsonPath("$.pageList", containsInAnyOrder(
                        hasEntry("name", "LED"),
                        hasEntry("name", "Beef"),
                        hasEntry("name", "Sausage")
                )))
                .andExpect(jsonPath("$.pageSize").value(10));
    }

    @Test
    void shouldAddProduct() throws Exception {
        Product newProduct = new Product("Resistor", "Electronics", 5, 10, LocalDateTime.of(2099, 12, 31, 23, 59, 59));

        System.out.println(newProduct);
        when(productService.saveProduct(newProduct)).thenReturn(newProduct);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Resistor"));
    }

    @Test
    void shouldEditProduct() throws Exception {
        Product editedProduct = products.get(0);
        editedProduct.setStock(15);
        editedProduct.setUnitPrice(4);
        when(productService.updateProduct(ArgumentMatchers.any(),eq(products.get(0).getProductId()))).thenReturn(products.get(0));
        when(productService.fetchProduct(products.get(0).getProductId())).thenReturn(products.get(0));
        mockMvc.perform(put(String.format("/products/%s",products.get(0).getProductId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(editedProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unitPrice").value(4))
                .andExpect(jsonPath("$.stock").value(15));
    }

    @Test
    void shouldSetStockTo0() throws Exception {
        Product newStockProduct = products.get(0);
        newStockProduct.setStock(0);
        when(productService.editStock(products.get(0).getProductId(),0)).thenReturn(products.get(0));
        when(productService.fetchProduct(products.get(0).getProductId())).thenReturn(products.get(0));
        mockMvc.perform(post(String.format("/products/%s/outofstock",products.get(0).getProductId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(products.get(0))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stock").value(0));
    }

    @Test
    void shouldSetStockTo10() throws Exception {
        Product newStockProduct = products.get(0);
        newStockProduct.setStock(10);
        when(productService.editStock(products.get(0).getProductId(),10)).thenReturn(products.get(0));
        when(productService.fetchProduct(products.get(0).getProductId())).thenReturn(products.get(0));
        mockMvc.perform(post(String.format("/products/%s/instock",products.get(0).getProductId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(products.get(0))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stock").value(10));
    }

    @Test
    void deleteProduct() throws Exception {
        when(productService.deleteProductById(products.get(0).getProductId())).thenReturn(products);
        mockMvc.perform(delete(String.format("/products/%s",products.get(0).getProductId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(products)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stock").value(10));
    }
}