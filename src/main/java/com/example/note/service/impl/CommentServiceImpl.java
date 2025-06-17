package com.example.note.service.impl;

import com.example.note.entity.Comment;
import com.example.note.mapper.CommentMapper;
import com.example.note.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Override
    public Comment getById(Long id) {
        return commentMapper.selectById(id);
    }

    @Override
    public List<Comment> getByArticleId(Long articleId) {
        return commentMapper.selectByArticleId(articleId);
    }

    @Override
    public List<Comment> getByUserId(Long userId) {
        return commentMapper.selectByUserId(userId);
    }

    @Override
    public void save(Comment comment) {
        commentMapper.insert(comment);
    }

    @Override
    public void delete(Long id) {
        commentMapper.deleteById(id);
    }
}