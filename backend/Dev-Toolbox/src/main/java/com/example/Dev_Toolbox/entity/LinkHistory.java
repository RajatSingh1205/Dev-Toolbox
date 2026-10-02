package com.example.Dev_Toolbox.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(indexes = @Index(columnList = "sessionId"))
public class LinkHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false )
    private String name;

    @Column(length = 36)
    private String sessionId;

    @Column(nullable = false)
    private UUID jsonShareId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LinkStatus status;
}
