package com.market_os.template_service.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;



@RestController
@RequestMapping("/testing")

public class HealthControler {
    @GetMapping("/check")
    public String health() {
        return "Up and running!";
    }
    
    @GetMapping("/health")
    public String healthCheck() {
        return "Health check passed!";
    }
}
