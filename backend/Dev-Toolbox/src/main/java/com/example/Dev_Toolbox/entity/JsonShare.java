package com.example.Dev_Toolbox.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.apache.tomcat.util.buf.C2BConverter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class JsonShare {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String payload;

    @Column(nullable = false)
    private LocalDateTime createdAt;


    private LocalDateTime expiresAt;


}
