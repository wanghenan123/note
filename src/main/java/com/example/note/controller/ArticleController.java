package com.example.note.controller;

import com.example.note.common.Result;
import com.example.note.entity.Article;
import com.example.note.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public Result<List<Article>> listArticles(@RequestParam(required = false) Integer categoryId,
                                              @RequestParam(required = false) Integer status,
                                              @RequestParam(required = false) Integer authorId,
                                              @RequestParam(required = false) String keyword) {
        return Result.success(articleService.list(categoryId, status, authorId, keyword));
    }

    @GetMapping("/{id}")
    public Result<Article> getArticle(@PathVariable Long id) {
        articleService.incrementViewCount(id);
        return Result.success(articleService.getById(id));
    }

    @GetMapping("/category/{categoryId}")
    public Result<List<Article>> getArticlesByCategory(@PathVariable Long categoryId) {
        return Result.success(articleService.getByCategoryId(categoryId));
    }

    @GetMapping("/author/{authorId}")
    public Result<List<Article>> getArticlesByAuthor(@PathVariable Long authorId) {
        return Result.success(articleService.getByAuthorId(authorId));
    }

    @PostMapping
    public Result<Article> createArticle(@RequestBody Article article) {
        articleService.save(article);
        return Result.success(article);
    }

    @PutMapping("/{id}")
    public Result<Article> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        article.setId(id);
        articleService.update(article);
        return Result.success(article);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteArticle(@PathVariable Long id) {
        articleService.delete(id);
        return Result.success(null);
    }

    @PostMapping("/{id}/like")
    public Result<Void> likeArticle(@PathVariable Long id) {
        articleService.incrementLikeCount(id);
        return Result.success(null);
    }
}