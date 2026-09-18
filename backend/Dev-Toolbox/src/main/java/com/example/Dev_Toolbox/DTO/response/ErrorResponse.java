package com.example.Dev_Toolbox.DTO.response;

import java.time.LocalDateTime;

public record ErrorResponse(
        String message,
        LocalDateTime timestamp
) {
}