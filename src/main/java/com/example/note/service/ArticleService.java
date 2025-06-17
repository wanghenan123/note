package com.example.note.service;

import com.example.note.entity.Article;

import java.util.List;

public interface ArticleService {
    Article getById(Long id);
    List<Article> list(Integer categoryId, Integer status, Integer authorId, String keyword);
    List<Article> getByCategoryId(Long categoryId);
    List<Article> getByAuthorId(Long authorId);
    void save(Article article);
    void update(Article article);
    void delete(Long id);
    void incrementViewCount(Long id);
    void incrementLikeCount(Long id);
}
