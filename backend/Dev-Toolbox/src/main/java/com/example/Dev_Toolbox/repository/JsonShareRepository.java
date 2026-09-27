package com.example.Dev_Toolbox.repository;

import com.example.Dev_Toolbox.entity.JsonShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface JsonShareRepository extends JpaRepository<JsonShare, UUID> {
    List<JsonShare> findByExpiresAtBefore(LocalDateTime now);
}