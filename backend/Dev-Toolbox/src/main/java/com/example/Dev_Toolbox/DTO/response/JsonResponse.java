package com.example.Dev_Toolbox.DTO.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record JsonResponse(
        UUID id,
        String payload,
        LocalDateTime expirationMinutes
) {
}
