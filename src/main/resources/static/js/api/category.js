const categoryApi = {
    list() {
        return axios.get('/api/categories');
    },

    getById(id) {
        return axios.get(`/api/categories/${id}`);
    },

    create(category) {
        return axios.post('/api/categories', category);
    },

    update(id, category) {
        return axios.put(`/api/categories/${id}`, category);
    },

    delete(id) {
        return axios.delete(`/api/categories/${id}`);
    }
};