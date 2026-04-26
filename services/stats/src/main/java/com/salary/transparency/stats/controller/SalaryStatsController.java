package com.salary.transparency.stats.controller;

import com.salary.transparency.stats.dto.HealthResponse;
import com.salary.transparency.stats.dto.SalaryStatistics;
import com.salary.transparency.stats.dto.TrendResponse;
import com.salary.transparency.stats.service.SalaryStatsService;
import com.salary.transparency.stats.service.StatsFilter;
import com.salary.transparency.stats.service.TrendFilter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Salary Statistics", description = "Aggregated salary insights")
public class SalaryStatsController {

    private final SalaryStatsService statsService;

    @GetMapping
    @Operation(summary = "Get salary statistics", description = "Returns aggregated statistics filtered by optional criteria")
    public ResponseEntity<SalaryStatistics> getStatistics(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String experienceLevel) {

        log.info("Stats request: role={}, country={}, company={}, expLevel={}", role, country, company, experienceLevel);

        StatsFilter filters = StatsFilter.builder()
                .role(role)
                .country(country)
                .company(company)
                .experienceLevel(experienceLevel)
                .build();

        return ResponseEntity.ok(statsService.getStatistics(filters));
    }

    @GetMapping("/trends")
    @Operation(summary = "Get salary trends", description = "Returns salary trends over time")
    public ResponseEntity<TrendResponse> getTrends(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String country,
            @RequestParam(defaultValue = "month") String period) {

        log.info("Trends request: role={}, company={}, country={}, period={}", role, company, country, period);

        TrendFilter filters = TrendFilter.builder()
                .role(role)
                .company(company)
                .country(country)
                .periodType(period)
                .build();

        return ResponseEntity.ok(statsService.getTrends(filters));
    }

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> healthCheck() {
        return ResponseEntity.ok(HealthResponse.builder()
                .status("healthy")
                .service("stats")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
