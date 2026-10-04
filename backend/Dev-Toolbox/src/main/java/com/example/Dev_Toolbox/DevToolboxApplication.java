package com.example.Dev_Toolbox;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class DevToolboxApplication {

	public static void main(String[] args) {
		// timestamps are LocalDateTime without offset: keep them in UTC everywhere
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		SpringApplication.run(DevToolboxApplication.class, args);
	}

}