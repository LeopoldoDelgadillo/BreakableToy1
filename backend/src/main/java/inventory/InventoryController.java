package inventory;

import org.springframework.beans.support.MutableSortDefinition;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/products")
public class InventoryController{

    private InventoryService repo = new InventoryService();

    @GetMapping()
    public PagedListHolder<InventoryProduct> getList(@RequestParam int page,
                                                     @RequestParam(required = false) String sort){
        PagedListHolder<InventoryProduct> listHolder = new PagedListHolder<>(repo.getInventoryList());
        MutableSortDefinition x = new MutableSortDefinition (sort, true, true);
        listHolder.setSort(x);
        listHolder.resort();
        listHolder.setPageSize(10);
        listHolder.setPage(page);
        return listHolder;
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
            newProduct = new InventoryProduct(product.getCategory(), product.getName(),
                                              product.getUnitPrice(), product.getStock(),
                                              product.getExpirationDate().toString(),
                                              repo.getProduct(id).getCreationDate(), LocalDateTime.now(), id);
            repo.editProduct(id, newProduct);
            return newProduct;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/{id}/outofstock")
    public InventoryProduct putProductOOS(@PathVariable String id){
        try{
            repo.editProduct(id,repo.editProductStock(id,0));
            return repo.getProduct(id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/{id}/instock")
    public InventoryProduct putProductIS(@PathVariable String id){
        try{
            repo.editProduct(id,repo.editProductStock(id,10));
            return repo.getProduct(id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
