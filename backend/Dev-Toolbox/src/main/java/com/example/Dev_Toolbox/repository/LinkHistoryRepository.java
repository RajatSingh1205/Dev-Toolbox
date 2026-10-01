package com.example.Dev_Toolbox.repository;

import com.example.Dev_Toolbox.entity.LinkHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LinkHistoryRepository extends JpaRepository<LinkHistory, Long> {
    Optional<LinkHistory> findByJsonShareId(UUID jsonShareId);
    List<LinkHistory> findAllByOrderByCreatedAtDesc();
}
