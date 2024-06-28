package com.lec.repository;

<<<<<<< HEAD
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.lec.entity.SavedResult;

public interface SavedResultRepository extends JpaRepository<SavedResult, Integer> {

 }
=======
import com.lec.entity.SavedResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedResultRepository extends JpaRepository<SavedResult, Integer> {
}
>>>>>>> 9c581ab6d510f95fc0d9e135e3a2eb408536c35f
