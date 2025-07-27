package com.market_os.customerservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CustomerserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomerserviceApplication.class, args);
    }
}