package com.salary.transparency.stats.service;

import lombok.Builder;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@Builder
public class TrendFilter {
    private String role;
    private String company;
    private String country;
    private String periodType;

    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<>();
        if (role != null) map.put("role", role);
        if (company != null) map.put("company", company);
        if (country != null) map.put("country", country);
        if (periodType != null) map.put("period", periodType);
        return map;
    }
}
