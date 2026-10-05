package com.example.Dev_Toolbox.controllers;

import com.example.Dev_Toolbox.DTO.response.CreateJsonResponse;
import com.example.Dev_Toolbox.DTO.response.JsonResponse;
import com.example.Dev_Toolbox.entity.JsonShare;
import com.example.Dev_Toolbox.services.JsonShareService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;


import com.example.Dev_Toolbox.util.SessionIds;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/json")
public class JsonShareController {

    private static final long MAX_EXPIRATION_MINUTES = 60L * 24 * 30; // 30 days

    private final JsonShareService service;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public JsonShareController(JsonShareService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateJsonResponse> createJsonLink(
            @RequestBody JsonNode payload,
            @RequestParam(required = false) Long expirationMinutes,
            @RequestParam(required = false, defaultValue = "Untitled") String name,
            @RequestHeader(value = SessionIds.HEADER, required = false) String sessionHeader
    ) {

        String sessionId = SessionIds.require(sessionHeader);

        if (expirationMinutes != null && (expirationMinutes < 1 || expirationMinutes > MAX_EXPIRATION_MINUTES)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "expirationMinutes must be between 1 and " + MAX_EXPIRATION_MINUTES);
        }
        String cleanName = name.isBlank() ? "Untitled" : name.strip();
        if (cleanName.length() > 100) cleanName = cleanName.substring(0, 100);

        JsonShare jsonShare = service.createShareableJson(payload, expirationMinutes, cleanName, sessionId);

        String url = frontendUrl + "/json/" + jsonShare.getId();

        CreateJsonResponse response = new CreateJsonResponse(
                jsonShare.getId(),
                url
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    //
    @GetMapping("/{id}")
    public ResponseEntity<JsonResponse> getJson(@PathVariable UUID id) {

        JsonShare jsonShare = service.getShareableJsonId(id);

        JsonResponse response = new JsonResponse(
                jsonShare.getId(),
                jsonShare.getPayload(),
                jsonShare.getExpiresAt()
        );

        return ResponseEntity.ok(response);
    }
}