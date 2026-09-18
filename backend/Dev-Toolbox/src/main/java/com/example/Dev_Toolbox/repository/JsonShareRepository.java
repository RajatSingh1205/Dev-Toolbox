package com.example.Dev_Toolbox.repository;

import com.example.Dev_Toolbox.entity.JsonShare;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JsonShareRepository extends JpaRepository<JsonShare, UUID> {
}