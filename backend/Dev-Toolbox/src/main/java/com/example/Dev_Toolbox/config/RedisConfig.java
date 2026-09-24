package com.example.Dev_Toolbox.config;

import com.example.Dev_Toolbox.services.JsonShareCleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.ChannelTopic;

@Configuration
@RequiredArgsConstructor
public class RedisConfig {

    private final JsonShareCleanupService cleanupService;

    @Bean
    public RedisMessageListenerContainer redisContainer(
            RedisConnectionFactory connectionFactory
    ) {

        RedisMessageListenerContainer container =
                new RedisMessageListenerContainer();

        container.setConnectionFactory(connectionFactory);

        MessageListener listener =
                (message, pattern) -> {

                    String expiredKey =
                            new String(message.getBody());

                    cleanupService.deleteExpiredJson(expiredKey);
                };

        container.addMessageListener(
                listener,
                new ChannelTopic("__keyevent@0__:expired")
        );

        return container;
    }
}