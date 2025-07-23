package com.market_os.tenant_service.service;

import com.market_os.tenant_service.dto.*;
import com.market_os.tenant_service.dto.events.BranchEvent;
import com.market_os.tenant_service.mapper.BranchMapper;
import com.market_os.tenant_service.model.Branch;
import com.market_os.tenant_service.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BranchServiceImpl implements BranchService {
    
    private final BranchRepository branchRepository;
    private final BranchMapper branchMapper;
    private final TenantService tenantService;
    private final MessagePublisher messagePublisher;
    
    @Override
    public BranchDto createBranch(UUID tenantId, CreateBranchDto createBranchDto) {
        log.info("Creating new branch for tenant ID: {}", tenantId);
        
        // Validate that tenant exists
        if (!tenantService.existsById(tenantId)) {
            throw new IllegalArgumentException("Tenant not found with ID: " + tenantId);
        }
        
        // Check if tenant is active via subscription service
        if (!tenantService.isTenantActiveInSubscriptionService(tenantId)) {
            throw new IllegalArgumentException("Cannot create branch for inactive tenant: " + tenantId);
        }
        
        // Check if branch name already exists for this tenant
        if (branchRepository.existsByNameIgnoreCaseAndTenantId(createBranchDto.getName(), tenantId)) {
            throw new IllegalArgumentException("Branch with name '" + createBranchDto.getName() + "' already exists for this tenant");
        }
        
        Branch branch = branchMapper.toEntity(createBranchDto);
        branch.setTenantId(tenantId);
        
        Branch savedBranch = branchRepository.save(branch);
        
        // Publish branch created event
        BranchEvent branchCreatedEvent = BranchEvent.created(
                savedBranch.getId(),
                savedBranch.getTenantId(),
                savedBranch.getName(),
                savedBranch.getPhone(),
                savedBranch.getLocation(),
                savedBranch.getTaxPercentage()
        );
        messagePublisher.publishBranchCreated(branchCreatedEvent);
        
        log.info("Created branch with ID: {} for tenant ID: {}", savedBranch.getId(), tenantId);
        return branchMapper.toDto(savedBranch);
    }
    
    @Override
    @Transactional(readOnly = true)
    public BranchDto getBranchById(UUID id) {
        log.info("Fetching branch with ID: {}", id);
        
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found with ID: " + id));
        
        return branchMapper.toDto(branch);
    }
    
    @Override
    @Transactional(readOnly = true)
    public BranchDto getBranchByIdAndTenantId(UUID id, UUID tenantId) {
        log.info("Fetching branch with ID: {} for tenant ID: {}", id, tenantId);
        
        Branch branch = branchRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found with ID: " + id + " for tenant: " + tenantId));
        
        return branchMapper.toDto(branch);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BranchDto> getBranchesByTenantId(UUID tenantId) {
        log.info("Fetching branches for tenant ID: {}", tenantId);
        
        List<Branch> branches = branchRepository.findByTenantId(tenantId);
        return branchMapper.toDtoList(branches);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<BranchDto> getAllBranches(Pageable pageable) {
        log.info("Fetching all branches with pagination");
        
        Page<Branch> branches = branchRepository.findAll(pageable);
        return branches.map(branchMapper::toDto);
    }
    
    @Override
    public BranchDto updateBranch(UUID id, UpdateBranchDto updateBranchDto) {
        log.info("Updating branch with ID: {}", id);
        
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found with ID: " + id));
        
        // Check if the new name already exists for another branch in the same tenant
        if (updateBranchDto.getName() != null && 
            !updateBranchDto.getName().equalsIgnoreCase(branch.getName()) &&
            branchRepository.existsByNameIgnoreCaseAndTenantId(updateBranchDto.getName(), branch.getTenantId())) {
            throw new IllegalArgumentException("Branch with name '" + updateBranchDto.getName() + "' already exists for this tenant");
        }
        
        branchMapper.updateEntityFromDto(updateBranchDto, branch);
        Branch updatedBranch = branchRepository.save(branch);
        
        // Publish branch updated event
        BranchEvent branchUpdatedEvent = BranchEvent.updated(
                updatedBranch.getId(),
                updatedBranch.getTenantId(),
                updatedBranch.getName(),
                updatedBranch.getPhone(),
                updatedBranch.getLocation(),
                updatedBranch.getTaxPercentage()
        );
        messagePublisher.publishBranchUpdated(branchUpdatedEvent);
        
        log.info("Updated branch with ID: {}", updatedBranch.getId());
        return branchMapper.toDto(updatedBranch);
    }
    
    @Override
    public BranchDto updateBranchByTenantId(UUID id, UUID tenantId, UpdateBranchDto updateBranchDto) {
        log.info("Updating branch with ID: {} for tenant ID: {}", id, tenantId);
        
        Branch branch = branchRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found with ID: " + id + " for tenant: " + tenantId));
        
        // Check if the new name already exists for another branch in the same tenant
        if (updateBranchDto.getName() != null && 
            !updateBranchDto.getName().equalsIgnoreCase(branch.getName()) &&
            branchRepository.existsByNameIgnoreCaseAndTenantId(updateBranchDto.getName(), tenantId)) {
            throw new IllegalArgumentException("Branch with name '" + updateBranchDto.getName() + "' already exists for this tenant");
        }
        
        branchMapper.updateEntityFromDto(updateBranchDto, branch);
        Branch updatedBranch = branchRepository.save(branch);
        
        // Publish branch updated event
        BranchEvent branchUpdatedEvent = BranchEvent.updated(
                updatedBranch.getId(),
                updatedBranch.getTenantId(),
                updatedBranch.getName(),
                updatedBranch.getPhone(),
                updatedBranch.getLocation(),
                updatedBranch.getTaxPercentage()
        );
        messagePublisher.publishBranchUpdated(branchUpdatedEvent);
        
        log.info("Updated branch with ID: {} for tenant ID: {}", updatedBranch.getId(), tenantId);
        return branchMapper.toDto(updatedBranch);
    }
    
    @Override
    public void deleteBranch(UUID id) {
        log.info("Deleting branch with ID: {}", id);
        
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found with ID: " + id));
        
        // Publish branch deleted event before deletion
        BranchEvent branchDeletedEvent = BranchEvent.deleted(
                branch.getId(),
                branch.getTenantId(),
                branch.getName()
        );
        messagePublisher.publishBranchDeleted(branchDeletedEvent);
        
        branchRepository.deleteById(id);
        log.info("Deleted branch with ID: {}", id);
    }
    
    @Override
    public void deleteBranchByTenantId(UUID id, UUID tenantId) {
        log.info("Deleting branch with ID: {} for tenant ID: {}", id, tenantId);
        
        Branch branch = branchRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found with ID: " + id + " for tenant: " + tenantId));
        
        // Publish branch deleted event before deletion
        BranchEvent branchDeletedEvent = BranchEvent.deleted(
                branch.getId(),
                branch.getTenantId(),
                branch.getName()
        );
        messagePublisher.publishBranchDeleted(branchDeletedEvent);
        
        branchRepository.delete(branch);
        log.info("Deleted branch with ID: {} for tenant ID: {}", id, tenantId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsById(UUID id) {
        return branchRepository.existsById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countBranchesByTenantId(UUID tenantId) {
        return branchRepository.countByTenantId(tenantId);
    }
} 