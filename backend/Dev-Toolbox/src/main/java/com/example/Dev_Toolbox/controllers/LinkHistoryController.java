package com.example.Dev_Toolbox.controllers;

import com.example.Dev_Toolbox.entity.LinkHistory;
import com.example.Dev_Toolbox.entity.LinkStatus;
import com.example.Dev_Toolbox.repository.LinkHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class LinkHistoryController {

    private final LinkHistoryRepository linkHistoryRepository;

    @GetMapping("/history")
    public List<LinkHistory> getHistory() {

        List<LinkHistory> history =
                linkHistoryRepository.findAllByOrderByCreatedAtDesc();

        history.forEach(link -> {

            if (link.getExpiresAt() != null &&
                    link.getExpiresAt().isBefore(LocalDateTime.now()) &&
                    link.getStatus() != LinkStatus.EXPIRED) {

                link.setStatus(LinkStatus.EXPIRED);
                linkHistoryRepository.save(link);
            }
        });

        return history;
    }
}