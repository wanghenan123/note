const aiAssistantApi = {
    /**
     * 生成文章内容
     * @param {Object} params - 生成参数
     * @param {string} params.prompt - 用户提示
     * @param {string} params.topic - 文章主题
     * @param {string} params.style - 写作风格
     * @param {string} params.length - 文章长度
     * @returns {Promise} - 返回生成内容的Promise
     */
    generateContent(params) {
        return axios.post('/api/ai-assistant/generate', {
            prompt: params.prompt,
            topic: params.topic,
            style: params.style,
            length: params.length
        });
    },
    
    /**
     * 改进文章内容
     * @param {Object} params - 改进参数
     * @param {string} params.content - 原始内容
     * @param {string} params.instruction - 改进指令
     * @returns {Promise} - 返回改进内容的Promise
     */
    improveContent(params) {
        return axios.post('/api/ai-assistant/improve', {
            content: params.content,
            instruction: params.instruction
        });
    }
}; 