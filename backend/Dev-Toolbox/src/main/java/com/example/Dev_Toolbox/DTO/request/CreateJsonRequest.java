package com.example.Dev_Toolbox.DTO.request;

public record CreateJsonRequest(
        String payload,
        Long expirationMinutes
) {
}