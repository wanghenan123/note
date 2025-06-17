package com.example.note.service;

import com.example.note.entity.Category;

import java.util.List;

public interface CategoryService {
    Category getById(Long id);
    List<Category> list();
    void save(Category category);
    void update(Category category);
    void delete(Long id);
}
