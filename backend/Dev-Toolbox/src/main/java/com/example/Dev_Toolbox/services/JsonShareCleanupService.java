package com.example.Dev_Toolbox.services;

import com.example.Dev_Toolbox.entity.LinkStatus;
import com.example.Dev_Toolbox.repository.JsonShareRepository;
import com.example.Dev_Toolbox.repository.LinkHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JsonShareCleanupService {

    private final JsonShareRepository jsonShareRepository;
    private final LinkHistoryRepository linkHistoryRepository;

    public void deleteExpiredJson(String expiredKey) {
        String id = expiredKey.substring("json:".length());

                UUID uuid = UUID.fromString(id);

        linkHistoryRepository.findByJsonShareId(uuid)
                        .ifPresent(history -> {
                            history.setStatus(LinkStatus.EXPIRED);
                            linkHistoryRepository.save(history);
                        });

        jsonShareRepository.deleteById(uuid);

        System.out.println(uuid + "has been deleted ");
    }
}