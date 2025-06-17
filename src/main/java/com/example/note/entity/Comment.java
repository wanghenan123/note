package com.example.note.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Comment {
    private Long id;
    private Long articleId;
    private Long userId;
    private String content;
    private Long parentId;
    private LocalDateTime createTime;
}