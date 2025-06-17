const commentApi = {
    // 获取文章的评论列表
    list(articleId) {
        return axios.get(`/api/comments/article/${articleId}`);
    },

    // 添加评论
    create(comment) {
        return axios.post('/api/comments', comment);
    },

    // 删除评论
    delete(id) {
        return axios.delete(`/api/comments/${id}`);
    },

    // 更新评论
    update(id, comment) {
        return axios.put(`/api/comments/${id}`, comment);
    }
}; 