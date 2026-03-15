package com.salary.transparency.stats.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class SalaryStatistics {
    private Long sampleSize;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private BigDecimal averageSalary;
    private BigDecimal medianSalary;
    private BigDecimal percentile25;
    private BigDecimal percentile75;
    private BigDecimal percentile90;
    private String currency;
    private Map<String, String> filters;
}
