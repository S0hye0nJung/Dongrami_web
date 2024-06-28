package com.lec.repository;

import com.lec.entity.SavedResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedResultRepository extends JpaRepository<SavedResult, Integer> {
}
