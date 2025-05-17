package com.encora.inventoryManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.encora.inventoryManager", "inventory"})
public class InventoryManagerApplication {
	public static void main(String[] args) {
		SpringApplication.run(InventoryManagerApplication.class, args);
	}
}
