package com.example.note.mapper;

import com.example.note.entity.Article;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ArticleMapper {
    Article selectById(Long id);
    List<Article> selectList(Integer categoryId, Integer status, Integer authorId, String keyword);
    List<Article> selectByCategoryId(Long categoryId);
    List<Article> selectByAuthorId(Long authorId);
    int insert(Article article);
    int update(Article article);
    int deleteById(Long id);
    int updateViewCount(Long id);
    int updateLikeCount(Long id);
}