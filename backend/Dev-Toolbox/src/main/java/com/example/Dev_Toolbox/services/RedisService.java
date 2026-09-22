package com.example.Dev_Toolbox.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.Provider;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final StringRedisTemplate redisTemplate;

    public void saveExpiration(String id,
                               Long expirationMinutes
                               ) {
        String key = "json:" + id;

        redisTemplate.opsForValue().set(
                key,
                id,
                expirationMinutes,
                TimeUnit.MINUTES
        );
    }

}
