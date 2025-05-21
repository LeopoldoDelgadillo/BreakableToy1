package com.inventoryManager.repository;

import com.inventoryManager.model.Product;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class ProductRepositoryImpl implements ProductRepository{
    private final Map<String,Product> productMap = new HashMap<>();

    @Override
    public <S extends Product> S save(S entity) {
        productMap.put(entity.getProductId(),entity);
        return entity;
    }

    @Override
    public <S extends Product> Iterable<S> saveAll(Iterable<S> entities) {
        for(Product product : entities){
            productMap.put(product.getProductId(),product);
        }
        return entities;
    }

    @Override
    public Optional<Product> findById(String aLong) {
        return Optional.of(productMap.get(aLong));
    }

    @Override
    public boolean existsById(String aLong) {
        return productMap.containsKey(aLong);
    }

    @Override
    public Iterable<Product> findAll() {
        return productMap.values();
    }

    @Override
    public Iterable<Product> findAllById(Iterable<String> Strings) {
        List<Product> productList = new ArrayList<>();
        for(String id : Strings){
            productList.add(productMap.get(id));
        }
        return productList;
    }

    @Override
    public long count() {
        return productMap.size();
    }

    @Override
    public void deleteById(String aString) {
        productMap.remove(aString);
    }

    @Override
    public void delete(Product entity) {
        productMap.remove(entity.getProductId(),entity);
    }

    @Override
    public void deleteAllById(Iterable<? extends String> Strings) {
        for(String id : Strings){
            productMap.remove(id);
        }
    }

    @Override
    public void deleteAll(Iterable<? extends Product> entities) {
        for(Product product : entities){
            productMap.remove(product.getProductId(),product);
        }
    }

    @Override
    public void deleteAll() {
        productMap.clear();
    }
}
