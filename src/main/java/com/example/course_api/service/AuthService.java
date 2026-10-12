package com.example.course_api.service;

import com.example.course_api.dto.LoginRequest;
import com.example.course_api.AppUser;
import com.example.course_api.dto.RegisterRequest;
import com.example.course_api.repository.AppUserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest request) {

        if (request.getUsername() == null ||
                request.getUsername().isBlank() ||
                request.getPassword() == null ||
                request.getPassword().length() < 8) {
            throw new IllegalArgumentException(
                    "Username is required and password must be at least 8 characters");
        }

        if (appUserRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        AppUser user = new AppUser();
        user.setUsername(request.getUsername());

        // Store the BCrypt hash, never the plain-text password.
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        appUserRepository.save(user);

        return "User registered successfully";
    }

    public String login(LoginRequest request) {
        if (request.getUsername() == null ||
            request.getUsername().isBlank() ||
            request.getPassword() == null) {
        throw new IllegalArgumentException(
                "Username and password are required");
            }

        AppUser user = appUserRepository
            .findByUsername(request.getUsername())
            .orElseThrow(() -> new IllegalArgumentException(
                    "Invalid username or password"));

        if (!passwordEncoder.matches(
            request.getPassword(), user.getPassword())) {
        throw new IllegalArgumentException(
                "Invalid username or password");
            }

        return "Login successful";
    }
}