package com.market_os.tenant_service.mapper;

import com.market_os.tenant_service.dto.BranchDto;
import com.market_os.tenant_service.dto.CreateTenantDto;
import com.market_os.tenant_service.dto.TenantDto;
import com.market_os.tenant_service.dto.TenantWithBranchesDto;
import com.market_os.tenant_service.dto.UpdateTenantDto;
import com.market_os.tenant_service.model.Branch;
import com.market_os.tenant_service.model.Tenant;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-16T12:54:01+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class TenantMapperImpl implements TenantMapper {

    @Override
    public TenantDto toDto(Tenant tenant) {
        if ( tenant == null ) {
            return null;
        }

        TenantDto.TenantDtoBuilder tenantDto = TenantDto.builder();

        tenantDto.logoUrl( tenant.getLogoUrl() );
        tenantDto.isActive( tenant.getIsActive() );
        tenantDto.createdAt( tenant.getCreatedAt() );
        tenantDto.id( tenant.getId() );
        tenantDto.name( tenant.getName() );

        return tenantDto.build();
    }

    @Override
    public List<TenantDto> toDtoList(List<Tenant> tenants) {
        if ( tenants == null ) {
            return null;
        }

        List<TenantDto> list = new ArrayList<TenantDto>( tenants.size() );
        for ( Tenant tenant : tenants ) {
            list.add( toDto( tenant ) );
        }

        return list;
    }

    @Override
    public Tenant toEntity(CreateTenantDto createTenantDto) {
        if ( createTenantDto == null ) {
            return null;
        }

        Tenant.TenantBuilder tenant = Tenant.builder();

        tenant.isActive( createTenantDto.getIsActive() );
        tenant.name( createTenantDto.getName() );

        return tenant.build();
    }

    @Override
    public TenantWithBranchesDto toTenantWithBranchesDto(Tenant tenant) {
        if ( tenant == null ) {
            return null;
        }

        TenantWithBranchesDto.TenantWithBranchesDtoBuilder tenantWithBranchesDto = TenantWithBranchesDto.builder();

        tenantWithBranchesDto.logoUrl( tenant.getLogoUrl() );
        tenantWithBranchesDto.isActive( tenant.getIsActive() );
        tenantWithBranchesDto.createdAt( tenant.getCreatedAt() );
        tenantWithBranchesDto.branches( branchListToBranchDtoList( tenant.getBranches() ) );
        tenantWithBranchesDto.id( tenant.getId() );
        tenantWithBranchesDto.name( tenant.getName() );

        return tenantWithBranchesDto.build();
    }

    @Override
    public void updateEntityFromDto(UpdateTenantDto updateTenantDto, Tenant tenant) {
        if ( updateTenantDto == null ) {
            return;
        }

        if ( updateTenantDto.getIsActive() != null ) {
            tenant.setIsActive( updateTenantDto.getIsActive() );
        }
        if ( updateTenantDto.getName() != null ) {
            tenant.setName( updateTenantDto.getName() );
        }
    }

    protected BranchDto branchToBranchDto(Branch branch) {
        if ( branch == null ) {
            return null;
        }

        BranchDto.BranchDtoBuilder branchDto = BranchDto.builder();

        branchDto.id( branch.getId() );
        branchDto.tenantId( branch.getTenantId() );
        branchDto.name( branch.getName() );
        branchDto.phone( branch.getPhone() );
        branchDto.location( branch.getLocation() );
        branchDto.taxPercentage( branch.getTaxPercentage() );
        branchDto.createdAt( branch.getCreatedAt() );

        return branchDto.build();
    }

    protected List<BranchDto> branchListToBranchDtoList(List<Branch> list) {
        if ( list == null ) {
            return null;
        }

        List<BranchDto> list1 = new ArrayList<BranchDto>( list.size() );
        for ( Branch branch : list ) {
            list1.add( branchToBranchDto( branch ) );
        }

        return list1;
    }
}
