package com.example.Dev_Toolbox.services;

import com.example.Dev_Toolbox.entity.LinkStatus;
import com.example.Dev_Toolbox.repository.JsonShareRepository;
import com.example.Dev_Toolbox.repository.LinkHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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

        System.out.println(uuid + " has been deleted ");
    }

    /** Safety net for expiry events missed while the app was asleep or restarting. */
    @Scheduled(fixedDelay = 10 * 60 * 1000, initialDelay = 30 * 1000)
    @Transactional
    public void purgeExpired() {
        jsonShareRepository.findByExpiresAtBefore(LocalDateTime.now()).forEach(share -> {
            linkHistoryRepository.findByJsonShareId(share.getId()).ifPresent(h -> {
                h.setStatus(LinkStatus.EXPIRED);
                linkHistoryRepository.save(h);
            });
            jsonShareRepository.delete(share);
        });
    }
}
