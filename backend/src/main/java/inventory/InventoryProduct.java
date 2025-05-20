package inventory;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.beans.ConstructorProperties;
import java.time.LocalDateTime;
import java.util.UUID;

public class InventoryProduct {
    private String name;
    private final String category;
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
    private final String id;

    public InventoryProduct(String name, String category, int unitPrice, int stock,
                            String expirationDate, LocalDateTime creationDate, LocalDateTime updateDate, String id){
        this.name = name;
        this.category = category;
        this.unitPrice = unitPrice;
        this.stock = stock;
        this.expirationDate = LocalDateTime.parse(expirationDate);
        this.creationDate = creationDate;
        this.updateDate = updateDate;
        this.id = id;
    }

    @ConstructorProperties({"name","category","unitPrice","stock","expirationDate"})
    public InventoryProduct(String name, String category, int unitPrice, int stock, String expirationDate){
        this(name, category, unitPrice, stock, expirationDate, LocalDateTime.now(), LocalDateTime.now(), UUID.randomUUID().toString());
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

    public String getId(){
        return id;
    }
}

