package com.example.Dev_Toolbox.controllers;

import com.example.Dev_Toolbox.DTO.response.CreateJsonResponse;
import com.example.Dev_Toolbox.DTO.response.JsonResponse;
import com.example.Dev_Toolbox.entity.JsonShare;
import com.example.Dev_Toolbox.services.JsonShareService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;


import java.util.UUID;

@RestController
@RequestMapping("/api/json")
public class JsonShareController {

    private final JsonShareService service;

    public JsonShareController(JsonShareService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateJsonResponse> createJsonLink(
            @RequestBody JsonNode payload,
            @RequestParam(required = false) Long expirationMinutes
    ) {

        JsonShare jsonShare = service.createShareableJson(payload, expirationMinutes);

        String url = "http://localhost:5173/json/" + jsonShare.getId();

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