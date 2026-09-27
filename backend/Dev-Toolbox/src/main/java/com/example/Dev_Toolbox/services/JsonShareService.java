package com.example.Dev_Toolbox.services;

import com.example.Dev_Toolbox.entity.JsonShare;
import com.example.Dev_Toolbox.entity.LinkHistory;
import com.example.Dev_Toolbox.entity.LinkStatus;
import com.example.Dev_Toolbox.repository.JsonShareRepository;
import com.example.Dev_Toolbox.repository.LinkHistoryRepository;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class JsonShareService {

    private final JsonShareRepository repository;
    private final ObjectMapper objectMapper;
    private final RedisService redisService;
    private final LinkHistoryRepository linkHistoryRepository;

    public JsonShareService(JsonShareRepository repository,
                            ObjectMapper objectMapper,
                            RedisService redisService,
                            LinkHistoryRepository linkHistoryRepository) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.redisService = redisService;
        this.linkHistoryRepository = linkHistoryRepository;
    }

    //    creating JSON which is coming from the frontend and saving it as a String
    public JsonShare createShareableJson(
            JsonNode payload,
            Long expirationMinutes,
            String name
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

            JsonShare savedJsonShare = repository.save(jsonShare);

            LinkHistory linkHistory = new LinkHistory();

            linkHistory.setName(name);
            linkHistory.setJsonShareId(savedJsonShare.getId());
            linkHistory.setCreatedAt(savedJsonShare.getCreatedAt());
            linkHistory.setExpiresAt(savedJsonShare.getExpiresAt());
            linkHistory.setStatus(LinkStatus.ACTIVE);

            linkHistoryRepository.save(linkHistory);

            if (expirationMinutes != null) {
                redisService.saveExpiration(
                        savedJsonShare.getId().toString(),
                        expirationMinutes
                );
            }

            return savedJsonShare;

        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON");
        }
    }
    public JsonShare getShareableJsonId(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("JSON share not found"));
    }

}