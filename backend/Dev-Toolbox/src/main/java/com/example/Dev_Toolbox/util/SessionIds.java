package com.example.Dev_Toolbox.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

/** Validates the anonymous session id sent by the browser in the X-Session-Id header. */
public final class SessionIds {

    public static final String HEADER = "X-Session-Id";

    private SessionIds() {}

    public static String require(String header) {
        try {
            if (header != null) {
                return UUID.fromString(header).toString();   // normalises + validates
            }
        } catch (IllegalArgumentException ignored) {
            // fall through
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing or invalid " + HEADER + " header");
    }
}
