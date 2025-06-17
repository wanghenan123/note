package com.example.note.controller;

import com.example.note.common.Result;
import com.example.note.service.AIAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai-assistant")
public class AIAssistantController {

    @Autowired
    private AIAssistantService aiAssistantService;

    @PostMapping("/generate")
    public Result<String> generateContent(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String topic = request.get("topic");
        String style = request.get("style");
        String length = request.get("length");
        
        try {
            String generatedContent = aiAssistantService.generateContent(prompt, topic, style, length);
            return Result.success(generatedContent);
        } catch (Exception e) {
            return Result.error("生成内容失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/improve")
    public Result<String> improveContent(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        String instruction = request.get("instruction");
        
        try {
            String improvedContent = aiAssistantService.improveContent(content, instruction);
            return Result.success(improvedContent);
        } catch (Exception e) {
            return Result.error("优化内容失败: " + e.getMessage());
        }
    }
} 