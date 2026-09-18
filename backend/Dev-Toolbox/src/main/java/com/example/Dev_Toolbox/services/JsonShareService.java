package com.example.Dev_Toolbox.services;

import com.example.Dev_Toolbox.DTO.CreateJsonRequest;
import com.example.Dev_Toolbox.entity.JsonShare;
import com.example.Dev_Toolbox.repository.JsonShareRepository;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class JsonShareService {

    private final JsonShareRepository repository;
    private final ObjectMapper objectMapper;

    public JsonShareService(JsonShareRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

//    creating JSON which is coming from the frontend and saving it as a String
public JsonShare createShareableJson(
        JsonNode payload,
        Long expirationMinutes
) {
    try {

        String formattedJson =
                objectMapper
                        .writerWithDefaultPrettyPrinter()
                        .writeValueAsString(payload);

        JsonShare jsonShare = new JsonShare();

        jsonShare.setPayload(formattedJson);
        jsonShare.setCreatedAt(LocalDateTime.now());

        if (expirationMinutes != null) {

            LocalDateTime expiresAt =
                    LocalDateTime.now()
                            .plusMinutes(expirationMinutes);

            jsonShare.setExpiresAt(expiresAt);
        }

        return repository.save(jsonShare);

    } catch (Exception e) {
        throw new IllegalArgumentException("Invalid JSON");
    }
}
    public JsonShare getShareableJsonId(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("JSON share not found"));
    }
    
}