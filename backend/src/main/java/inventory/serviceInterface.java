package inventory;

import java.util.HashSet;
import java.util.List;

public interface serviceInterface {
    List<InventoryProduct> getInventoryList();
    void addProduct(String id,InventoryProduct product);
    InventoryProduct getProduct(String id);
    List<InventoryProduct> inventorySearch(String name, List<String> categories, String availability);
    InventoryProduct editProduct(String id, InventoryProduct product);
    InventoryProduct editProductStock(String id, int stock);
    void deleteProduct(String id);
    void addCategory(String category);
    void deleteCategory(String category);
    HashSet<String> getCategories();
    List<String> getAvailability();
}
