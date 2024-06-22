package com.lec.dto;

import com.lec.entity.Subcategory;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class SubcategoryDTO {
	
	private int subcategory_id;
	private String subcategory_name;
	private int count;
	private String bubble_slak_name;
	private int maincategoryId;
	
	public Subcategory toEntity() {
		return Subcategory.builder()
				.subcategory_id(subcategory_id)
				.subcategory_name(subcategory_name)
				.count(count)
				.bubble_slak_name(bubble_slak_name)
				.build();
				
		
	}
}
