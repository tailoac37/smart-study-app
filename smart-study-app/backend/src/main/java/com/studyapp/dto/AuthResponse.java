package com.studyapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String role;
    private Integer studentYear;

    public AuthResponse(String accessToken, Long id, String username, String email, String role) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public AuthResponse(String accessToken, Long id, String username, String email, String role, Integer studentYear) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.studentYear = studentYear;
    }
}
