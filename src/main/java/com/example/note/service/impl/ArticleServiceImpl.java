package com.example.note.service.impl;

import com.example.note.entity.Article;
import com.example.note.mapper.ArticleMapper;
import com.example.note.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleMapper articleMapper;

    @Override
    public Article getById(Long id) {
        return articleMapper.selectById(id);
    }

    @Override
    public List<Article> list(Integer categoryId, Integer status, Integer authorId, String keyword) {
        return articleMapper.selectList(categoryId, status, authorId, keyword);
    }

    @Override
    public List<Article> getByCategoryId(Long categoryId) {
        return articleMapper.selectByCategoryId(categoryId);
    }

    @Override
    public List<Article> getByAuthorId(Long authorId) {
        return articleMapper.selectByAuthorId(authorId);
    }

    @Override
    @Transactional
    public void save(Article article) {
        articleMapper.insert(article);
    }

    @Override
    @Transactional
    public void update(Article article) {
        articleMapper.update(article);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        articleMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void incrementViewCount(Long id) {
        articleMapper.updateViewCount(id);
    }

    @Override
    @Transactional
    public void incrementLikeCount(Long id) {
        articleMapper.updateLikeCount(id);
    }
}