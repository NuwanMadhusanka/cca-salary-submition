package com.salary.transparency.stats.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HealthResponse {
    private String status;
    private String service;
    private LocalDateTime timestamp;
}
