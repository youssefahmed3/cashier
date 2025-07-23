package com.market_os.tenant_service.mapper;

import com.market_os.tenant_service.dto.BranchDto;
import com.market_os.tenant_service.dto.CreateBranchDto;
import com.market_os.tenant_service.dto.UpdateBranchDto;
import com.market_os.tenant_service.model.Branch;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-16T13:09:09+0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class BranchMapperImpl implements BranchMapper {

    @Override
    public BranchDto toDto(Branch branch) {
        if ( branch == null ) {
            return null;
        }

        BranchDto.BranchDtoBuilder branchDto = BranchDto.builder();

        branchDto.tenantId( branch.getTenantId() );
        branchDto.taxPercentage( branch.getTaxPercentage() );
        branchDto.createdAt( branch.getCreatedAt() );
        branchDto.id( branch.getId() );
        branchDto.location( branch.getLocation() );
        branchDto.name( branch.getName() );
        branchDto.phone( branch.getPhone() );

        return branchDto.build();
    }

    @Override
    public List<BranchDto> toDtoList(List<Branch> branches) {
        if ( branches == null ) {
            return null;
        }

        List<BranchDto> list = new ArrayList<BranchDto>( branches.size() );
        for ( Branch branch : branches ) {
            list.add( toDto( branch ) );
        }

        return list;
    }

    @Override
    public Branch toEntity(CreateBranchDto createBranchDto) {
        if ( createBranchDto == null ) {
            return null;
        }

        Branch.BranchBuilder branch = Branch.builder();

        branch.taxPercentage( createBranchDto.getTaxPercentage() );
        branch.location( createBranchDto.getLocation() );
        branch.name( createBranchDto.getName() );
        branch.phone( createBranchDto.getPhone() );

        return branch.build();
    }

    @Override
    public void updateEntityFromDto(UpdateBranchDto updateBranchDto, Branch branch) {
        if ( updateBranchDto == null ) {
            return;
        }

        if ( updateBranchDto.getTaxPercentage() != null ) {
            branch.setTaxPercentage( updateBranchDto.getTaxPercentage() );
        }
        if ( updateBranchDto.getLocation() != null ) {
            branch.setLocation( updateBranchDto.getLocation() );
        }
        if ( updateBranchDto.getName() != null ) {
            branch.setName( updateBranchDto.getName() );
        }
        if ( updateBranchDto.getPhone() != null ) {
            branch.setPhone( updateBranchDto.getPhone() );
        }
    }
}
