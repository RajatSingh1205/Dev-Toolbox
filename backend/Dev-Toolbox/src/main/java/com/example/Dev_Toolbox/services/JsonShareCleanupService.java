package com.example.Dev_Toolbox.services;

import com.example.Dev_Toolbox.repository.JsonShareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JsonShareCleanupService {

    private final JsonShareRepository jsonShareRepository;

    public void deleteExpiredJson(String expiredKey) {
        String id = expiredKey.substring("json:".length());

        UUID uuid = UUID.fromString(id);

        jsonShareRepository.deleteById(uuid);
    }
}