package com.example.note.controller;

import com.example.note.common.Result;
import com.example.note.entity.Comment;
import com.example.note.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/{id}")
    public Result<Comment> getComment(@PathVariable Long id) {
        return Result.success(commentService.getById(id));
    }

    @GetMapping("/article/{articleId}")
    public Result<List<Comment>> getArticleComments(@PathVariable Long articleId) {
        return Result.success(commentService.getByArticleId(articleId));
    }

    @GetMapping("/user/{userId}")
    public Result<List<Comment>> getUserComments(@PathVariable Long userId) {
        return Result.success(commentService.getByUserId(userId));
    }

    @PostMapping
    public Result<Comment> createComment(@RequestBody Comment comment) {
        commentService.save(comment);
        return Result.success(comment);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteComment(@PathVariable Long id) {
        commentService.delete(id);
        return Result.success(null);
    }
}