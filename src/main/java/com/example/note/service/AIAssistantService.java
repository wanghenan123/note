package com.example.note.service;

public interface AIAssistantService {
    /**
     * 根据提示生成文章内容
     * 
     * @param prompt 用户提供的提示
     * @param topic 文章主题
     * @param style 写作风格
     * @param length 文章长度
     * @return 生成的文章内容
     */
    String generateContent(String prompt, String topic, String style, String length);
    
    /**
     * 优化现有文章内容
     * 
     * @param content 原始内容
     * @param instruction 优化指令
     * @return 优化后的内容
     */
    String improveContent(String content, String instruction);
} 