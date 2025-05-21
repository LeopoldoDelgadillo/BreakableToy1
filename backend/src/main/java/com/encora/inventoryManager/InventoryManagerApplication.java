package com.encora.inventoryManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class InventoryManagerApplication {
	public static void main(String[] args) {
		SpringApplication.run(InventoryManagerApplication.class, args);
	}
}