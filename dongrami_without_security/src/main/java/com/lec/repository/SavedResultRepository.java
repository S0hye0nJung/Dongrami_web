package com.lec.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.lec.entity.SavedResult;

public interface SavedResultRepository extends JpaRepository<SavedResult, Integer> {

 }
