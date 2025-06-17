package com.example.note.mapper;

import com.example.note.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentMapper {
    Comment selectById(Long id);
    List<Comment> selectByArticleId(Long articleId);
    List<Comment> selectByUserId(Long userId);
    int insert(Comment comment);
    int deleteById(Long id);
}