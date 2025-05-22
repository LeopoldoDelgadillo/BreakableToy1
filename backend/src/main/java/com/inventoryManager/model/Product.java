package com.inventoryManager.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import jakarta.persistence.Entity;
import org.springframework.cglib.core.Local;

import javax.management.ConstructorParameters;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Entity
public class Product {
    private String name;
    private String category;
    private int unitPrice;
    private int stock;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime expirationDate;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private final LocalDateTime creationDate;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updateDate;
    private final String productId;

    public Product(String name, String category, int unitPrice, int stock, LocalDateTime expirationDate, LocalDateTime creationDate, LocalDateTime updateDate, String productId){
        this.name = name;
        this.category = category;
        this.unitPrice = unitPrice;
        this.stock = stock;
        this.expirationDate = expirationDate;
        this.creationDate = creationDate;
        this.updateDate = updateDate;
        this.productId = productId;
    }

    public Product(String name, String category, int unitPrice, int stock, String expirationDate){
        this(name, category, unitPrice, stock, LocalDateTime.parse(expirationDate, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), LocalDateTime.now(), LocalDateTime.now(), UUID.randomUUID().toString());
    }


    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }

    public String getCategory(){
        return category;
    }
    public void setCategory(String category){
        this.category = category;
    }

    public int getUnitPrice(){
        return unitPrice;
    }
    public void setUnitPrice(int unitPrice){
        this.unitPrice = unitPrice;
    }

    public int getStock(){
        return stock;
    }
    public void setStock(int stock){
        this.stock = stock;
    }

    public LocalDateTime getExpirationDate(){
        return expirationDate;
    }
    public void setExpirationDate(LocalDateTime expirationDate){
        this.expirationDate = expirationDate;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public LocalDateTime getUpdateDate(){
        return updateDate;
    }
    public void setUpdateDate(){
        this.updateDate = LocalDateTime.now();
    }

    public String getProductId(){
        return productId;
    }
}

