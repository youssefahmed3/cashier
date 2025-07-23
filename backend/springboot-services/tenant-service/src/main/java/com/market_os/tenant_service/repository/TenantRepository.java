package com.market_os.tenant_service.repository;

import com.market_os.tenant_service.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    
    /**
     * Find all active tenants
     */
    List<Tenant> findByIsActiveTrue();
    
    /**
     * Find tenant by ID and active status
     */
    Optional<Tenant> findByIdAndIsActiveTrue(UUID id);
    
    /**
     * Find tenant by name (case-insensitive)
     */
    Optional<Tenant> findByNameIgnoreCase(String name);
    
    /**
     * Check if tenant exists by name (case-insensitive)
     */
    boolean existsByNameIgnoreCase(String name);
    
    /**
     * Find tenant with branches loaded
     */
    @Query("SELECT t FROM Tenant t LEFT JOIN FETCH t.branches WHERE t.id = :id")
    Optional<Tenant> findByIdWithBranches(@Param("id") UUID id);
    
    /**
     * Find active tenant with branches loaded
     */
    @Query("SELECT t FROM Tenant t LEFT JOIN FETCH t.branches WHERE t.id = :id AND t.isActive = true")
    Optional<Tenant> findByIdWithBranchesAndIsActiveTrue(@Param("id") UUID id);
} 