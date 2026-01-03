package com.studyapp.dto;

import com.studyapp.model.User.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private Role role;
    private Integer studentYear;
}
