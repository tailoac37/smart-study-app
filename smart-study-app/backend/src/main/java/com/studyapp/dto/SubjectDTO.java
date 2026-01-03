package com.studyapp.dto;

import lombok.Data;

@Data
public class SubjectDTO {
    private Long id;
    private String name;
    private String code;
    private String teacherName;
    private String teacherEmail;
    private Integer credits;
    private String room;
    private String semester;
    private String color;
    private String description;
    private Integer targetYear;
}
