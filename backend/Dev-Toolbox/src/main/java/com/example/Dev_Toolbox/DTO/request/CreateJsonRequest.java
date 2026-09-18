package com.example.Dev_Toolbox.DTO;

public record CreateJsonRequest(
        String payload,
        Long expirationMinutes
) {
}