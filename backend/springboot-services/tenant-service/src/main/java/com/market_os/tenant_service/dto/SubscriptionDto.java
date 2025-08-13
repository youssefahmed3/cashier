package com.market_os.tenant_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDto {

	@JsonProperty("id")
	private Integer id;

	// .NET property name is Sub_Id (serialized as sub_Id by default JSON options)
	@JsonProperty("sub_Id")
	private Integer subId;

	@JsonProperty("isActive")
	private Boolean isActive;

	// Keep as string to avoid format mismatches between services
	@JsonProperty("expireDate")
	private String expireDate;

	@JsonProperty("price")
	private Integer price;
}

