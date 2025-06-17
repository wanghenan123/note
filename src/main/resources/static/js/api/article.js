const articleApi = {
    list(params) {
        return axios.get('/api/articles', {
            params: {
                categoryId: params.categoryId,
                status: params.status,  // 添加状态参数：0未发布、1已发布
                authorId: params.authorId,
                keyword: params.keyword  // 添加搜索关键词参数
            }
        });
    },

    getById(id) {
        return axios.get(`/api/articles/${id}`);
    },

    getByCategory(categoryId) {
        return axios.get(`/api/articles/category/${categoryId}`);
    },

    create(article) {
        return axios.post('/api/articles', {
            ...article,
            status: article.status  // 确保有状态值，默认为已发布
        });
    },

    update(id, article) {
        return axios.put(`/api/articles/${id}`, {
            ...article,
            status: article.status  // 确保有状态值，默认为已发布
        });
    },

    delete(id) {
        return axios.delete(`/api/articles/${id}`);
    },

    like(id) {
        return axios.post(`/api/articles/${id}/like`);
    }
}; 