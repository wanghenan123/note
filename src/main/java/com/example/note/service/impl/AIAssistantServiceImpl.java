package com.example.note.service.impl;

import com.example.note.service.AIAssistantService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIAssistantServiceImpl implements AIAssistantService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Value("${ai.api.key:}")
    private String apiKey;
    
    @Value("${ai.api.url:https://open.bigmodel.cn/api/paas/v4/chat/completions}")
    private String apiUrl;

    @Override
    public String generateContent(String prompt, String topic, String style, String length) {
        try {
            // 构建请求内容
            StringBuilder systemPrompt = new StringBuilder("你是一名专业的文章写作助手。");
            
            if (topic != null && !topic.isEmpty()) {
                systemPrompt.append("请围绕主题「").append(topic).append("」");
            }
            
            if (style != null && !style.isEmpty()) {
                systemPrompt.append("，以「").append(style).append("」的风格");
            }
            
            if (length != null && !length.isEmpty()) {
                systemPrompt.append("，生成大约").append(length).append("字的内容");
            }
            
            systemPrompt.append("。生成的内容应当结构清晰，语言流畅。");
            
            String userPrompt = prompt != null && !prompt.isEmpty() ? prompt : 
                               "请根据要求创作一篇文章";
            
            return callChatGLMApi(systemPrompt.toString(), userPrompt);
        } catch (Exception e) {
            throw new RuntimeException("调用AI服务失败: " + e.getMessage(), e);
        }
    }

    @Override
    public String improveContent(String content, String instruction) {
        try {
            String systemPrompt = "你是一名专业的文章编辑，擅长优化和改进文章内容。请根据指示优化下面的文章，保持原意的同时提高其质量。";
            
            String userPrompt = content;
            if (instruction != null && !instruction.isEmpty()) {
                userPrompt = "请按照以下要求优化文章：" + instruction + "\n\n原文：\n" + content;
            } else {
                userPrompt = "请优化以下文章，提高其可读性和表达质量：\n\n" + content;
            }
            
            return callChatGLMApi(systemPrompt, userPrompt);
        } catch (Exception e) {
            throw new RuntimeException("调用AI服务失败: " + e.getMessage(), e);
        }
    }
    
    private String callChatGLMApi(String systemPrompt, String userPrompt) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        
        List<Map<String, String>> messages = new ArrayList<>();
        
        // 添加系统消息
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);
        messages.add(systemMessage);
        
        // 添加用户消息
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", userPrompt);
        messages.add(userMessage);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "glm-4"); // 使用ChatGLM-4模型
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.7);
        requestBody.put("top_p", 0.8);
        requestBody.put("max_tokens", 2000);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        
        String response = restTemplate.postForObject(apiUrl, request, String.class);
        JsonNode rootNode = objectMapper.readTree(response);
        
        return rootNode.path("choices").get(0).path("message").path("content").asText();
    }
} 