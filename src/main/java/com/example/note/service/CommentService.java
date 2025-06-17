package com.example.note.service;

import com.example.note.entity.Comment;

import java.util.List;

public interface CommentService {
    Comment getById(Long id);
    List<Comment> getByArticleId(Long articleId);
    List<Comment> getByUserId(Long userId);
    void save(Comment comment);
    void delete(Long id);
}
