package com.inventoryManager.service;

import com.inventoryManager.model.Product;
import com.inventoryManager.repository.ProductRepositoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ProductServiceImpl implements ProductService{

    @Autowired
    private ProductRepositoryImpl productRepository;

    @Override
    public Product saveProduct(Product product){
        return productRepository.save(product);
    }

    @Override
    public List<Product> fetchProductList(){
        List<Product> target = new ArrayList<>();
        productRepository.findAll().forEach(target::add);
        return target;
    }

    @Override
    public Product fetchProduct(String productId){
        return productRepository.findById(productId).get();
    }

    @Override
    public Product updateProduct(Product product, String productId){
        Product prodDB = fetchProduct(productId);

        //update name
        if (Objects.nonNull(product.getName()) && !"".equalsIgnoreCase(product.getName())) {
            prodDB.setName(product.getName());
        }

        //update category
        if (Objects.nonNull(product.getCategory()) && !"".equalsIgnoreCase(product.getCategory())) {
            prodDB.setCategory(product.getCategory());
        }

        //update unit price
        prodDB.setUnitPrice(product.getUnitPrice());

        //update stock
        prodDB.setStock(product.getStock());

        //update expiration date
        if (Objects.nonNull(product.getExpirationDate())) {
            prodDB.setExpirationDate(product.getExpirationDate());
        }
        else{
            prodDB.setExpirationDate(null);
        }

        prodDB.setUpdateDate();
        return productRepository.save(prodDB);
    }

    @Override
    public List<Product> deleteProductById(String productId){
        productRepository.deleteById(productId);
        return fetchProductList();
    }

    private HashSet<String> categories = new HashSet<>();

    @Override
    public HashSet<String> getCategories(){
        return categories;
    }

    @Override
    public void addCategory(String category){
        categories.add(category);
    }

    @Override
    public void deleteCategory(String category){
        categories.remove(category);
    }

    @Override
    public List<Product> inventorySearch(String name, List<String> categories, String availability) {
        HashSet<Product> searchedList = new HashSet<>();
        for (Product product : productRepository.findAll()){
            if(name!=null){
                if(categories!=null&&!categories.isEmpty()){
                    for(String category : categories){
                        if(product.getName().toLowerCase().contains(name.toLowerCase())&&product.getCategory().equals(category)){
                            switch (availability){
                                case "Out of Stock":
                                    if(product.getStock()==0){
                                        searchedList.add(product);
                                    }
                                    break;
                                case "In Stock":
                                    if(product.getStock()>0){
                                        searchedList.add(product);
                                    }
                                    break;
                                case "All":
                                    searchedList.add(product);
                                    break;
                            }
                        }
                    }
                }
                else{
                    if(product.getName().toLowerCase().contains(name.toLowerCase())){
                        switch (availability){
                            case "Out of Stock":
                                if(product.getStock()==0){
                                    searchedList.add(product);
                                }
                                break;
                            case "In Stock":
                                if(product.getStock()>0){
                                    searchedList.add(product);
                                }
                                break;
                            case "All":
                                searchedList.add(product);
                                break;
                        }
                    }
                }
            }
            else{
                if(categories!=null&&!categories.isEmpty()){
                    for(String category : categories){
                        if(product.getCategory().equals(category)){
                            switch (availability){
                                case "Out of Stock":
                                    if(product.getStock()==0){
                                        searchedList.add(product);
                                    }
                                    break;
                                case "In Stock":
                                    if(product.getStock()>0){
                                        searchedList.add(product);
                                    }
                                    break;
                                case "All":
                                    searchedList.add(product);
                                    break;
                            }
                        }
                    }
                }
                else{
                    switch (availability){
                        case "Out of Stock":
                            if(product.getStock()==0){
                                searchedList.add(product);
                            }
                            break;
                        case "In Stock":
                            if(product.getStock()>0){
                                searchedList.add(product);
                            }
                            break;
                        case "All":
                            searchedList.add(product);
                            break;
                    }
                }
            }
        }
        return new ArrayList<>(searchedList);
    }

    @Override
    public Product editStock(String productId, int stock) {
        Product product = productRepository.findById(productId).get();
        product.setStock(stock);
        product.setUpdateDate();
        productRepository.save(product);
        return product;
    }
}
