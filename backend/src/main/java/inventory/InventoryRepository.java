package inventory;

import java.util.*;

public class InventoryRepository implements RepoInterface{
    private List<String> availability = Arrays.asList("Out of Stock", "In Stock", "All");
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

    public List<InventoryProduct> inventorySearch(String name, List<String> categories, List<String> availability) {
        return List.of();
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
    }

}
