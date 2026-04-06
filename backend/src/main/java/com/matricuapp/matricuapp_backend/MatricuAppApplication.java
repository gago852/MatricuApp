package com.matricuapp.matricuapp_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class MatricuAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(MatricuAppApplication.class, args);
    }
}
