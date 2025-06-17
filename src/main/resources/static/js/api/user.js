const userApi = {
    login(username, password) {
        return axios.post('/api/users/login', { username, password });
    },

    register(user) {
        return axios.post('/api/users/register', user);
    },

    getInfo(id) {
        return axios.get(`/api/users/${id}`);
    },

    update(id, user) {
        return axios.put(`/api/users/${id}`, user);
    }
}; 