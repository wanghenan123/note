const routes = [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { 
        path: '/', 
        component: ArticleList,
        meta: { requiresAuth: true }
    },
    { 
        path: '/article/:id', 
        component: ArticleDetail,
        meta: { requiresAuth: true }
    }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
    const user = localStorage.getItem('user');
    if (to.meta.requiresAuth && !user) {
        next('/login');
    } else {
        next();
    }
});

const app = Vue.createApp({
    data() {
        return {
            currentUser: null,
            categories: []
        }
    },
    
    created() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
        }
        this.loadCategories();
    },
    
    methods: {
        async loadCategories() {
            try {
                const response = await categoryApi.list();
                this.categories = response.data.data;
            } catch (error) {
                console.error('加载分类失败:', error);
            }
        },
        
        handleLogout() {
            this.currentUser = null;
            localStorage.removeItem('user');
            this.$router.push('/login');
            ElMessage.success('已退出登录');
        },
        
        handleCategorySelect(categoryId) {
            this.$router.push(`/?category=${categoryId}`);
        }
    }
});

app.use(router);
app.use(ElementPlus);
app.mount('#app'); 