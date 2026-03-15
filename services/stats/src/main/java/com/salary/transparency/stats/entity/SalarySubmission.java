package com.salary.transparency.stats.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_submissions", schema = "salary-submissions")
@Data
@NoArgsConstructor
public class SalarySubmission {

    @Id
    private Long id;

    private String company;

    @Column(name = "job_title")
    private String jobTitle;

    private String country;
    private String city;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level")
    private ExperienceLevel experienceLevel;

    @Column(name = "base_salary")
    private BigDecimal baseSalary;

    private BigDecimal bonus;

    @Column(name = "stock_options")
    private BigDecimal stockOptions;

    @Column(name = "other_compensation")
    private BigDecimal otherCompensation;

    @Column(name = "total_compensation")
    private BigDecimal totalCompensation;

    private String currency;

    @Column(name = "employment_type")
    private String employmentType;

    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
}
