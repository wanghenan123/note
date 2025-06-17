package com.example.note.service;

import com.example.note.entity.User;

public interface UserService {
    User getById(Long id);
    User getByUsername(String username);
    void save(User user);
    void update(User user);
    void delete(Long id);
}