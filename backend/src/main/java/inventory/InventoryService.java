package inventory;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InventoryService implements serviceInterface{
    private final List<String> availability = Arrays.asList("Out of Stock", "In Stock", "All");
    public List<String> getAvailability(){
        return availability;
    }

    private HashSet<String> categories = new HashSet<String>();
    public HashSet<String> getCategories(){
        return categories;
    }
    public void addCategory(String category){
        try {
            categories.add(category);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    public void deleteCategory(String category){
        try {
            categories.remove(category);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private HashMap<String,InventoryProduct> inventoryList = new HashMap<>();
    public List<InventoryProduct> getInventoryList(){
        return new ArrayList<>(inventoryList.values());
    }

    public void addProduct(String id, InventoryProduct product){
        inventoryList.put(id,product);
    }
    public InventoryProduct getProduct(String id){
        return inventoryList.get(id);
    }

    public List<InventoryProduct> inventorySearch(String name, List<String> categories, String availability) {
        HashSet<InventoryProduct> searchedList = new HashSet<>();
        if(name==null&&categories.isEmpty()&&availability==null){
            searchedList.addAll(inventoryList.values());
        }
        else{
            for (InventoryProduct product : inventoryList.values()){
                if(name!=null){
                    if(!categories.isEmpty()){
                        for(String category : categories){
                            if(product.getName().equals(name)&&product.getCategory().equals(category)){
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
                                }
                            }
                        }
                    }
                    else{
                        if(product.getName().equals(name)){
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
                            }
                        }
                    }
                }
                else{
                    if(!categories.isEmpty()){
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
                        }
                    }
                }
            }
        }
        return new ArrayList<>(searchedList);
    }

    public InventoryProduct editProduct(String id, InventoryProduct product) {
        inventoryList.replace(id,product);
        return product;
    }
    public InventoryProduct editProductStock(String id, int stock) {
        InventoryProduct product = inventoryList.get(id);
        product.setStock(stock);
        inventoryList.replace(id,product);
        return inventoryList.get(id);
    }

    public void deleteProduct(String id) {
        inventoryList.remove(id);
    }
}
