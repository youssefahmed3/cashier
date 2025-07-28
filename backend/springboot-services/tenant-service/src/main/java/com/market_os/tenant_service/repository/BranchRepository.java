package com.market_os.tenant_service.repository;

import com.market_os.tenant_service.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BranchRepository extends JpaRepository<Branch, UUID> {
    
    /**
     * Find all branches for a specific tenant
     */
    List<Branch> findByTenantId(UUID tenantId);
    
    /**
     * Find branch by ID and tenant ID
     */
    Optional<Branch> findByIdAndTenantId(UUID id, UUID tenantId);
    
    /**
     * Find branch by name within a tenant (case-insensitive)
     */
    Optional<Branch> findByNameIgnoreCaseAndTenantId(String name, UUID tenantId);
    
    /**
     * Check if branch exists by name within a tenant (case-insensitive)
     */
    boolean existsByNameIgnoreCaseAndTenantId(String name, UUID tenantId);
    
    /**
     * Count branches for a specific tenant
     */
    long countByTenantId(UUID tenantId);
    
    /**
     * Find branch with tenant information loaded
     */
    @Query("SELECT b FROM Branch b LEFT JOIN FETCH b.tenant WHERE b.id = :id")
    Optional<Branch> findByIdWithTenant(@Param("id") UUID id);
    
    /**
     * Find all branches with tenant information loaded
     */
    @Query("SELECT b FROM Branch b LEFT JOIN FETCH b.tenant WHERE b.tenantId = :tenantId")
    List<Branch> findByTenantIdWithTenant(@Param("tenantId") UUID tenantId);
} 