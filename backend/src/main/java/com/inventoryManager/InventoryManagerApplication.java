package com.inventoryManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
@ComponentScan({ "com.inventoryManager.*" })
public class InventoryManagerApplication {
	public static void main(String[] args) {
		SpringApplication.run(InventoryManagerApplication.class, args);
	}
}