package com.salary.transparency.stats.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SalaryTrend {
    private String period;
    private BigDecimal averageSalary;
    private BigDecimal medianSalary;
    private Long sampleSize;
    private BigDecimal percentageChange;
}
