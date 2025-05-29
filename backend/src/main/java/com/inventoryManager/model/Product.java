package com.inventoryManager.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
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
    private LocalDateTime creationDate;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updateDate;
    private String productId;

    public Product(String name, String category, int unitPrice, int stock, Optional<LocalDateTime> expirationDate){
        this.name = name;
        this.category = category;
        this.unitPrice = unitPrice;
        this.stock = stock;
        if(expirationDate.isPresent()){this.expirationDate = expirationDate.get();} else{this.expirationDate = null;}
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
        this.productId = UUID.randomUUID().toString();
    }

    public Product(){
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
        this.productId = UUID.randomUUID().toString();
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
    public void setCreationDate(LocalDateTime creationDate){
        if(getCreationDate()==null){
            this.creationDate = creationDate;
        }
        else{
            System.out.println("Error! This product already has creation date: "+getCreationDate());
        }
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
    public void setProductId(){
        if(getProductId()==null){
            this.productId = UUID.randomUUID().toString();
        }
        else{
            System.out.println("Error! This product already has an ID: "+getProductId());
        }
    }
}

