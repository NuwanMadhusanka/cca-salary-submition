package com.salary.transparency.stats.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class TrendResponse {
    private List<SalaryTrend> trends;
    private String groupBy;
    private Map<String, String> filters;
}
