package com.salary.transparency.stats.service;

import lombok.Builder;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@Builder
public class StatsFilter {
    private String role;
    private String country;
    private String company;
    private String experienceLevel;

    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<>();
        if (role != null) map.put("role", role);
        if (country != null) map.put("country", country);
        if (company != null) map.put("company", company);
        if (experienceLevel != null) map.put("experienceLevel", experienceLevel);
        return map;
    }
}
