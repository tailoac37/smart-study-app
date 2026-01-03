package com.studyapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartStudyApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartStudyApplication.class, args);
        System.out.println("==============================================");
        System.out.println("Smart Study App Backend is running!");
        System.out.println("Server: http://localhost:8080");
        System.out.println("==============================================");
    }
}
