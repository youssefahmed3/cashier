package com.market_os.template_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
@SpringBootApplication
@RestController

public class TemplateServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TemplateServiceApplication.class, args);
	}

	@GetMapping("/")
	public String home() {
		return "Welcome to the Template Service!";
	}

/* 	@GetMapping("/health")
	public String health() {
		return "OK";
	} */

}
