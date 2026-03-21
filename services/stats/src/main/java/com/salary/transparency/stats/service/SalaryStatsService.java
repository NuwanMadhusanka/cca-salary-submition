package com.salary.transparency.stats.service;

import com.salary.transparency.stats.dto.SalaryStatistics;
import com.salary.transparency.stats.dto.SalaryTrend;
import com.salary.transparency.stats.dto.TrendResponse;
import com.salary.transparency.stats.repository.SalaryStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalaryStatsService {

    private final SalaryStatsRepository statsRepository;

    @Transactional(readOnly = true)
    public SalaryStatistics getStatistics(StatsFilter filters) {
        Map<String, Object> result = statsRepository.getAggregatedStats(
                filters.getRole(),
                filters.getCountry(),
                filters.getCompany(),
                filters.getExperienceLevel()
        );

        Object sampleSizeObj = result.get("samplesize");
        if (sampleSizeObj == null || ((Number) sampleSizeObj).longValue() == 0) {
            return SalaryStatistics.builder()
                    .sampleSize(0L)
                    .currency("USD")
                    .filters(filters.toMap())
                    .build();
        }

        return SalaryStatistics.builder()
                .sampleSize(((Number) sampleSizeObj).longValue())
                .minSalary(toBigDecimal(result.get("minsalary")))
                .maxSalary(toBigDecimal(result.get("maxsalary")))
                .averageSalary(toBigDecimal(result.get("avgsalary")))
                .medianSalary(toBigDecimal(result.get("median")))
                .percentile25(toBigDecimal(result.get("p25")))
                .percentile75(toBigDecimal(result.get("p75")))
                .percentile90(toBigDecimal(result.get("p90")))
                .currency("USD")
                .filters(filters.toMap())
                .build();
    }

    @Transactional(readOnly = true)
    public TrendResponse getTrends(TrendFilter filters) {
        // Map "quarter" to PostgreSQL DATE_TRUNC value
        String pgPeriod = "quarter".equalsIgnoreCase(filters.getPeriodType()) ? "quarter" : "month";

        List<Map<String, Object>> rows = statsRepository.getTrends(
                pgPeriod,
                filters.getRole(),
                filters.getCompany(),
                filters.getCountry()
        );

        List<SalaryTrend> trends = new ArrayList<>();
        BigDecimal previousAvg = null;

        for (Map<String, Object> row : rows) {
            BigDecimal currentAvg = toBigDecimal(row.get("avgsalary"));
            BigDecimal percentageChange = null;

            if (previousAvg != null && currentAvg != null && previousAvg.compareTo(BigDecimal.ZERO) != 0) {
                percentageChange = currentAvg.subtract(previousAvg)
                        .divide(previousAvg, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, RoundingMode.HALF_UP);
            }

            trends.add(SalaryTrend.builder()
                    .period(String.valueOf(row.get("period")))
                    .averageSalary(currentAvg)
                    .medianSalary(toBigDecimal(row.get("median")))
                    .sampleSize(((Number) row.get("samplesize")).longValue())
                    .percentageChange(percentageChange)
                    .build());

            previousAvg = currentAvg;
        }

        return TrendResponse.builder()
                .trends(trends)
                .groupBy("quarter".equalsIgnoreCase(filters.getPeriodType()) ? "quarterly" : "monthly")
                .filters(filters.toMap())
                .build();
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return null;
        if (value instanceof BigDecimal bd) return bd;
        if (value instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        return null;
    }
}
