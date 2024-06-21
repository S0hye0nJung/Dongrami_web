package com.lec.dto;

import com.lec.entity.WebReading;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class WebReadingDTO {
	
	private int webReadingId;
	private String reading1;
	private String reading2;
	private String reading3;
	private String reading1Title;
	private String reading2Title;
	private String reading3Title;
	private int subcategoryId;
	private int cardId;
	
	public WebReading toEntity() {
		return WebReading.builder()
				.webReadingId(webReadingId)
				.reading1(reading1)
				.reading2(reading2)
				.reading3(reading3)
				.reading1Title(reading1Title)
				.reading2Title(reading2Title)
				.reading3Title(reading3Title)
				.build();

	}

}
