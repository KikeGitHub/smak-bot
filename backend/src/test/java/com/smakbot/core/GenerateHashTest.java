package com.smakbot.core;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHashTest {
    @Test
    void printHashes() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("HASH_ADMIN=" + encoder.encode("123qwe..."));
        System.out.println("HASH_SMAK_ADMIN=" + encoder.encode("Admin123"));
    }
}
