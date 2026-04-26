package com.salary.transparency.submission.service;

import com.salary.transparency.submission.dto.SalarySubmissionRequest;
import com.salary.transparency.submission.dto.SalarySubmissionResponse;
import com.salary.transparency.submission.entity.ExperienceLevel;
import com.salary.transparency.submission.entity.SalaryStatus;
import com.salary.transparency.submission.entity.SalarySubmission;
import com.salary.transparency.submission.exception.SalarySubmissionNotFoundException;
import com.salary.transparency.submission.repository.SalarySubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalarySubmissionService {

    private final SalarySubmissionRepository salarySubmissionRepository;
    private final AnonymizationService anonymizationService;

    /**
     * Create a new salary submission
     */
    @Transactional
    public SalarySubmissionResponse createSubmission(SalarySubmissionRequest request) {
        log.info("Creating new salary submission for company: {}", request.getCompany());

        // Normalize data
        if (request.getCountry() != null) {
            request.setCountry(request.getCountry().toUpperCase());
        }

        // Create entity
        SalarySubmission submission = SalarySubmission.builder()
                .company(request.getCompany())
                .jobTitle(request.getJobTitle())
                .location(request.getLocation())
                .country(request.getCountry())
                .city(request.getCity())
                .yearsOfExperience(request.getYearsOfExperience())
                .experienceLevel(ExperienceLevel.fromYears(request.getYearsOfExperience()))
                .baseSalary(request.getBaseSalary())
                .bonus(request.getBonus() != null ? request.getBonus() : BigDecimal.ZERO)
                .stockOptions(request.getStockOptions() != null ? request.getStockOptions() : BigDecimal.ZERO)
                .otherCompensation(request.getOtherCompensation() != null ? request.getOtherCompensation() : BigDecimal.ZERO)
                .currency(request.getCurrency() != null ? request.getCurrency() : "LKR")
                .employmentType(request.getEmploymentType() != null ? request.getEmploymentType() : "Full-time")
                .anonymize(request.getAnonymize() != null ? request.getAnonymize() : false)
                .build();

        // Always apply anonymization for privacy protection
        anonymizationService.anonymize(submission);

        // Save to database
        SalarySubmission savedSubmission = salarySubmissionRepository.save(submission);

        log.info("Salary submission created with ID: {}", savedSubmission.getId());

        return mapToResponse(savedSubmission);
    }

    /**
     * Get salary submission by ID
     */
    @Transactional(readOnly = true)
    public SalarySubmissionResponse getSubmission(Long submissionId) {
        log.info("Fetching salary submission with ID: {}", submissionId);

        SalarySubmission submission = salarySubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new SalarySubmissionNotFoundException(
                        "Salary submission not found with ID: " + submissionId));

        return mapToResponse(submission);
    }

    /**
     * Update status of a salary submission
     */
    @Transactional
    public SalarySubmissionResponse updateStatus(Long submissionId, String statusStr) {
        log.info("Updating status for submission ID: {} to {}", submissionId, statusStr);

        SalarySubmission submission = salarySubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new SalarySubmissionNotFoundException(
                        "Salary submission not found with ID: " + submissionId));

        SalaryStatus newStatus = SalaryStatus.valueOf(statusStr.toUpperCase());
        submission.setStatus(newStatus);

        if (newStatus == SalaryStatus.APPROVED) {
            submission.setApprovedAt(LocalDateTime.now());
        } else {
            submission.setApprovedAt(null);
        }

        SalarySubmission saved = salarySubmissionRepository.save(submission);
        log.info("Submission {} status updated to {}", submissionId, newStatus);

        return mapToResponse(saved);
    }

    /**
     * List salary submissions with optional filters
     */
    @Transactional(readOnly = true)
    public List<SalarySubmissionResponse> listSubmissions(String status, String company, String country) {
        List<SalarySubmission> submissions;

        if (status != null && !status.isBlank()) {
            submissions = salarySubmissionRepository.findByStatus(SalaryStatus.valueOf(status.toUpperCase()));
        } else if (company != null && !company.isBlank()) {
            submissions = salarySubmissionRepository.findByCompany(company);
        } else if (country != null && !country.isBlank()) {
            submissions = salarySubmissionRepository.findByCountry(country);
        } else {
            submissions = salarySubmissionRepository.findAll();
        }

        return submissions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Map entity to response DTO
     */
    private SalarySubmissionResponse mapToResponse(SalarySubmission submission) {
        return SalarySubmissionResponse.builder()
                .id(submission.getId())
                .company(submission.getCompany())
                .jobTitle(submission.getJobTitle())
                .location(submission.getLocation())
                .country(submission.getCountry())
                .city(submission.getCity())
                .yearsOfExperience(submission.getYearsOfExperience())
                .experienceLevel(submission.getExperienceLevel() != null ? submission.getExperienceLevel().name() : null)
                .baseSalary(submission.getBaseSalary())
                .bonus(submission.getBonus())
                .stockOptions(submission.getStockOptions())
                .otherCompensation(submission.getOtherCompensation())
                .totalCompensation(submission.getTotalCompensation())
                .currency(submission.getCurrency())
                .employmentType(submission.getEmploymentType())
                .anonymize(submission.getAnonymize())
                .status(submission.getStatus() != null ? submission.getStatus().name() : "PENDING")
                .createdAt(submission.getCreatedAt())
                .updatedAt(submission.getUpdatedAt())
                .approvedAt(submission.getApprovedAt())
                .build();
    }
}