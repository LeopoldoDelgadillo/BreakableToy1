package inventory;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class InventoryController{
    InventoryRepository repo = new InventoryRepository();

    @GetMapping()
    public List<InventoryProduct> getList(){
        return repo.getInventoryList();
    }

    @PostMapping()
    public InventoryProduct postInventoryProduct(@RequestBody InventoryProduct product){
        repo.addProduct(product.getId(), product);
        repo.addCategory(product.getCategory());
        return product;
    }

    @PutMapping("/{id}")
    public InventoryProduct putInventoryProduct(@PathVariable String id, @RequestBody InventoryProduct product) {
        InventoryProduct newProduct;
        try {
            newProduct = new InventoryProduct(product.getCategory(), product.getName(), product.getUnitPrice(), product.getStock(), product.getExpirationDate().toString(), repo.getProduct(id).getCreationDate(), LocalDateTime.now(), id);
            repo.editProduct(id, newProduct);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return newProduct;
    }

    @PostMapping("/{id}/outofstock")
    public InventoryProduct putProductOOS(@PathVariable String id){
        try{
            repo.editProduct(id,repo.editProductStock(id,0));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return repo.getProduct(id);
    }

    @PostMapping("/{id}/instock")
    public InventoryProduct putProductIS(@PathVariable String id){
        try{
            repo.editProduct(id,repo.editProductStock(id,10));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return repo.getProduct(id);
    }
}
