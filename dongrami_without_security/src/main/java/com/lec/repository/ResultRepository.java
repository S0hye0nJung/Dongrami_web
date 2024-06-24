package com.lec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.*;

import com.lec.dto.WebReadingDTO;
import com.lec.entity.Member;
import com.lec.entity.WebReading;

@Repository
public interface ResultRepository extends JpaRepository<WebReading, Integer>{
	
	@Query(value = "SELECT w.web_reading_id AS webReadingId, " +
		       "w.reading1, w.reading2, w.reading3, " +
		       "w.reading1_title AS reading1Title, " +
		       "w.reading2_title AS reading2Title, " +
		       "w.reading3_title AS reading3Title, " +
		       "w.subcategory_id AS subcategoryId, " +
		       "w.card_id AS cardId, " +
		       "(SELECT c1.image_url FROM cards c1 ORDER BY RAND() LIMIT 1) AS imageUrl1, " +
		       "(SELECT c2.image_url FROM cards c2 ORDER BY RAND() LIMIT 1) AS imageUrl2, " +
		       "(SELECT c3.image_url FROM cards c3 ORDER BY RAND() LIMIT 1) AS imageUrl3 " +
		       "FROM web_reading w " +
		       "WHERE w.subcategory_id = 2 " +
		       "ORDER BY RAND() " +
		       "LIMIT 1", nativeQuery = true)
		List<Object[]> findRandomCardReadings();
}
